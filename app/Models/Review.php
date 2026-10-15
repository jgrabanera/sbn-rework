<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'tbl_reviews';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id',
        'interaction_rating',
        'interface_design_rating',
        'navigation_rating',
        'response_speed_rating',
        'information_relevance_rating',
        'content_usefulness_rating',
        'overall_satisfaction_rating',
        'comment',
    ];
}
