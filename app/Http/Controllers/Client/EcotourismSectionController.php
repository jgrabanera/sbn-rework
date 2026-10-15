<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Ecotourism;
use Illuminate\Http\Request;

class EcotourismSectionController extends Controller
{

    public function getData()
    {
        $data = Ecotourism::all();
        return response()->json($data);
    }
}
