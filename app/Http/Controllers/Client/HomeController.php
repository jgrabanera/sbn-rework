<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\AreaCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Client/Home');
    }

    public function getData(Request $request)
    {
        $areas = Area::orderBy('id', 'asc')->get();

        return response()->json($areas);
    }


}
