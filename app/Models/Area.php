<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'tblmainarea';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'areaName',
        'areaDescription',
        'areaVideo',
        'imagePath'
    ];
}
