<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home');
    }

    public function chat(): Response
    {
        return Inertia::render('Customer/ChatPage');
    }
}
