<?php



namespace App\Http\Controllers;



use App\Models\Salle;

use App\Models\Prestataire; // زدت هادي هنا باش نقدرو نجيبو البروفايل

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Auth;



class SalleController extends Controller {



    // جلب القاعات الخاصة بالممون المسجل حالياً

    // جلب القاعات الخاصة بالممون المسجل حالياً فـ الـ Dashboard

public function index(Request $request) {

    $user = Auth::user();

   

    if (!$user) {

        return response()->json(['error' => 'Non authentifié'], 401);

    }



    // كنقلبو بـ $user->id ديريكت حيت جدول القاعات مربوط بـ users

    $salles = Salle::where('prestataire_id', $user->id)->latest()->get();

   

    return response()->json($salles, 200);

}



    // تسجيل قاعة جديدة بأمان عبر الـ Token

   public function store(Request $request) {

    try {

        // 1. كنجيبو المستخدم الحالي من الـ Token

        $user = Auth::user();



        if (!$user) {

            return response()->json(['error' => 'User non authentifié.'], 401);

        }



        // 2. التحقق من البيانات

        $validated = $request->validate([

            'nom'          => 'required|string',

            'adresse'      => 'required|string',

            'ville'        => 'required|string',

            'capacite_min' => 'required|integer',

            'capacite_max' => 'required|integer',

            'prix_journee' => 'required|numeric',

            'prix_soiree'  => 'required|numeric',

            'photo'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

        ]);



        // 3. رفع الصورة إيلا كانت كاينا

        if ($request->hasFile('photo')) {

            $path = $request->file('photo')->store('salles_photos', 'public');

            $validated['photo'] = $path;

        }



        // 🚨 4. التعديل السحري: بما أن الفايل عندك مربوط بـ الـ user_id فـ جدول الـ users

        // غادي نعطيوه المعرف ديال الـ user ديريكتومون اللي هو 17 فـ هاد الحالة

        $validated['prestataire_id'] = $user->id;



        $salle = Salle::create($validated);

       

        return response()->json($salle, 201);



    } catch (\Illuminate\Validation\ValidationException $e) {

        return response()->json(['errors' => $e->errors()], 422);

    } catch (\Exception $e) {

        return response()->json(['error' => $e->getMessage()], 500);

    }

}



    public function destroy($id) {

        $salle = Salle::find($id);

        if($salle) {

            // مسح الصورة من الـ Storage إيلا كانت كاينا قبل مسح القاعة

            if ($salle->photo) {

                Storage::disk('public')->delete($salle->photo);

            }

            $salle->delete();

            return response()->json(['message' => 'Salle supprimée'], 200);

        }

        return response()->json(['message' => 'Salle non trouvée'], 404);

    }

}