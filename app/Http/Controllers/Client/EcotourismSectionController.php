<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Ecotourism;
use Illuminate\Http\Request;

class EcotourismSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        $data = Ecotourism::where('area_id', $areaId)->get();

        return response()->json($data);
    }
}