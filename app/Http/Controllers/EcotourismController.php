<?php

namespace App\Http\Controllers;

use App\Services\RichTextService;
use App\Models\Ecotourism;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EcotourismController extends Controller
{
    public function __construct(
        protected RichTextService $richText,
    ) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return DB::table('tbl_ecotourism as ecotourism')
            ->select(
                'ecotourism.id',
                'ecotourism.area_id',
                'ecotourism.image_url',
                'ecotourism.article1',
                'ecotourism.article2',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'ecotourism.area_id', '=', 'area.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('area.areaName', 'like', "%{$search}%")
                        ->orWhere('ecotourism.article1', 'like', "%{$search}%")
                        ->orWhere('ecotourism.article2', 'like', "%{$search}%")
                        ->orWhere('ecotourism.image_url', 'like', "%{$search}%");
                });
            })
            ->orderBy('area.areaName')
            ->orderBy('ecotourism.id')
            ->paginate($perPage);
    }


    public function update(Request $request, Ecotourism $ecotourism)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'article1' => ['nullable', 'string'],
            'article2' => ['nullable', 'string'],
        ]);

        $payload = [
            'area_id' => $validated['area_id'],
            'article1' => $this->richText->convertToPlainHtml($validated['article1'] ?? ''),
            'article2' => $this->richText->convertToPlainHtml($validated['article2'] ?? ''),
        ];

        if ($request->hasFile('image')) {
            if ($ecotourism->image_url) {
                Storage::disk('public')->delete('images/' . $ecotourism->image_url);
            }

            $payload['image_url'] = basename(
                $request->file('image')->store('images', 'public')
            );
        }

        $ecotourism->update($payload);

        return response()->json([
            'message' => 'Ecotourism record updated successfully.',
        ]);
    }
}
