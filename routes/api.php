<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\FormuleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\DisponibiliteController; 
use App\Http\Controllers\DevisController;      
use App\Http\Controllers\API\IAController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider ou bootstrap/app.php
| et seront automatiquement préfixées par "/api".
|
*/

// 🎯 رابط الـ WeddingBot الذكي (مفتوح للعموم لتفادي أخطاء الـ 401 والـ 404)
Route::post('/ia/chat', [IAController::class, 'chat']);

// --- 1. Routes المفتوحة للعموم (لا تحتاج لـ Token) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/complete-profile', [AuthController::class, 'completeProfile']);

// روابط عامة لمشاهدة القاعات والخدمات بدون تسجيل الدخول
Route::get('/public/salles', [SalleController::class, 'publicIndex']); 
Route::get('/formules', [FormuleController::class, 'index']);
Route::get('/packs', [PackController::class, 'index']);


// --- 2. Routes المحمية (ضروري تمرير الـ Token وسط الـ Authorization Header) ---
Route::middleware('auth:sanctum')->group(function () {

    // الـ User الحالي
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // إدارة القاعات (تم نقل الـ GET لهنا باش يقرا الـ Token ديال الـ Prestataire)
    Route::get('/salles', [SalleController::class, 'index']); 
    Route::post('/salles', [SalleController::class, 'store']);
    Route::delete('/salles/{id}', [SalleController::class, 'destroy']);
    
    // إدارة الخدمات والـ Formules
    Route::post('/formules', [FormuleController::class, 'store']);
    Route::delete('/formules/{id}', [FormuleController::class, 'destroy']);

    // الكالندري والتواريخ
    Route::post('/disponibilites', [DisponibiliteController::class, 'storeOrUpdate']);
    Route::get('/disponibilites/prestataire/{id}', [DisponibiliteController::class, 'getPrestataireDispo']);

    // إدارة طلبات الـ Devis
    Route::post('/devis', [DevisController::class, 'store']);                                    
    Route::get('/prestataire/devis', [DevisController::class, 'getPrestataireDevis']);   
    Route::get('/client/devis', [DevisController::class, 'getClientDevis']);             
    Route::put('/devis/{id}/status', [DevisController::class, 'updateStatus']);          

    // إدارة الـ Admin المحمية
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/pending-prestataires', [AdminController::class, 'getPending']);
        Route::post('/validate-prestataire/{id}', [AdminController::class, 'validatePrestataire']);
        Route::post('/packs', [PackController::class, 'store']);
        Route::delete('/packs/{id}', [PackController::class, 'destroy']);
    });
});