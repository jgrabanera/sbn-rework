<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\AdminSummaryController;
use App\Http\Controllers\ConservationController;
use App\Http\Controllers\ContentSightsController;
use App\Http\Controllers\ContentAboutController;
use App\Http\Controllers\EcotourismController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizCmsController;
use App\Http\Controllers\ResearchesController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ThreatsController;
use App\Http\Controllers\WildlifeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\Client\HomeController::class, 'index'])->name('reas.index');
Route::get('/get-areas', [App\Http\Controllers\Client\HomeController::class, 'getData']);

Route::get('/protected-area/{area}', [App\Http\Controllers\Client\ProtectedAreaController::class, 'index'])->name('protected-area.index');
Route::get('/get-protected-area', [App\Http\Controllers\Client\ProtectedAreaController::class, 'getData']);

Route::get('/protected-area/{area}/section/{section}', [App\Http\Controllers\Client\AreaCategorySectionController::class, 'index'])->name('protected-area-section.index');
Route::get('/get-protected-area-section', [App\Http\Controllers\Client\AreaCategorySectionController::class, 'getData']);

// TABS
Route::get('/get-about-section', [App\Http\Controllers\Client\AboutSectionController::class, 'getData']);
Route::get('/get-apo-sights-section', [App\Http\Controllers\Client\ApoSightsSectionController::class, 'getData']);
Route::get('/get-sights-section', [App\Http\Controllers\Client\SightsSectionController::class, 'getData']);
Route::get('/get-wildlife-section', [App\Http\Controllers\Client\WildlifeSectionController::class, 'getData']);
Route::get('/get-ecotourism-section', [App\Http\Controllers\Client\EcotourismSectionController::class, 'getData']);
Route::get('/get-conservation-section', [App\Http\Controllers\Client\ConservationSectionController::class, 'getData']);
Route::get('/get-people-section', [App\Http\Controllers\Client\PeopleSectionController::class, 'getData']);
Route::get('/get-threats-section', [App\Http\Controllers\Client\ThreatsSectionController::class, 'getData']);
Route::get('/get-management-section', [App\Http\Controllers\Client\ManagementSectionController::class, 'getData']);
Route::get('/get-researches-section', [App\Http\Controllers\Client\ResearchSectionController::class, 'getData']);
Route::post('/storeReview', [ReviewController::class, 'store']);


// QUIZ
Route::get('/quiz', [App\Http\Controllers\Quiz\QuizController::class, 'index'])->name('quiz.index');
Route::get('/quiz/start', [App\Http\Controllers\Quiz\QuizController::class, 'start'])->name('quiz.start');
Route::get('/quiz/get-questions', [App\Http\Controllers\Quiz\QuizController::class, 'getQuestions'])->name('quiz.get-questions');
Route::get('/quiz/{quizNum}/question', [App\Http\Controllers\Quiz\QuestionController::class, 'index'])->name('question.index');
Route::post('/quiz/{quizNum}/answer', [App\Http\Controllers\Quiz\QuestionController::class, 'submit'])->name('question.submit');
Route::get('/quiz/result', [App\Http\Controllers\Quiz\QuizController::class, 'result'])->name('quiz.result');
// Route::post('/quiz', [App\Http\Controllers\Client\QuizController::class, 'store'])->name('quiz.store');






