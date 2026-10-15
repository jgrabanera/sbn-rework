<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Backing data for the admin dashboard cards.
 *
 * Section metadata lives in config/admin.php; this controller only adds
 * the per-section record counts.
 */
class AdminSummaryController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = array_map(function (array $section) {
            $table = $section['count_table'] ?? null;

            $count = null;

            if ($table !== null) {
                try {
                    $count = DB::table($table)->count();
                } catch (\Throwable) {
                    // A table not provisioned in this environment should
                    // degrade rather than break the whole dashboard.
                    $count = null;
                }
            }

            return $section + ['count' => $count];
        }, config('admin.sections', []));

        $counts = array_filter(
            array_column($sections, 'count'),
            fn ($count) => $count !== null
        );

        return response()->json([
            'sections' => array_values($sections),
            'totals' => [
                'sections' => count($sections),
                'records' => array_sum($counts),
            ],
        ]);
    }
}