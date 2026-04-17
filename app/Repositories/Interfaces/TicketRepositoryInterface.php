<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface TicketRepositoryInterface
{
    public function create(array $data): Ticket;

    public function findById(int $id): ?Ticket;

    public function allForUser(int $userId): Collection;

    public function all(): Collection;

    public function updateStatus(Ticket $ticket, string $status): Ticket;

    public function updateAiSuggestion(Ticket $ticket, string $suggestion, array $additionalData = []): Ticket;

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;
}
