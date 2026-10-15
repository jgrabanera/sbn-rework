<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_id' => ['nullable', 'integer', 'exists:tblmainarea,id'],
            'interaction_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'interface_design_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'navigation_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'response_speed_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'information_relevance_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'content_usefulness_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'overall_satisfaction_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review = Review::create($validated);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review,
        ], 201);
    }
}
