<?php

namespace App\Http\Controllers;

use App\Services\RichTextService;
use App\Models\People;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PeopleController extends Controller
{
    public function __construct(
        protected RichTextService $richText,
    ) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return DB::table('tbl_people as people')
            ->select(
                'people.id',
                'people.area_id',
                'people.article1',
                'people.article2',
                'people.article3',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'people.area_id', '=', 'area.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('area.areaName', 'like', "%{$search}%")
                        ->orWhere('people.article1', 'like', "%{$search}%")
                        ->orWhere('people.article2', 'like', "%{$search}%")
                        ->orWhere('people.article3', 'like', "%{$search}%");
                });
            })
            ->orderBy('area.areaName')
            ->orderBy('people.id')
            ->paginate($perPage);
    }


    public function update(Request $request, People $people)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'article1' => ['nullable', 'string'],
            'article2' => ['nullable', 'string'],
            'article3' => ['nullable', 'string'],
        ]);

        $people->update($validated);

        return response()->json([
            'message' => 'People record updated successfully.',
        ]);
    }
}
