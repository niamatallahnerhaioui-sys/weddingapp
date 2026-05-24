<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    protected $fillable = [
        'nom', 'adresse', 'ville', 'capacite_min', 'capacite_max', 'prix_journee', 'prix_soiree', 'photo', 'prestataire_id'
    ];

    // تأكدي أن هاد الدالة كاينا لداخل
    public function user()
    {
        return $this->belongsTo(User::class, 'prestataire_id');
    }
}