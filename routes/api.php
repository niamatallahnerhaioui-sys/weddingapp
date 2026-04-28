<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Cette route sera accessible via : http://wedapp.test/api/register
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/complete-profile', [AuthController::class, 'completeProfile']);
Route::resource('salles', SalleController::class);