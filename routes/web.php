<?php

use App\Http\Controllers\Admin\AdminChatController;
use App\Http\Controllers\Admin\DashboardTicketController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\TicketTriggerAdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\TicketSelectionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WebAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/online-chat', [HomeController::class, 'chat'])->name('customer.chat');
Route::get('/select-ticket', [TicketSelectionController::class, 'index'])->name('customer.select-ticket');
Route::post('/select-ticket/new', [TicketSelectionController::class, 'startNew'])->name('customer.chat.new');
Route::post('/select-ticket/select', [TicketSelectionController::class, 'select'])->name('customer.chat.with');

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
    Route::get('/chat', [AdminChatController::class, 'index'])->name('admin.chat');

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
