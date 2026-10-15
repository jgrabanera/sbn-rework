<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WildlifeItemContent extends Model
{
    use HasFactory;

    protected $table = 'tbl_wildlife_item_content';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'wildlife_item_id',
        'content',
    ];

    public function item()
    {
        return $this->belongsTo(WildlifeItem::class, 'wildlife_item_id');
    }
}
