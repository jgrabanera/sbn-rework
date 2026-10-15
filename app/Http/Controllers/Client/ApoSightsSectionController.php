<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ContentSights;
use Illuminate\Http\Request;

class ApoSightsSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        return ContentSights::where('areaID', $areaId)->orderBy('id', 'asc')->get();
    }
}