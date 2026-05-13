<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model {
    use HasFactory;

    protected $fillable = [
        'prestataire_id', // هادي كانت ناقصة وهي سباب المشكل
        'nom', 
        'adresse', 
        'ville', 
        'capacite_min', 
        'capacite_max', 
        'prix_journee', 
        'prix_soiree', 
        'photo', 
        
    ];

    // علاقة القاعة مع صاحب الخدمة (اختياري ولكن مفيد)
    public function prestataire() {
        return $this->belongsTo(User::class, 'prestataire_id');
    }
}