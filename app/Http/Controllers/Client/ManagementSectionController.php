<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Management;
use Illuminate\Http\Request;

class ManagementSectionController extends Controller
{
    //
    public function getData()
    {
        $data = Management::all();
        return response()->json($data);
    }
}
