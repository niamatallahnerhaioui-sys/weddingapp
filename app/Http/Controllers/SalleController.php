<?php
namespace App\Http\Controllers;
use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SalleController extends Controller {
    // 1. عرض كاع الصالات (Listing + Filtres)
    public function index(Request $request) {
        $query = Salle::query();
        if ($request->ville) $query->where('ville', $request->ville);
        if ($request->prix_max) $query->where('prix_par_jour', '<=', $request->prix_max);
        
        return response()->json($query->get());
    }

    // 2. إضافة صالة (Create + Photo Upload)
    public function store(Request $request) {
        $request->validate([
            'nom_salle' => 'required',
            'capacite' => 'required|integer',
            'prix_par_jour' => 'required|numeric',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $path = $request->file('photo')->store('salles_photos', 'public');

        $salle = Salle::create([
            'prestataire_id' => $request->prestataire_id,
            'nom_salle' => $request->nom_salle,
            'adresse' => $request->adresse,
            'ville' => $request->ville,
            'capacite' => $request->capacite,
            'prix_par_jour' => $request->prix_par_jour,
            'description' => $request->description,
            'photo_principale' => $path
        ]);

        return response()->json(['message' => 'Salle ajoutée !', 'salle' => $salle]);
    }

    // 3. مسح صالة (Delete)
    public function destroy($id) {
        $salle = Salle::findOrFail($id);
        Storage::disk('public')->delete($salle->photo_principale);
        $salle->delete();
        return response()->json(['message' => 'Salle supprimée']);
    }
}