<?php

namespace App\Http\Controllers;

use App\Models\AreaCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AreaCategoryController extends Controller
{
    //
    public function index(Request $request)
    {
        // return $request;
        return AreaCategory::orderBy('area_category_id', 'asc')->get();
    }

    public function getCategoryList(Request $request)
    {
        $data = DB::table('tbl_area_category as ar')
            ->select('ar.areaID', 'ar.area_category_id', 'cat.categoryName', 'cat.iconPath')
            ->leftJoin('tbl_category as cat', 'ar.area_category_id', '=', 'cat.id')
            ->orderBy('ar.areaID')
            ->orderBy('ar.area_category_id')
            ->get();

        return response()->json($data);
    }
}
