<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formule extends Model
{
    use HasFactory;

    protected $fillable = [
    'nom',
    'description',
    'prix_par_personne',
    'prestataire_id'
];

    // علاقة مع الـ Prestataire
    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }
}