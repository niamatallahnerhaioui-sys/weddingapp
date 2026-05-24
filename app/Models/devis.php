<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    use HasFactory;

    protected $table = 'devis';

    protected $fillable = [
        'user_id',
        'prestataire_id',
        'message',
        'statut',
        'date_evenement',
        'nb_invites'
    ];

    // الـ Couple لي صيفط الطلب
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // الـ Prestataire لي غيستقبل الطلب
    public function prestataire()
    {
        return $this->belongsTo(User::class, 'prestataire_id');
    }
}