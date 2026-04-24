<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
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
        $ticketId = request()->query('ticket_id');

        if ($ticketId) {
            $ticket = Ticket::find($ticketId);

            if ($ticket) {
                return Inertia::render('Customer/ChatPage', [
                    'ticket' => [
                        'id' => $ticket->id,
                        'subject' => $ticket->subject,
                        'status' => $ticket->status,
                    ],
                ]);
            }
        }

        return Inertia::render('Customer/ChatPage');
    }
}
