<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Threats;
use Illuminate\Http\Request;

class ThreatsSectionController extends Controller
{
    //
    public function getData()
    {
        $data = Threats::all();
        return response()->json($data);
    }
}
