<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class People extends Model
{
    use HasFactory;

    protected $table = 'tbl_people';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id',
        'article1',
        'article2',
        'article3',
    ];
}
