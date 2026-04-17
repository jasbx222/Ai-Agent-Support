<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\TicketTriggerController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AgentController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [AgentController::class, 'index']);
Route::get('/tickets', [AgentController::class, 'index']);
Route::get('/chat', [AgentController::class, 'index']);
Route::get('/analytics', [AgentController::class, 'index']);
Route::get('/team', [AgentController::class, 'index']);

Route::post('/tickets/trigger', TicketTriggerController::class)->name('tickets.trigger');

