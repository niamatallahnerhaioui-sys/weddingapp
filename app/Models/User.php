<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; //
class User extends Authenticatable
{
    use HasFactory, Notifiable,HasApiTokens;

    /**
     * Les attributs qui peuvent être assignés massivement.
     * (Mass Assignable Attributes)
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'ville',
    ];

    /**
     * Les attributs qui doivent être cachés pour les tableaux.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Le cast des attributs.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function prestataire() {
    return $this->hasOne(Prestataire::class);
}
}