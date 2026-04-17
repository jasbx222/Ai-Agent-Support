<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    public function index(): Response
    {
        $tickets= Ticket::all();
    return Inertia::render('Dashboard', [
    'tickets' => $tickets,
        'stats' => [
                ['title' => 'التذاكر النشطة', 'value' => '124', 'change' => '+12%', 'icon' => 'MessageCircle', 'color' => '#9fcaff'],
                ['title' => 'وقت الاستجابة', 'value' => '1.2m', 'change' => '-15%', 'icon' => 'Clock', 'color' => '#8ecdff'],
                ['title' => 'كفاءة الذكاء الاصطناعي', 'value' => '94%', 'change' => '+5%', 'icon' => 'Zap', 'color' => '#4498d0'],
                ['title' => 'معدل الرضا', 'value' => '4.8', 'change' => '+2%', 'icon' => 'TrendingUp', 'color' => '#9fcaff'],
            ],
]);
    }
}
