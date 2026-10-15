<?php

namespace App\Http\Controllers\Client;
use App\Http\Controllers\Controller;

use App\Models\Area;
use App\Models\AreaCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProtectedAreaController extends Controller
{
    //
    public function index($areaID)
    {
        $area = Area::where("id", $areaID)->first();

        $areaCategories = AreaCategory::where("areaID", $area->id)
            ->get();

        //return $areaCategories;

        return Inertia::render('Client/AreaCategory', [
            'area' => $area,
        ]);
    }

    public function getData(Request $request)
    {
        //return $request;

        $areaID = $request->area;

        $areaCategory = AreaCategory::where('areaID', $areaID)->get();

        return $areaCategory;

    }

}
