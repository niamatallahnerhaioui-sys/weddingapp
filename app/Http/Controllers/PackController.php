<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    // عرض كاع الـ Packs
    public function index()
    {
        return response()->json(Pack::all(), 200);
    }

    // إضافة Pack جديد من طرف الأدمن
   public function store(Request $request) {
    try {
        $pack = \App\Models\Pack::create([
            'nom'           => $request->nom,
            'description'   => $request->description,
            'reduction_pct' => $request->reduction_pct,
            'prix_estime'   => $request->prix_estime, // تأكدي بلي هادي هي اللي فـ Migration
            'type'          => $request->type,
        ]);
        return response()->json(['message' => 'Pack créé', 'pack' => $pack], 201);
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

    // مسح Pack
    public function destroy($id)
    {
        $pack = Pack::find($id);
        if ($pack) {
            $pack->delete();
            return response()->json(['message' => 'Pack supprimé'], 200);
        }
        return response()->json(['message' => 'Pack non trouvé'], 404);
    }
}