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
        $areaID = $request->integer('area');

        if (! $areaID) {
            return response()->json([]);
        }

        // tbl_area_category carries its own categoryName column, so no
        // join against tbl_category is needed here.
        $areaCategory = AreaCategory::where('areaID', $areaID)
            ->orderBy('area_category_id')
            ->get();

        return response()->json($areaCategory);
    }

}
