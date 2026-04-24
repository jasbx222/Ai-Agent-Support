<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\TicketCreated;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\NewTicketNotification;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Notification;

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

        // Notify all admins
        $admins = User::whereIn('role', ['admin', 'employee'])->get();
        Notification::send($admins, new NewTicketNotification($ticket));

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
