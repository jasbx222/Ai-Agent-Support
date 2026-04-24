<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TicketSelectionController extends Controller
{
    /**
     * عرض صفحة اختيار التذكرة
     */
    public function index(): Response
    {
        $user = auth()->user();

        if (! $user) {
            return Inertia::render('Customer/ChatPage');
        }

        $tickets = Ticket::where('user_id', $user->id)
            ->latest()
            ->get(['id', 'subject', 'description', 'status', 'priority', 'created_at']);

        return Inertia::render('Customer/SelectTicket', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * بدء محادثة جديدة (إنشاء تذكرة جديدة)
     */
    public function startNew(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $ticket = Ticket::create([
            'user_id' => $user->id,
            'subject' => 'محادثة جديدة',
            'description' => 'محادثة جديدة مع الدعم الفني',
            'status' => 'Open',
            'priority' => 'Medium',
            'ai_conversation_id' => (string) Str::uuid(),
        ]);

        return redirect()->route('customer.chat', ['ticket_id' => $ticket->id]);
    }

    /**
     * اختيار تذكرة موجودة والمتابعة معها
     */
    public function select(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|integer|exists:tickets,id',
        ]);

        $ticket = Ticket::findOrFail($request->ticket_id);
        $user = auth()->user();

        // التأكد أن التذكرة تخص المستخدم الحالي
        if ($ticket->user_id !== $user?->id) {
            abort(403, 'غير مصرح لك بالوصول لهذه التذكرة');
        }

        return redirect()->route('customer.chat', ['ticket_id' => $ticket->id]);
    }
}
