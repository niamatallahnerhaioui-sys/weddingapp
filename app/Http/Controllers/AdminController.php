<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // جلب الإحصائيات الحقيقية
    public function getStats() {
        return response()->json([
            'total_users' => User::count(),
            'total_prestataires' => Prestataire::where('statut_verifi', 1)->count(),
            'pending_validation' => Prestataire::where('statut_verifi', 0)->count(),
            'active_packs' => DB::table('packs')->count(), // إيلا عندك جدول packs
        ]);
    }

    // جلب المزودين اللي كيتسناو الفاليدياسيون
 public function getPending() {
    // جربي هاد الـ Query اللي "بسيطة" ومكتشرط والو في الأول باش نتأكدو
    $pending = \App\Models\Prestataire::where('statut_verifi', 0)->get();

    // إيلا بغيتي تجيبيهم بـ المعلومات ديال الـ User (الإيميل، السمية...)
    // خاص ضروري تكون عندك دالة prestataire() في موديل User
    // ودالة user() في موديل Prestataire
    $pendingWithUser = \App\Models\Prestataire::where('statut_verifi', 0)
                        ->with('user') 
                        ->get();

    return response()->json($pendingWithUser);
}

    // دالة الفاليدياسيون
    public function validatePrestataire($id) {
        $p = Prestataire::findOrFail($id);
        $p->update(['statut_verifi' => 1]);
        return response()->json(['message' => 'Validé !']);
    }
}