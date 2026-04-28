<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:4',
            'role' => 'required',
            'ville' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'ville' => $request->ville,
            ]);

            if ($request->role === 'prestataire') {
                Prestataire::create([
                    'user_id' => $user->id,
                    'ville' => $request->ville,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Compte créé avec succès !'], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
        }
    }
public function login(Request $request) {
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'role' => $user->role // نرسل الـ Role لنعرف أي Dashboard سنفتح
        ]);
    }
    return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
}

    public function completeProfile(Request $request) {
        $prestataire = Prestataire::where('user_id', $request->user_id)->first();
        
        if ($prestataire) {
            $prestataire->update($request->only([
                'nom_commercial', 'type_service', 'telephone', 'description'
            ]));
            return response()->json(['message' => 'Profil complété !']);
        }
        return response()->json(['message' => 'Prestataire non trouvé'], 404);
    }
}