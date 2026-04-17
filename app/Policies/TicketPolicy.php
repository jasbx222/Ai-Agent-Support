<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Determine if the given ticket can be viewed by the user.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || $user->id === $ticket->user_id;
    }

    /**
     * Determine if the given ticket status can be updated by the user.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine if the given ticket can be deleted by the user.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->id === $ticket->user_id;
    }
}
