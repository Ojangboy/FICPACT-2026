<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\GardenController;
use App\Http\Controllers\Api\PomodoroController;

Route::post('/login', [AuthController::class, 'Login']);
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/refresh', [AuthController::class, 'Refresh']);
Route::post('/logout', [AuthController::class, 'Logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/garden', [GardenController::class, 'show']);

    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{id}/complete', [TaskController::class, 'complete']);

    Route::post('/pomodoro/start', [PomodoroController::class, 'start']);
    Route::post('/pomodoro/finish', [PomodoroController::class, 'finish']);
    Route::get('/pomodoro/status', [PomodoroController::class, 'status']);
});