<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disponibilite extends Model
{
    use HasFactory;

    // إيلا كنتِ مسمية الجدول 'disponibilites_' ف الـ migration ديري هاد السطر:
    protected $table = 'disponibilites_'; 

    protected $fillable = [
        'salle_id', // أو prestataire_id على حسب الـ migration ديالك
        'date_bloquee',
        'statut'
    ];

    // العلاقة مع القاعة أو الـ prestataire
    public function salle() {
        return $this->belongsTo(Salle::class, 'salle_id');
    }
}