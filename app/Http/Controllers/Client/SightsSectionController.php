<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Sites;
use Illuminate\Http\Request;

class SightsSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        return Sites::where('area_id', $areaId)->orderBy('id', 'asc')->get();
    }
}