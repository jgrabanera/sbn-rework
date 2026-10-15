<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Threats extends Model
{
    use HasFactory;

    protected $table = 'tbl_threats';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id',
        'article1',
        'article2',
        'article3',
    ];
}
