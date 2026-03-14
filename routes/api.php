<?php
// API routes for the Garden of Habits application
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HabitController;

//public routes
Route::post('/login', [App\Http\Controllers\AuthController::class, 'Login']);
Route::post('/register', [App\Http\Controllers\AuthController::class, 'Register']);
Route::post('/logout', [App\Http\Controllers\AuthController::class, 'Logout']);

//protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Habit routes
    Route::apiResource('habits', HabitController::class);
});