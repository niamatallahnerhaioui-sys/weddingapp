<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SalleController extends Controller {

    // جلب القاعات الخاصة بالممون
public function index(Request $request) {
    $prestataireId = $request->query('prestataire_id');
    $salles = \App\Models\Salle::where('prestataire_id', $prestataireId)->latest()->get();
    return response()->json($salles);
}



    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'prestataire_id' => 'required|exists:users,id', // تأكدي أن الجدول سميتو users أو حسب ما عندك
                'nom'            => 'required|string',
                'adresse'        => 'required|string',
                'ville'          => 'required|string',
                'capacite_min'   => 'required|integer',
                'capacite_max'   => 'required|integer',
                'prix_journee'   => 'required|numeric',
                'prix_soiree'    => 'required|numeric',
                'photo'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('salles_photos', 'public');
                $validated['photo'] = $path;
            }

            // استعمال البيانات التي تم التحقق منها فقط
            $salle = Salle::create($validated);
            
            return response()->json($salle, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

   public function destroy($id)
{
    $salle = Salle::find($id);
    if($salle) {
        $salle->delete();
        return response()->json(['message' => 'Salle supprimée'], 200);
    }
    return response()->json(['message' => 'Salle non trouvée'], 404);
}
    
}