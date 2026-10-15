<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sites extends Model
{
    use HasFactory;

    protected $table = 'tbl_site_to_see';
    protected $primaryKey = 'id';

    protected $fillable = [
        'area_id', 
        'map_filename'
    ];

}
