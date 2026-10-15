<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Researches extends Model
{
    use HasFactory;

    protected $table = 'tbl_researches';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'area_id',
        'pdf_title',
        'pdf_url',
    ];
}
