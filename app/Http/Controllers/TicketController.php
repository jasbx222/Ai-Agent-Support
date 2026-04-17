<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Resources\TicketCollection;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected TicketService $ticketService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tickets = $this->ticketService->getTicketsForUser($request->user());

        return response()->json([
            'status' => 'success',
            'message' => 'Tickets retrieved successfully.',
            'data' => new TicketCollection($tickets),
        ]);
    }

    public function store(StoreTicketRequest $request)
    {
        // For CLI or Web without auth token context, default to the first user for demo
        $user = $request->user() ?? User::first();
        if (! $user) {
            abort(403, 'No user found. Please run seeders.');
        }

        $ticket = $this->ticketService->createTicket($user, $request->validated());

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Ticket created successfully.',
                'data' => new TicketResource($ticket),
            ], 201);
        }

        return redirect()->back()->with('success', 'Ticket created successfully.');
    }

    public function show(Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket retrieved successfully.',
            'data' => new TicketResource($ticket),
        ]);
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('update', $ticket);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Open,Closed'],
        ]);

        $ticket = $this->ticketService->updateStatus($ticket, $validated['status']);

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket status updated successfully.',
            'data' => new TicketResource($ticket),
        ]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        $this->authorize('delete', $ticket);

        $this->ticketService->updateStatus($ticket, 'Closed');

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket closed successfully.',
            'data' => null,
        ]);
    }
}
