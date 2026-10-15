<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AreaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return Area::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('areaName', 'like', "%{$search}%")
                        ->orWhere('areaDescription', 'like', "%{$search}%")
                        ->orWhere('areaVideo', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getAll(Request $request)
    {
        return Area::orderBy('id', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'areaName' => ['required', 'string', 'max:255'],
            'areaDescription' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/x-msvideo,video/quicktime,video/x-m4v,video/mpeg', 'max:51200'],
        ]);

        $payload = [
            'areaName' => $validated['areaName'],
            'areaDescription' => $validated['areaDescription'] ?? null,
        ];

        if ($request->hasFile('image')) {
            $payload['imagePath'] = basename(
                $request->file('image')->store('images', 'public')
            );
        }

        if ($request->hasFile('video')) {
            $payload['areaVideo'] = basename(
                $request->file('video')->store('videos', 'public')
            );
        }

        $area = Area::create($payload);

        return response()->json([
            'message' => 'Protected area created successfully.',
            'data' => $area,
        ], 201);
    }

    public function update(Request $request, Area $area)
    {
        $validated = $request->validate([
            'areaName' => ['required', 'string', 'max:255'],
            'areaDescription' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/x-msvideo,video/quicktime,video/x-m4v,video/mpeg', 'max:51200'],
        ]);

        $payload = [
            'areaName' => $validated['areaName'],
            'areaDescription' => $validated['areaDescription'] ?? null,
        ];

        if ($request->hasFile('image')) {
            if ($area->imagePath) {
                Storage::disk('public')->delete('images/' . $area->imagePath);
            }

            $payload['imagePath'] = basename(
                $request->file('image')->store('images', 'public')
            );
        }

        if ($request->hasFile('video')) {
            if ($area->areaVideo) {
                Storage::disk('public')->delete('videos/' . $area->areaVideo);
            }

            $payload['areaVideo'] = basename(
                $request->file('video')->store('videos', 'public')
            );
        }

        $area->update($payload);

        return response()->json([
            'message' => 'Protected area updated successfully.',
            'data' => $area->fresh(),
        ]);
    }

    public function destroy(Area $area)
    {
        if ($area->imagePath) {
            Storage::disk('public')->delete('images/' . $area->imagePath);
        }

        if ($area->areaVideo) {
            Storage::disk('public')->delete('videos/' . $area->areaVideo);
        }

        $area->delete();

        return response()->json([
            'message' => 'Protected area deleted successfully.',
        ]);
    }
}
