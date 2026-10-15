<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Conservation;
use Illuminate\Http\Request;

class ConservationSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        $data = Conservation::where('area_id', $areaId)->get();

        return response()->json($data);
    }
}