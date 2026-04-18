<?php

namespace App\Ai\Tools;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class TicketFactTool implements Tool
{
    public function __construct(
        public ?User $user = null
    ) {}

    public function description(): Stringable|string
    {
        return 'Fetch all tickets with their key facts such as subject, status, priority, department, sentiment, ai suggestion, and timestamps.';
    }

    public function handle(Request $request): Stringable|string
    {
        $user = $this->user ?? auth()->user();

        if (! $user) {
            return json_encode([
                'error' => 'Unauthorized',
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        // TODO: سو authorization حقيقي هنا
        // مثلاً فقط الأدمن أو الموظف يگدر يشوف كل التكتات

        $tickets = Ticket::query()
            ->latest()
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'subject' => $ticket->subject,
                    'description' => $ticket->description,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'department' => $ticket->department,
                    'sentiment' => $ticket->sentiment,
                    'ai_suggestion' => $ticket->ai_suggestion,
                    'created_at' => $ticket->created_at?->toDateTimeString(),
                    'updated_at' => $ticket->updated_at?->toDateTimeString(),
                ];
            })
            ->values();

        if ($tickets->isEmpty()) {
            return json_encode([
                'message' => 'No tickets found',
                'data' => [],
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        return json_encode([
            'count' => $tickets->count(),
            'data' => $tickets,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}