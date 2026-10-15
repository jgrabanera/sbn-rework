<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\WildlifeTabs;
use Illuminate\Http\Request;

class WildlifeSectionController extends Controller
{
    //
    public function getData()
    {
        $data = WildlifeTabs::with('wildlifeItems.contents')->get();

        return response()->json($data);
    }
}





