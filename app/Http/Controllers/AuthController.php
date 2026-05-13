<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(4)], 
            'role' => 'required|in:couple,prestataire,admin',
            'ville' => 'required|string',
            
            // الحقول الخاصة بالبريستاتير إجبارية فقط إذا كان الدور prestataire
            'type' => 'required_if:role,prestataire|string',
            'telephone' => 'required_if:role,prestataire|string|max:15',
            'nom_commercial' => 'required_if:role,prestataire|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'nom' => strip_tags($request->nom),
                'prenom' => strip_tags($request->prenom),
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role, 
                'ville' => $request->ville,
            ]);

            // إنشاء سجل prestataire فقط إذا كان المستخدم من هذا النوع
           // داخل AuthController.php
if ($user->role === 'prestataire') {
    Prestataire::create([
        'user_id' => $user->id,
        'type' => $request->type,
        'nom' => $request->nom_commercial, // إيلا كان الحقل في DB سميتو nom
        // 'nom_commercial' => $request->nom_commercial, // إيلا كان الحقل في DB سميتو nom_commercial
        'ville' => $request->ville,
        'telephone' => $request->telephone,
        'statut_verifi' => 0, 
    ]);
}

            DB::commit();
            return response()->json(['message' => 'Compte créé avec succès !', 'user' => $user], 201);

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error("Registration Error: " . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue.'], 500); 
        }
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // تحميل علاقة الـ prestataire
            $user = User::with('prestataire')->find(Auth::id());

            return response()->json([
                'status' => 'success',
                'user' => $user,
                'role' => $user->role 
            ]);
        }

        return response()->json(['message' => 'Identifiants incorrects'], 401);
    }

    // هاد الدالة اختيارية إذا بغيتي تبدلي المعلومات من بعد
    public function completeProfile(Request $request) {
        $prestataire = Prestataire::where('user_id', Auth::id())->first();
        if ($prestataire) {
            $data = $request->validate([
                'nom' => 'sometimes|string',
                'description' => 'sometimes|string',
                'telephone' => 'sometimes|string',
                'type' => 'sometimes|string'
            ]);
            $prestataire->update($data);
            return response()->json(['message' => 'Profil mis à jour !']);
        }
        return response()->json(['message' => 'Profil non trouvé'], 404);
    }
}