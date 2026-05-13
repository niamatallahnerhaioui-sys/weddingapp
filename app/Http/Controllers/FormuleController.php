<?php

namespace App\Http\Controllers;

use App\Models\Formule;
use Illuminate\Http\Request;

class FormuleController extends Controller
{
    // جلب جميع الفورمولات الخاصة بممون معين
    public function index(Request $request)
    {
        $prestataireId = $request->query('prestataire_id');
        if (!$prestataireId) {
            return response()->json(['message' => 'ID missing'], 400);
        }
        $formules = Formule::where('prestataire_id', $prestataireId)->latest()->get();
        return response()->json($formules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix_par_personne' => 'required|numeric',
            'prestataire_id' => 'required|exists:prestataires,id',
        ]);

        $formule = Formule::create($validated);

        return response()->json([
            'message' => 'Formule ajoutée avec succès',
            'data' => $formule
        ], 201);
    }

    // مسح فورمولا
    public function destroy($id)
    {
        $formule = Formule::findOrFail($id);
        $formule->delete();
        return response()->json(['message' => 'Formule supprimée avec succès']);
    }
}