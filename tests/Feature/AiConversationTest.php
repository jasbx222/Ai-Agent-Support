<?php

namespace Tests\Feature;

use App\Ai\Agents\TicketTrigger;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiConversationTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_agent_persists_conversation_id(): void
    {
        // 1. Setup user and ticket
        $user = User::factory()->create();
        $ticket = Ticket::create([
            'user_id' => $user->id,
            'subject' => 'Test Ticket',
            'description' => 'I have a problem with my account',
            'status' => 'Open',
            'priority' => 'Medium',
        ]);

        // 2. Fake AI response
        TicketTrigger::fake([
            '*' => [
                'department' => 'support',
                'priority' => 'medium',
                'sentiment' => 'neutral',
                'summary' => 'Customer has account problem.',
                'reply' => 'اهلا بك، سنقوم بمساعدتك.',
                'classification' => 'account_issue',
            ],
        ]);

        // 3. Trigger AI via Admin Controller (simulate request)
        $this->actingAs($user)
            ->postJson(route('tickets.trigger'), [
                'message' => 'First message',
                'ticket_id' => $ticket->id,
            ])
            ->assertSuccessful();

        // 4. Verify conversation ID was saved to ticket
        $ticket->refresh();
        $this->assertNotNull($ticket->ai_conversation_id);
        $firstConversationId = $ticket->ai_conversation_id;

        // 5. Trigger again for same ticket
        $this->actingAs($user)
            ->postJson(route('tickets.trigger'), [
                'message' => 'Second message',
                'ticket_id' => $ticket->id,
            ])
            ->assertSuccessful();

        // 6. Verify same conversation ID is still being used
        $ticket->refresh();
        $this->assertEquals($firstConversationId, $ticket->ai_conversation_id);
    }
}
