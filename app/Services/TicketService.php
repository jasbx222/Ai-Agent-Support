<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\TicketCreated;
use App\Models\Ticket;
use App\Models\User;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TicketService
{
    public function __construct(
        protected TicketRepositoryInterface $ticketRepository
    ) {}

    public function createTicket(User $user, array $data): Ticket
    {
        $data['user_id'] = $user->id;
        $data['status'] = 'Open';

        $ticket = $this->ticketRepository->create($data);

        TicketCreated::dispatch($ticket);

        return $ticket;
    }

    public function getTicketsForUser(User $user): Collection
    {
        return $this->ticketRepository->allForUser($user->id);
    }

    public function getTicketById(int $id): ?Ticket
    {
        return $this->ticketRepository->findById($id);
    }

    public function updateStatus(Ticket $ticket, string $status): Ticket
    {
        return $this->ticketRepository->updateStatus($ticket, $status);
    }

    public function deleteTicket(Ticket $ticket): void
    {
        $ticket->delete();
    }
}
