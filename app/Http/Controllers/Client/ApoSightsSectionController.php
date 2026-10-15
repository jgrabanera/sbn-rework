<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ContentSights;
use Illuminate\Http\Request;

class ApoSightsSectionController extends Controller
{
    //
    public function getData()
    {
        return ContentSights::orderBy('id', 'asc')->get();
    }
}
