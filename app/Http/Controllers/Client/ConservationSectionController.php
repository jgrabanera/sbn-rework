<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Conservation;
use Illuminate\Http\Request;

class ConservationSectionController extends Controller
{
    //
    public function getData()
    {
        $data = Conservation::all();
        return response()->json($data);
    }
}
