<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UploadDocumentController;
use App\Http\Controllers\AiDocumentQaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketTriggerController;
use Illuminate\Support\Facades\Route;

Route::post('/ticket/ai', TicketTriggerController::class);
Route::post('/ai/document-qa', AiDocumentQaController::class);
Route::post('/upload-document', [UploadDocumentController::class, 'store']);
Route::prefix('v1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::apiResource('tickets', TicketController::class);

        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('overview', [DashboardController::class, 'overview']);
            Route::get('tickets', [DashboardController::class, 'tickets']);
            Route::get('users', [DashboardController::class, 'users']);
        });
    });
});
