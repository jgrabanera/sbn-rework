<?php

use App\Http\Controllers\AreaCategoryController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\CategoryListController;
use App\Http\Controllers\ConservationController;
use App\Http\Controllers\ContentAboutController;
use App\Http\Controllers\ContentSightsController;
use App\Http\Controllers\SitesController;
use App\Http\Controllers\EcotourismController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\ResearchesController;
use App\Http\Controllers\ThreatsController;
use App\Http\Controllers\WildlifeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
 * |--------------------------------------------------------------------------
 * | API Routes
 * |--------------------------------------------------------------------------
 * |
 * | Here is where you can register API routes for your application. These
 * | routes are loaded by the RouteServiceProvider and all of them will
 * | be assigned to the "api" middleware group. Make something great!
 * |
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// DATABASE LOAD ROUTES
// Route::get('/loadProtectedArea', [AreaController::class, 'index']);  // paginated
// Route::get('/loadAllAreas', [AreaController::class, 'getAll']);  //

// Route::get('/loadContentAbout', [ContentAboutController::class, 'index']);
// Route::get('/loadContentSights', [ContentSightsController::class, 'index']);
// Route::get('/loadSites', [SitesController::class, 'index']);

// Route::get('/loadAreaCategories', [AreaCategoryController::class, 'index']);
// Route::get('/loadCategoryList', [CategoryListController::class, 'index']);


// Route::get('/wildlife-tabs', [WildlifeController::class, 'index']);
// Route::get('/ecotourism', [EcotourismController::class, 'index']);
// Route::get('/conservation', [ConservationController::class, 'index']);
// Route::get('/people', [PeopleController::class, 'index']);
// Route::get('/threats', [ThreatsController::class, 'index']);
// Route::get('/management', [ManagementController::class, 'index']);
// Route::get('/researches', [ResearchesController::class, 'index']);

// // Additional route for getting category list with join
// Route::get('/loadAreaCategoryList', [AreaCategoryController::class, 'getCategoryList']);
