<?php

use App\Http\Controllers\Admin\DashboardTicketController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\TicketTriggerAdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WebAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/online-chat', [HomeController::class, 'chat'])->name('customer.chat');

Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
Route::post('/login', [WebAuthController::class, 'login']);
Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');

// Employee & Admin Access
Route::middleware(['auth', 'employee'])->group(function () {
    Route::get('/dashboard', [AgentController::class, 'index'])->name('dashboard');
    Route::get('/tickets-dashboard', [DashboardTicketController::class, 'index'])->name('tickets.dashboard');
    Route::post('/tickets-dashboard', [DashboardTicketController::class, 'store'])->name('tickets.dashboard.store');
    Route::put('/tickets-dashboard/{ticket}', [DashboardTicketController::class, 'update'])->name('tickets.dashboard.update');
    Route::delete('/tickets-dashboard/{ticket}', [DashboardTicketController::class, 'destroy'])->name('tickets.dashboard.destroy');
    Route::get('/chat', [AgentController::class, 'index'])->name('chat');

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
});

// Admin ONLY Access
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/team', [TeamController::class, 'index'])->name('team.index');
    Route::post('/team', [TeamController::class, 'store'])->name('team.store');
    Route::put('/team/{user}', [TeamController::class, 'update'])->name('team.update');
    Route::delete('/team/{user}', [TeamController::class, 'destroy'])->name('team.destroy');
});

Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
Route::post('admin/tickets/trigger', TicketTriggerAdminController::class)->name('tickets.trigger');
