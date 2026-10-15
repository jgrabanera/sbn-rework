<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaCategory extends Model
{
    use HasFactory;

    protected $table = 'tbl_area_category';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'areaID',
        'area_category_id',
        'imagePath',
        'shortDescription'
    ];
}
