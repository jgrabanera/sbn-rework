<?php

namespace App\Http\Controllers;

use App\Models\ContentAbout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ContentAboutController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        $query = DB::table('tbl_content_about as about')
            ->select(
                'about.id',
                'about.areaID',
                'about.tabID',
                'about.imagePath1',
                'about.imagePath2',
                'about.content',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'about.areaID', '=', 'area.id');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('area.areaName', 'like', "%{$search}%")
                    ->orWhere('about.content', 'like', "%{$search}%")
                    ->orWhere('about.tabID', 'like', "%{$search}%");
            });
        }

        return $query
            ->orderBy('area.areaName')
            ->orderBy('about.tabID')
            ->paginate($perPage);
    }

    public function getData(Request $request)
    {
        $data = ContentAbout::orderBy('created_at', 'desc')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'areaID' => ['required', 'integer', 'exists:tblmainarea,id'],
            'tabID' => ['required', 'integer', 'in:1,2,3'],
            'content' => ['nullable', 'string'],
            'image1' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'image2' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $this->ensureUniquePair($validated['areaID'], $validated['tabID']);

        $payload = [
            'areaID' => $validated['areaID'],
            'tabID' => $validated['tabID'],
            'content' => $validated['content'] ?? null,
        ];

        if ($request->hasFile('image1')) {
            $payload['imagePath1'] = basename(
                $request->file('image1')->store('images', 'public')
            );
        }

        if ($request->hasFile('image2')) {
            $payload['imagePath2'] = basename(
                $request->file('image2')->store('images', 'public')
            );
        }

        $record = ContentAbout::create($payload);

        return response()->json([
            'message' => 'About content created successfully.',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, ContentAbout $about)
    {
        $validated = $request->validate([
            'areaID' => ['required', 'integer', 'exists:tblmainarea,id'],
            'tabID' => ['required', 'integer', 'in:1,2,3'],
            'content' => ['nullable', 'string'],
            'image1' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'image2' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $this->ensureUniquePair(
            $validated['areaID'],
            $validated['tabID'],
            $about->id
        );

        $payload = [
            'areaID' => $validated['areaID'],
            'tabID' => $validated['tabID'],
            'content' => $validated['content'] ?? null,
        ];

        if ($request->hasFile('image1')) {
            if ($about->imagePath1) {
                Storage::disk('public')->delete('images/' . $about->imagePath1);
            }

            $payload['imagePath1'] = basename(
                $request->file('image1')->store('images', 'public')
            );
        }

        if ($request->hasFile('image2')) {
            if ($about->imagePath2) {
                Storage::disk('public')->delete('images/' . $about->imagePath2);
            }

            $payload['imagePath2'] = basename(
                $request->file('image2')->store('images', 'public')
            );
        }

        $about->update($payload);

        return response()->json([
            'message' => 'About content updated successfully.',
            'data' => $about->fresh(),
        ]);
    }

    public function destroy(ContentAbout $about)
    {
        if ($about->imagePath1) {
            Storage::disk('public')->delete('images/' . $about->imagePath1);
        }

        if ($about->imagePath2) {
            Storage::disk('public')->delete('images/' . $about->imagePath2);
        }

        $about->delete();

        return response()->json([
            'message' => 'About content deleted successfully.',
        ]);
    }

    private function ensureUniquePair(int $areaId, int $tabId, ?int $ignoreId = null): void
    {
        $exists = ContentAbout::query()
            ->where('areaID', $areaId)
            ->where('tabID', $tabId)
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'tabID' => ['This area/tab combination already exists.'],
            ]);
        }
    }
}
