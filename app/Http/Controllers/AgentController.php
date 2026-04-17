<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    public function __construct(
        protected AdminService $adminService
    ) {}

    public function index(): Response
    {
        $tickets = $this->adminService->getAllTickets();
        $statsData = $this->adminService->getStats();

        // Mapping backend stats to the frontend format
        $stats = [
            [
                'title' => 'إجمالي التذاكر',
                'value' => $statsData['total_tickets'],
                'change' => '+0%',
                'icon' => 'MessageCircle',
                'color' => '#9fcaff',
            ],
            [
                'title' => 'التذاكر المفتوحة',
                'value' => $statsData['open_tickets'],
                'change' => '+0%',
                'icon' => 'Clock',
                'color' => '#8ecdff',
            ],
            [
                'title' => 'استهلاك الكلمات (Tokens)',
                'value' => number_format((float) $statsData['total_ai_tokens']),
                'change' => '+12%',
                'icon' => 'Zap',
                'color' => '#8ecdff',
            ],
            [
                'title' => 'تكلفة الذكاء الاصطناعي',
                'value' => '$'.number_format((float) $statsData['total_ai_cost'], 4),
                'change' => '+5%',
                'icon' => 'MessageCircle',
                'color' => '#9fcaff',
            ],
        ];

        $aiLogs = $this->adminService->getAiLogs();

        return Inertia::render('Dashboard', [
            'tickets' => $tickets->items(),
            'stats' => $stats,
            'aiLogs' => $aiLogs->items(),
        ]);
    }
}
