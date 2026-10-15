<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ContentAbout;
use Illuminate\Http\Request;

class AboutSectionController extends Controller
{
    public function getData(Request $request)
    {
        $areaId = $request->integer('area');

        if (! $areaId) {
            return response()->json([]);
        }

        return ContentAbout::where('areaID', $areaId)->orderBy('id', 'asc')->get();
    }
}