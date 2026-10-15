<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Researches;
use Illuminate\Http\Request;

class ResearchSectionController extends Controller
{
    //
    public function getData()
    {
        $data = Researches::all();
        return response()->json($data);
    }
}
