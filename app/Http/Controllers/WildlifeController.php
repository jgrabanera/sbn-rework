<?php

namespace App\Http\Controllers;

use App\Models\WildlifeItem;
use App\Models\WildlifeItemContent;
use App\Models\WildlifeTabs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WildlifeController extends Controller
{
    public function tabs(Request $request)
    {
        $areaId = $request->integer('area_id');

        return WildlifeTabs::query()
            ->select('id', 'area_id', 'tab_name')
            ->when($areaId, function ($query) use ($areaId) {
                $query->where('area_id', $areaId);
            })
            ->orderBy('tab_name')
            ->get();
    }
    public function convertToPlainHtml($description)
    {
        $dom = new \DOMDocument();

        libxml_use_internal_errors(true);

        // Force UTF-8 encoding
        $dom->loadHTML(
            '<?xml encoding="utf-8" ?>' . $description,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->getAttribute('src');

            if (Str::contains($src, 'data:image')) {
                preg_match('/data:image\/(\w+);base64,/', $src, $match);
                $extension = $match[1];

                $base64 = preg_replace('/^data:image\/\w+;base64,/', '', $src);
                $imageData = base64_decode($base64);

                $filename = 'images/' . uniqid() . '.' . $extension;

                Storage::disk('public')->put($filename, $imageData);
                $img->setAttribute('src', '/storage/' . $filename);
            }
        }

        return $dom->saveHTML();
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        $firstContentSubquery = DB::table('tbl_wildlife_item_content as content')
            ->selectRaw('MIN(content.id) as content_id, content.wildlife_item_id')
            ->groupBy('content.wildlife_item_id');

        $query = DB::table('tbl_wildlife_item as item')
            ->select(
                'item.id',
                'item.wildlife_tab_id',
                'tab.id as tab_id',
                'tab.area_id',
                'tab.tab_name',
                'item.thumbnail_url',
                'content.id as content_id',
                'content.content',
                'area.areaName'
            )
            ->join('tbl_wildlife_tabs as tab', 'item.wildlife_tab_id', '=', 'tab.id')
            ->leftJoinSub($firstContentSubquery, 'first_content', function ($join) {
                $join->on('first_content.wildlife_item_id', '=', 'item.id');
            })
            ->leftJoin('tbl_wildlife_item_content as content', 'content.id', '=', 'first_content.content_id')
            ->leftJoin('tblmainarea as area', 'tab.area_id', '=', 'area.id');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('area.areaName', 'like', "%{$search}%")
                    ->orWhere('tab.tab_name', 'like', "%{$search}%")
                    ->orWhere('item.thumbnail_url', 'like', "%{$search}%")
                    ->orWhere('content.content', 'like', "%{$search}%");
            });
        }

        return $query
            ->orderBy('area.areaName')
            ->orderBy('tab.tab_name')
            ->orderBy('item.id')
            ->paginate($perPage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'tab_name' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $result = DB::transaction(function () use ($request, $validated) {
            $tab = $this->firstOrCreateTab(
                $validated['area_id'],
                $validated['tab_name']
            );

            $thumbnailPath = basename(
                $request->file('thumbnail')->store('images', 'public')
            );

            $itemId = $this->nextTableId('tbl_wildlife_item');
            $item = WildlifeItem::create([
                'id' => $itemId,
                'wildlife_tab_id' => $tab->id,
                'thumbnail_url' => $thumbnailPath,
            ]);

            $content = WildlifeItemContent::create([
                'id' => $this->nextTableId('tbl_wildlife_item_content'),
                'wildlife_item_id' => $itemId,
                'content' => $this->convertToPlainHtml($validated['content'] ?? ''),
            ]);

            return [
                'tab' => $tab,
                'item' => $item,
                'content' => $content,
            ];
        });

        return response()->json([
            'message' => 'Wildlife item created successfully.',
            'data' => $result,
        ], 201);
    }

    public function update(Request $request, WildlifeItem $wildlife)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'tab_name' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        DB::transaction(function () use ($request, $validated, $wildlife) {
            $oldTabId = $wildlife->wildlife_tab_id;

            $tab = $this->firstOrCreateTab(
                $validated['area_id'],
                $validated['tab_name']
            );

            $payload = [
                'wildlife_tab_id' => $tab->id,
            ];

            if ($request->hasFile('thumbnail')) {
                if ($wildlife->thumbnail_url) {
                    Storage::disk('public')->delete('images/' . $wildlife->thumbnail_url);
                }

                $payload['thumbnail_url'] = basename(
                    $request->file('thumbnail')->store('images', 'public')
                );
            }

            $wildlife->update($payload);

            $content = $wildlife->contents()->orderBy('id')->first();

            if ($content) {
                $content->update([
                    'content' => $this->convertToPlainHtml($validated['content'] ?? ''),
                ]);
            } else {
                WildlifeItemContent::create([
                    'id' => $this->nextTableId('tbl_wildlife_item_content'),
                    'wildlife_item_id' => $wildlife->id,
                    'content' => $this->convertToPlainHtml($validated['content'] ?? ''),
                ]);
            }

            $this->deleteTabIfEmpty($oldTabId);
        });

        return response()->json([
            'message' => 'Wildlife item updated successfully.',
            'data' => $wildlife->fresh('tab', 'contents'),
        ]);
    }

    public function destroy(WildlifeItem $wildlife)
    {
        DB::transaction(function () use ($wildlife) {
            $tabId = $wildlife->wildlife_tab_id;

            if ($wildlife->thumbnail_url) {
                Storage::disk('public')->delete('images/' . $wildlife->thumbnail_url);
            }

            $wildlife->contents()->delete();
            $wildlife->delete();

            $this->deleteTabIfEmpty($tabId);
        });

        return response()->json([
            'message' => 'Wildlife item deleted successfully.',
        ]);
    }

    private function firstOrCreateTab(int $areaId, string $tabName): WildlifeTabs
    {
        $existing = WildlifeTabs::query()
            ->where('area_id', $areaId)
            ->whereRaw('LOWER(tab_name) = ?', [mb_strtolower($tabName)])
            ->first();

        if ($existing) {
            return $existing;
        }

        return WildlifeTabs::create([
            'id' => $this->nextTableId('tbl_wildlife_tabs'),
            'area_id' => $areaId,
            'tab_name' => $tabName,
        ]);
    }

    private function nextTableId(string $table): int
    {
        return (int) DB::table($table)
            ->lockForUpdate()
            ->max('id') + 1;
    }

    private function deleteTabIfEmpty(?int $tabId): void
    {
        if (!$tabId) {
            return;
        }

        $tab = WildlifeTabs::find($tabId);

        if ($tab && !$tab->wildlifeItems()->exists()) {
            $tab->delete();
        }
    }
}
