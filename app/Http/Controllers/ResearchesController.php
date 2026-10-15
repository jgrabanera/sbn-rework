<?php

namespace App\Http\Controllers;

use App\Models\Researches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ResearchesController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return DB::table('tbl_researches as researches')
            ->select(
                'researches.id',
                'researches.area_id',
                'researches.pdf_title',
                'researches.pdf_url',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'researches.area_id', '=', 'area.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('area.areaName', 'like', "%{$search}%")
                        ->orWhere('researches.pdf_title', 'like', "%{$search}%")
                        ->orWhere('researches.pdf_url', 'like', "%{$search}%");
                });
            })
            ->orderBy('area.areaName')
            ->orderBy('researches.id')
            ->paginate($perPage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'pdf_title' => ['nullable', 'string', 'max:255'],
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $storedPdfPath = $request->file('pdf')->store('pdf', 'public');

        DB::transaction(function () use ($validated, $storedPdfPath) {
            $nextId = (int) DB::table('tbl_researches')
                ->lockForUpdate()
                ->max('id') + 1;

            Researches::create([
                'id' => $nextId,
                'area_id' => $validated['area_id'],
                'pdf_title' => $validated['pdf_title'] ?? '',
                'pdf_url' => '/storage/' . $storedPdfPath,
            ]);
        });

        return response()->json([
            'message' => 'Research record created successfully.',
        ], 201);
    }

    public function update(Request $request, Researches $researches)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'pdf_title' => ['nullable', 'string', 'max:255'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $payload = [
            'area_id' => $validated['area_id'],
            'pdf_title' => $validated['pdf_title'] ?? '',
        ];

        if ($request->hasFile('pdf')) {
            if ($researches->pdf_url) {
                $storedPdfPath = Str::after($researches->pdf_url, '/storage/');

                if ($storedPdfPath !== $researches->pdf_url) {
                    Storage::disk('public')->delete($storedPdfPath);
                } else {
                    Storage::disk('public')->delete('pdf/' . basename($researches->pdf_url));
                }
            }

            $storedPdfPath = $request->file('pdf')->store('pdf', 'public');
            $payload['pdf_url'] = '/storage/' . $storedPdfPath;
        }

        $researches->update($payload);

        return response()->json([
            'message' => 'Research record updated successfully.',
        ]);
    }

    public function destroy(Researches $researches)
    {
        if ($researches->pdf_url) {
            $storedPdfPath = Str::after($researches->pdf_url, '/storage/');

            if ($storedPdfPath !== $researches->pdf_url) {
                Storage::disk('public')->delete($storedPdfPath);
            } else {
                Storage::disk('public')->delete('pdf/' . basename($researches->pdf_url));
            }
        }

        $researches->delete();

        return response()->json([
            'message' => 'Research record deleted successfully.',
        ]);
    }
}
