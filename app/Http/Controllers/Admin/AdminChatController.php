<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\AdminService;
use Inertia\Inertia;
use Inertia\Response;

class AdminChatController extends Controller
{
    public function __construct(
        protected AdminService $adminService
    ) {}

    /**
     * عرض صفحة المحادثة للأدمن مع اختيار التذكرة
     */
    public function index(): Response
    {
        $tickets = $this->adminService->getAllTickets();
        $ticketId = request()->query('ticket_id');

        $selectedTicket = null;
        if ($ticketId) {
            $selectedTicket = Ticket::with('user')->find($ticketId);
        }

        return Inertia::render('Admin/Chat', [
            'tickets' => $tickets->items(),
            'selectedTicket' => $selectedTicket ? [
                'id' => $selectedTicket->id,
                'subject' => $selectedTicket->subject,
                'description' => $selectedTicket->description,
                'status' => $selectedTicket->status,
                'priority' => $selectedTicket->priority,
                'user' => $selectedTicket->user ? [
                    'id' => $selectedTicket->user->id,
                    'name' => $selectedTicket->user->name,
                ] : null,
            ] : null,
        ]);
    }
}
