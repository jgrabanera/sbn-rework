<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentAbout extends Model
{
    use HasFactory;

    protected $table = 'tbl_content_about';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'areaID',
        'tabID',
        'imagePath1',
        'imagePath2',
        'content'
    ];
}
