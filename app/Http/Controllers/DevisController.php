<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Devis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DevisController extends Controller
{
    // 1. صُنع طلب Devis جديد (خاص بالـ Couple)
    public function store(Request $request)
    {
        $request->validate([
            'prestataire_id' => 'required|exists:users,id',
            'message' => 'required|string',
            'date_evenement' => 'required|date',
            'nb_invites' => 'required|integer|min:1'
        ]);

        $devis = Devis::create([
            'user_id' => Auth::id(), // الـ Couple الحالي
            'prestataire_id' => $request->prestataire_id,
            'message' => $request->message,
            'date_evenement' => $request->date_evenement,
            'nb_invites' => $request->nb_invites,
            'statut' => 'en_attente'
        ]);

        return response()->json([
            'message' => 'Demande de devis envoyée avec succès !',
            'data' => $devis
        ], 21);
    }

    // 2. جلب الطلبات الخاصة بالـ Prestataire الحالي
    public function getPrestataireDevis()
    {
        $devis = Devis::with('client')
            ->where('prestataire_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($devis, 200);
    }

    // 3. جلب الطلبات لي صيفطهم الـ Couple الحالي (باش يتبع الحالة ديالهم)
    public function getClientDevis()
    {
        $devis = Devis::with('prestataire')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($devis, 200);
    }

    // 4. تغيير حالة الـ Devis (Accepter / Refuser) - خاص بالـ Prestataire
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:accepte,refuse,en_attente'
        ]);

        $devis = Devis::where('id', $id)
            ->where('prestataire_id', Auth::id())
            ->firstOrFail();

        $devis->update([
            'statut' => $request->statut
        ]);

        return response()->json([
            'message' => 'Statut du devis mis à jour !',
            'data' => $devis
        ], 200);
    }
}