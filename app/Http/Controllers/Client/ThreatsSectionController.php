<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Threats;
use Illuminate\Http\Request;

class ThreatsSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        $data = Threats::where('area_id', $areaId)->get();

        return response()->json($data);
    }
}