<?php

declare(strict_types=1);

namespace App\Services\Interfaces;

use App\Models\Ticket;

interface AiServiceInterface
{
    public function suggestReply(Ticket $ticket): string;
}
