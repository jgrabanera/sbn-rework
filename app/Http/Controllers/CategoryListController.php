<?php

namespace App\Http\Controllers;

use App\Models\CategoryList;
use Illuminate\Http\Request;

class CategoryListController extends Controller
{
    //
    public function index()
    {
        return CategoryList::orderBy('id', 'asc')->get();
    }
}
