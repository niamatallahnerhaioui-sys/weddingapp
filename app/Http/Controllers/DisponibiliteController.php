<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Salle;
use App\Models\Prestataire;

class DisponibiliteController extends Controller
{
    // جلب التواريخ للكالندري بـ استخدام ID الممرر (واللي هو الـ user_id)
    public function getPrestataireDispo($id)
    {
        try {
            $prestataire = Prestataire::where('user_id', $id)->first();
            if (!$prestataire) {
                return response()->json([], 200);
            }

            $salle = Salle::where('prestataire_id', $prestataire->id)->first();
            if (!$salle) {
                return response()->json([], 200); 
            }

            if (class_exists('App\Models\Disponibilite')) {
                $dispos = \App\Models\Disponibilite::where('salle_id', $salle->id)->get();
                return response()->json($dispos, 200);
            }

            return response()->json([], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // حفظ أو تحديث تاريخ فـ الكالندري
    public function storeOrUpdate(Request $request)
{
    // 1. الفاليديشن ديريكت
    $request->validate([
        'date_bloquee' => 'required|date',
        'statut'       => 'required|in:libre,bloque,occupe,reserve',
    ]);

    // 2. كاتجيب الـ user حيت متأكدة أنه داز من الـ middleware ومضمون
    $user = Auth::user(); 
    
    $prestataire = Prestataire::where('user_id', $user->id)->first();
    
    if (!$prestataire) {
        return response()->json(['message' => 'Profil prestataire introuvable.'], 404);
    }

    $salle = Salle::where('prestataire_id', $prestataire->id)->first();
    if (!$salle) {
        return response()->json(['message' => 'Aucune salle trouvée.'], 404);
    }

    $dispo = \App\Models\Disponibilite::updateOrCreate(
        [
            'salle_id'     => $salle->id,
            'date_bloquee' => $request->date_bloquee,
        ],
        [
            'statut'       => $request->statut,
        ]
    );

    return response()->json([
        'message' => 'Disponibilité mise à jour !',
        'data'    => $dispo
    ], 200);
}
}