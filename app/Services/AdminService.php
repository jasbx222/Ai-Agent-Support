<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AiRun;
use App\Models\AiUsage;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminService
{
    public function __construct(
        protected TicketRepositoryInterface $ticketRepository,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getStats(): array
    {
        // Ideally we would push these counts into the repositories
        $tickets = tap($this->ticketRepository->all(), function () {});
        $users = tap($this->userRepository->all(), function () {});

        $totalTokens = AiUsage::sum('total_tokens') ?? 0;
        $totalCost = AiUsage::sum('cost_usd') ?? 0;

        return [
            'total_users' => $users->count(),
            'total_tickets' => $tickets->count(),
            'open_tickets' => $tickets->where('status', 'Open')->count(),
            'closed_tickets' => $tickets->where('status', 'Closed')->count(),
            'total_ai_tokens' => $totalTokens,
            'total_ai_cost' => $totalCost,
        ];
    }

    public function getAiLogs(): \Illuminate\Pagination\LengthAwarePaginator
    {
        return AiRun::with('usage')->latest()->paginate(10);
    }

    public function getAllTickets(array $filters = []): LengthAwarePaginator
    {
        return $this->ticketRepository->paginate(15, $filters);
    }

    public function getAllUsers(): LengthAwarePaginator
    {
        return $this->userRepository->paginate(15);
    }
}
