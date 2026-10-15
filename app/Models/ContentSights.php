<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentSights extends Model
{
    use HasFactory;

    protected $table = 'tbl_site_to_see_content';
    protected $primaryKey = 'id';

    protected $fillable = [
        
        'areaID',
        'site_name',
        'content'
    ];
}
