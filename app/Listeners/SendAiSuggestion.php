<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TicketCreated;
use App\Services\Interfaces\AiServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendAiSuggestion implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct(
        protected AiServiceInterface $aiService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(TicketCreated $event): void
    {
        $this->aiService->suggestReply($event->ticket);
    }
}
