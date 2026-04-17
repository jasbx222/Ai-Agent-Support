<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Ticket;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TicketRepository implements TicketRepositoryInterface
{
    public function create(array $data): Ticket
    {
        return Ticket::create($data);
    }

    public function findById(int $id): ?Ticket
    {
        return Ticket::find($id);
    }

    public function allForUser(int $userId): Collection
    {
        return Ticket::forUser($userId)->latest()->get();
    }

    public function all(): Collection
    {
        return Ticket::latest()->get();
    }

    public function updateStatus(Ticket $ticket, string $status): Ticket
    {
        $ticket->update(['status' => $status]);

        return $ticket;
    }

    public function updateAiSuggestion(Ticket $ticket, string $suggestion, array $additionalData = []): Ticket
    {
        $updateData = array_merge(['ai_suggestion' => $suggestion], $additionalData);
        $ticket->update($updateData);

        return $ticket;
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Ticket::with('user')->latest();

        // Example filter addition
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }
}
