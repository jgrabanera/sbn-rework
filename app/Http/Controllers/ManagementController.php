<?php

namespace App\Http\Controllers;

use App\Models\Management;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManagementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return DB::table('tbl_management as management')
            ->select(
                'management.id',
                'management.area_id',
                'management.image_url',
                'management.article1',
                'management.article2',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'management.area_id', '=', 'area.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('area.areaName', 'like', "%{$search}%")
                        ->orWhere('management.article1', 'like', "%{$search}%")
                        ->orWhere('management.article2', 'like', "%{$search}%")
                        ->orWhere('management.image_url', 'like', "%{$search}%");
                });
            })
            ->orderBy('area.areaName')
            ->orderBy('management.id')
            ->paginate($perPage);
    }

    public function convertToPlainHtml($description)
    {
        $dom = new \DOMDocument();

        libxml_use_internal_errors(true);

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

    public function update(Request $request, Management $management)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'article1' => ['nullable', 'string'],
            'article2' => ['nullable', 'string'],
        ]);

        $payload = [
            'area_id' => $validated['area_id'],
            'article1' => $this->convertToPlainHtml($validated['article1'] ?? ''),
            'article2' => $this->convertToPlainHtml($validated['article2'] ?? ''),
        ];

        if ($request->hasFile('image')) {
            if ($management->image_url) {
                Storage::disk('public')->delete('images/' . $management->image_url);
            }

            $payload['image_url'] = basename(
                $request->file('image')->store('images', 'public')
            );
        }

        $management->update($payload);

        return response()->json([
            'message' => 'Management record updated successfully.',
        ]);
    }
}
