<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardTicketController extends Controller
{
    public function index(): Response
    {
        $tickets = Ticket::with('user')->latest()->get();
        $customers = User::where('role', 'user')->get();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:Open,In Progress,Closed',
            'priority' => 'required|string|in:Low,Medium,High',
        ]);

        Ticket::create($validated);

        return redirect()->back()->with('success', 'تم إنشاء التذكرة بنجاح');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Open,In Progress,Closed',
            'priority' => 'required|string|in:Low,Medium,High',
        ]);

        $ticket->update($validated);

        return redirect()->back()->with('success', 'تم تحديث التذكرة بنجاح');
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return redirect()->back()->with('success', 'تم حذف التذكرة بنجاح');
    }
}
