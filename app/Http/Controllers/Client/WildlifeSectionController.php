<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\WildlifeTabs;
use Illuminate\Http\Request;

class WildlifeSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        $data = WildlifeTabs::with('wildlifeItems.contents')
            ->where('area_id', $areaId)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($data);
    }
}