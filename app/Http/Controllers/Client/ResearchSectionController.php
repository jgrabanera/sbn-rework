<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Researches;
use Illuminate\Http\Request;

class ResearchSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        $data = Researches::where('area_id', $areaId)->get();

        return response()->json($data);
    }
}