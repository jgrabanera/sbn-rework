<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ecotourism extends Model
{
    use HasFactory;

    protected $table = 'tbl_ecotourism';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id',
        'image_url',
        'article1',
        'article2',
    ];
}
