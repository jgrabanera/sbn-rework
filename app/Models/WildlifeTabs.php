<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WildlifeTabs extends Model
{
    use HasFactory;

    protected $table = 'tbl_wildlife_tabs';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'area_id',
        'tab_name',
    ];

    public function wildlifeItems()
    {
        return $this->hasMany(WildlifeItem::class, 'wildlife_tab_id');
    }
}
