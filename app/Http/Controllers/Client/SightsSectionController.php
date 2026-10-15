<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Sites;
use Illuminate\Http\Request;

class SightsSectionController extends Controller
{
    //
    public function getData()
    {
        return Sites::orderBy('id', 'asc')->get();
    }
}
