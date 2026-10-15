<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WildlifeItem extends Model
{
    use HasFactory;

    protected $table = 'tbl_wildlife_item';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'wildlife_tab_id',
        'thumbnail_url',
    ];

    public function tab()
    {
        return $this->belongsTo(WildlifeTabs::class, 'wildlife_tab_id');
    }

    public function contents()
    {
        return $this->hasMany(WildlifeItemContent::class, 'wildlife_item_id');
    }
}
