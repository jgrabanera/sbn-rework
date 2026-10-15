<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\People;
use Illuminate\Http\Request;

class PeopleSectionController extends Controller
{
    //
    public function getData()
    {
        $data = People::all();
        return response()->json($data);
    }
}
