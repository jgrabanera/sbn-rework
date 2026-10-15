<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\AreaCategory;
use App\Models\CategoryList;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaCategorySectionController extends Controller
{
    public function index($areaID, $sectionID)
    {
        $area = Area::where("id", $areaID)->first();

        $section = AreaCategory::where("areaID", $area->id) //tbl_area_category
            ->where("area_category_id", $sectionID)
            ->first();

        return Inertia::render('Client/AreaCategorySections', [
            'area' => $area,
            'sectionId' => (string) $sectionID,
            'section' => $section,
        ]);
    }

    public function getData(Request $request)
    {
        //return $request;


        $data = DB::table('tbl_area_category as ar')
            ->select('ar.areaID', 'ar.area_category_id', 'cat.categoryName', 'cat.iconPath')
            ->leftJoin('tbl_category as cat', 'ar.area_category_id', '=', 'cat.id')
            ->where('areaID', $request->area)
            ->orderBy('ar.areaID')
            ->orderBy('ar.area_category_id')
            ->get();


        return response()->json($data);

    }
}
