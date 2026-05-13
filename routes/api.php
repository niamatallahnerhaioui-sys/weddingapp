<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\FormuleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PackController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- 1. Routes ديال الـ Auth (التسجيل والدخول) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/complete-profile', [AuthController::class, 'completeProfile']);

// --- 2. Routes ديال الـ Admin (الإدارة والتوثيق) ---
// استعملنا prefix باش نجمعو كاع تعاملات الـ Admin فبلاصة وحدة
Route::prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/pending-prestataires', [AdminController::class, 'getPending']);
    Route::post('/validate-prestataire/{id}', [AdminController::class, 'validatePrestataire']);
});

// --- 3. Routes ديال الـ Salles (القاعات) ---
Route::get('/salles', [SalleController::class, 'index']);
Route::post('/salles', [SalleController::class, 'store']);
Route::delete('/salles/{id}', [SalleController::class, 'destroy']);

// --- 4. Routes ديال الـ Formules (التموين/التريتور) ---
Route::get('/formules', [FormuleController::class, 'index']);
Route::post('/formules', [FormuleController::class, 'store']);
Route::delete('/formules/{id}', [FormuleController::class, 'destroy']);

Route::get('/packs', [App\Http\Controllers\PackController::class, 'index']);
Route::prefix('admin')->group(function () {
    // بدلي هاد جوج سطور بهاد الطريقة:
    Route::post('/packs', [\App\Http\Controllers\PackController::class, 'store']);
    Route::delete('/packs/{id}', [\App\Http\Controllers\PackController::class, 'destroy']);
});

// --- 5. Route تجريبي للتأكد من اتصال الـ React بالـ API ---
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});