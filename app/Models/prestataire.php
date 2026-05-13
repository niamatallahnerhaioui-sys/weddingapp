<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
  protected $fillable = [
    'user_id', 
    'type', 
    'nom', 
    'ville', 
    'telephone', 
    'statut_verifi', 
    'description'
];
public function user() {
    return $this->belongsTo(User::class);
}}
