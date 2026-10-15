<?php

namespace App\Http\Controllers;

use App\Models\ContentSights;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ContentSightsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        $query = DB::table('tbl_site_to_see_content as sights')
            ->select(
                'sights.id',
                'sights.areaID',
                'sights.site_name',
                'sights.content',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'sights.areaID', '=', 'area.id');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('area.areaName', 'like', "%{$search}%")
                    ->orWhere('sights.site_name', 'like', "%{$search}%")
                    ->orWhere('sights.content', 'like', "%{$search}%");
            });
        }

        return $query
            ->orderBy('area.areaName')
            ->orderBy('sights.site_name')
            ->paginate($perPage);
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'areaID' => ['required', 'integer', 'exists:tblmainarea,id'],
            'site_name' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        $this->ensureUniquePair(
            $validated['areaID'],
            $validated['site_name']
        );

        $record = ContentSights::create([
            'areaID' => $validated['areaID'],
            'site_name' => $validated['site_name'],
            'content' => $this->convertToPlainHtml($validated['content'] ?? '') ?? null,
        ]);

        return response()->json([
            'message' => 'Sights content created successfully.',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, ContentSights $contentSight)
    {
        $validated = $request->validate([
            'areaID' => ['required', 'integer', 'exists:tblmainarea,id'],
            'site_name' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        $this->ensureUniquePair(
            $validated['areaID'],
            $validated['site_name'],
            $contentSight->id
        );

        $contentSight->update([
            'areaID' => $validated['areaID'],
            'site_name' => $validated['site_name'],
            'content' => $this->convertToPlainHtml($validated['content'] ?? '') ?? null,
        ]);

        return response()->json([
            'message' => 'Sights content updated successfully.',
            'data' => $contentSight->fresh(),
        ]);
    }

    public function destroy(ContentSights $contentSight)
    {
        $contentSight->delete();

        return response()->json([
            'message' => 'Sights content deleted successfully.',
        ]);
    }

    public function uploadEditorImage(Request $request)
    {
        $validated = $request->validate([
            'upload' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $path = $request->file('upload')->store('images', 'public');

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }

    private function ensureUniquePair(int $areaId, string $siteName, ?int $ignoreId = null): void
    {
        $exists = ContentSights::query()
            ->where('areaID', $areaId)
            ->whereRaw('LOWER(site_name) = ?', [mb_strtolower($siteName)])
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'site_name' => ['This area/site combination already exists.'],
            ]);
        }
    }
}
