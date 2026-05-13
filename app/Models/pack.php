<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'reduction_pct',
        'prix_estime',
        'type'
    ];

    // باش Laravel يعرف يتعامل مع الأرقام بشكل صحيح
    protected $casts = [
        'prix_estime' => 'decimal:2',
        'reduction_pct' => 'integer',
    ];
}