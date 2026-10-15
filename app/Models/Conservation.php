<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conservation extends Model
{
    use HasFactory;

    protected $table = 'tbl_conservation';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id',
        'image_url',
        'article1',
        'article2',
    ];
}
