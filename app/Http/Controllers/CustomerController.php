<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(): Response
    {
        // Load users with count of tickets and aiRuns
        $customers = User::withCount(['tickets', 'aiRuns'])
            ->latest()
            ->OrderBy('created_at', 'asc')
            ->paginate(15);

        return Inertia::render('Customers/Index', [
            'customers' => $customers->items(),
        ]);
    }

    /**
     * Display the specified customer and their chat history.
     */
    public function show(User $customer): Response
    {
        // Load tickets and aiRuns, combining them in the frontend timeline
        $customer->load([
            'tickets' => function ($query) {
                $query->latest()->OrderBy('created_at', 'asc');
            },
            'aiRuns' => function ($query) {
                $query->with('usage')->latest()->OrderBy('created_at', 'asc');
            },
        ]);

        // Combine into a timeline format
        $timeline = collect();

        foreach ($customer->tickets as $ticket) {
            $timeline->push([
                'type' => 'ticket',
                'id' => $ticket->id,
                'prompt' => $ticket->description,
                'response' => $ticket->ai_suggestion,
                'status' => $ticket->status,
                'date' => $ticket->created_at->toIso8601String(),
                'display_date' => $ticket->created_at->format('Y-m-d H:i'),
            ]);
        }

        foreach ($customer->aiRuns as $run) {
            $timeline->push([
                'type' => 'ai_run',
                'id' => $run->id,
                'prompt' => $run->prompt,
                'response' => $run->response,
                'status' => $run->status,
                'model' => $run->model,
                'usage' => $run->usage,
                'date' => $run->started_at ?? $run->created_at->toIso8601String(),
                'display_date' => Carbon::parse($run->started_at ?? $run->created_at)->format('Y-m-d H:i'),
            ]);
        }

        // Sort timeline descending by date
        $timeline = $timeline->sortByDesc('updated_at')->values()->all();

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'timeline' => $timeline,
        ]);
    }
}
