<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    protected $fillable = [
        'user_id', 
        'nom_commercial', 
        'type_service', 
        'telephone', 
        'ville', 
        'description'
    ];
}