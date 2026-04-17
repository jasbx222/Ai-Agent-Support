<?php

declare(strict_types=1);

namespace App\Services;

use App\Ai\Agents\TicketTrigger;
use App\Models\Ticket;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use App\Services\Interfaces\AiServiceInterface;
use Illuminate\Support\Facades\Log;
use Throwable;

class AiService implements AiServiceInterface
{
    public function __construct(
        protected TicketRepositoryInterface $ticketRepository
    ) {}

    public function suggestReply(Ticket $ticket): string
    {
        try {
            // Using the existing Laravel AI Agent integration (TicketTrigger)
            $promptMessage = "Subject: {$ticket->subject}\nDescription: {$ticket->description}";

            $response = TicketTrigger::make()->prompt($promptMessage);

            // Extract the generated values
            $reply = data_get($response, 'reply', '');

            // Enhance ticket with AI categorized data via repository safely
            $this->ticketRepository->updateAiSuggestion($ticket, $reply, [
                'department' => data_get($response, 'department'),
                'priority' => data_get($response, 'priority'),
                'sentiment' => data_get($response, 'sentiment'),
            ]);

            return $reply;

        } catch (Throwable $e) {
            Log::error('AI Suggestion Failed: '.$e->getMessage(), [
                'ticket_id' => $ticket->id,
            ]);

            return '';
        }
    }
}