Route::get('/admin', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Cms/Dashboard');
    })->name('dashboard');

    Route::get('/area-category', function () {
        return Inertia::render('Cms/AreaCategory');
    })->name('area-category');

    Route::get('/about-category', function () {
        return Inertia::render('Cms/AboutCategory');
    })->name('about-category');

    Route::get('/sights-category', function () {
        return Inertia::render('Cms/SightsCategory');
    })->name('sights-category');

    Route::get('/wildlife-category', function () {
        return Inertia::render('Cms/WildlifeCategory');
    })->name('wildlife-category');

    Route::get('/ecotourism-category', function () {
        return Inertia::render('Cms/EcotourismCategory');
    })->name('ecotourism-category');

    Route::get('/conservation-category', function () {
        return Inertia::render('Cms/ConservationCategory');
    })->name('conservation-category');

    Route::get('/people-category', function () {
        return Inertia::render('Cms/PeopleCategory');
    })->name('people-category');

    Route::get('/threats-category', function () {
        return Inertia::render('Cms/ThreatsCategory');
    })->name('threats-category');

    Route::get('/researches-category', function () {
        return Inertia::render('Cms/ResearchesCategory');
    })->name('researches-category');

    Route::get('/management-category', function () {
        return Inertia::render('Cms/ManagementCategory');
    })->name('management-category');

    Route::get('/dos-and-donts-category', function () {
        return Inertia::render('Cms/DosAndDontsCategory');
    })->name('dos-and-donts-category');

    Route::get('/quiz-category', function () {
        return Inertia::render('Cms/QuizCategory');
    })->name('quiz-category');

    // DATABASE LOAD ROUTES
    Route::get('/loadProtectedArea', [AreaController::class, 'index']);
    Route::get('/loadAllAreas', [AreaController::class, 'getAll']);
    Route::post('/storeArea', [AreaController::class, 'store']);
    Route::post('/updateArea/{area}', [AreaController::class, 'update']);
    Route::delete('/deleteArea/{area}', [AreaController::class, 'destroy']);
    Route::get('/loadContentAbout', [ContentAboutController::class, 'index']);
    Route::post('/storeContentAbout', [ContentAboutController::class, 'store']);
    Route::post('/updateContentAbout/{about}', [ContentAboutController::class, 'update']);
    Route::delete('/deleteContentAbout/{about}', [ContentAboutController::class, 'destroy']);
    Route::get('/loadContentSights', [ContentSightsController::class, 'index']);
    Route::post('/storeContentSights', [ContentSightsController::class, 'store']);
    Route::post('/updateContentSights/{contentSight}', [ContentSightsController::class, 'update']);
    Route::delete('/deleteContentSights/{contentSight}', [ContentSightsController::class, 'destroy']);
    Route::post('/uploadContentSightsEditorImage', [ContentSightsController::class, 'uploadEditorImage']);
    Route::get('/loadEcotourismItems', [EcotourismController::class, 'index']);
    Route::post('/updateEcotourismItem/{ecotourism}', [EcotourismController::class, 'update']);
    Route::get('/loadConservationItems', [ConservationController::class, 'index']);
    Route::post('/updateConservationItem/{conservation}', [ConservationController::class, 'update']);
    Route::get('/loadPeopleItems', [PeopleController::class, 'index']);
    Route::post('/updatePeopleItem/{people}', [PeopleController::class, 'update']);
    Route::get('/loadThreatItems', [ThreatsController::class, 'index']);
    Route::post('/updateThreatItem/{threats}', [ThreatsController::class, 'update']);
    Route::get('/loadManagementItems', [ManagementController::class, 'index']);
    Route::post('/updateManagementItem/{management}', [ManagementController::class, 'update']);
    Route::get('/loadResearchItems', [ResearchesController::class, 'index']);
    Route::post('/storeResearchItem', [ResearchesController::class, 'store']);
    Route::post('/updateResearchItem/{researches}', [ResearchesController::class, 'update']);
    Route::delete('/deleteResearchItem/{researches}', [ResearchesController::class, 'destroy']);
    Route::get('/loadWildlifeTabs', [WildlifeController::class, 'tabs']);
    Route::get('/loadWildlifeItems', [WildlifeController::class, 'index']);
    Route::post('/storeWildlifeItem', [WildlifeController::class, 'store']);
    Route::post('/updateWildlifeItem/{wildlife}', [WildlifeController::class, 'update']);
    Route::delete('/deleteWildlifeItem/{wildlife}', [WildlifeController::class, 'destroy']);
    Route::get('/loadQuizItems', [QuizCmsController::class, 'index']);
    Route::post('/storeQuizItem', [QuizCmsController::class, 'store']);
    Route::post('/updateQuizItem/{quiz}', [QuizCmsController::class, 'update']);
    Route::delete('/deleteQuizItem/{quiz}', [QuizCmsController::class, 'destroy']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/admin/summary', [AdminSummaryController::class, 'index']);
});

require __DIR__ . '/auth.php';
