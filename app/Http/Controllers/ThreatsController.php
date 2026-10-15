<?php

namespace App\Http\Controllers;

use App\Models\Threats;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThreatsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = trim((string) $request->get('search', ''));

        return DB::table('tbl_threats as threats')
            ->select(
                'threats.id',
                'threats.area_id',
                'threats.article1 as threat1',
                'threats.article2 as threat2',
                'threats.article3 as threat3',
                'area.areaName'
            )
            ->leftJoin('tblmainarea as area', 'threats.area_id', '=', 'area.id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('area.areaName', 'like', "%{$search}%")
                        ->orWhere('threats.article1', 'like', "%{$search}%")
                        ->orWhere('threats.article2', 'like', "%{$search}%")
                        ->orWhere('threats.article3', 'like', "%{$search}%");
                });
            })
            ->orderBy('area.areaName')
            ->orderBy('threats.id')
            ->paginate($perPage);
    }

    public function update(Request $request, Threats $threats)
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer', 'exists:tblmainarea,id'],
            'threat1' => ['nullable', 'string'],
            'threat2' => ['nullable', 'string'],
            'threat3' => ['nullable', 'string'],
        ]);

        $threats->update([
            'area_id' => $validated['area_id'],
            'article1' => $validated['threat1'] ?? '',
            'article2' => $validated['threat2'] ?? '',
            'article3' => $validated['threat3'] ?? '',
        ]);

        return response()->json([
            'message' => 'Threat record updated successfully.',
        ]);
    }
}
