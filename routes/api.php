<?php

use App\Http\Controllers\TicketTriggerController;
use Illuminate\Support\Facades\Route;


Route::post('/ticket/ai', TicketTriggerController::class);