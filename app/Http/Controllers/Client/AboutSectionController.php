<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ContentAbout;
use Illuminate\Http\Request;

class AboutSectionController extends Controller
{
    public function getData(Request $request)
    {
        return ContentAbout::orderBy('id', 'asc')->get();
    }
}
