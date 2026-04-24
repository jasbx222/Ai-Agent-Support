<?php

namespace App\Http\Controllers\Admin;

use App\Ai\Agents\TicketTrigger;
use App\Http\Controllers\Controller;
use App\Models\AiRun;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Ai\Exceptions\RateLimitedException;
use Throwable;

class TicketTriggerAdminController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
            'ticket_id' => ['nullable', 'integer', 'exists:tickets,id'],
        ]);

        $run = null;

        try {
            $user = User::first();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'No users found in the database. Please seed the database.',
                ], 400);
            }

            $ticketId = $validated['ticket_id'] ?? null;

            $ticket = $ticketId
                ? Ticket::find($ticketId)
                : Ticket::create([
                    'user_id' => $user->id,
                    'subject' => 'AI Generated Ticket',
                    'description' => $validated['message'],
                    'status' => 'Open',
                    'priority' => 'Medium',
                ]);

            if (! $ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket not found.',
                ], 404);
            }

            $run = AiRun::create([
                'user_id' => $user->id,
                'ticket_id' => $ticket->id,
                'prompt' => $validated['message'],
                'provider' => 'openai',
                'model' => 'gpt-4o-mini',
                'status' => 'pending',
                'feature_key' => 'ticket_trigger',
                'input_hash' => md5($validated['message']),
                'started_at' => now(),
            ]);

            $agent = TicketTrigger::make();

            if ($ticket->ai_conversation_id) {
                $agent->continue($ticket->ai_conversation_id, $user);
            } else {
                $agent->forUser($user);
            }

            $response = $agent->prompt($validated['message']);

            if (! $ticket->ai_conversation_id && $agent->currentConversation()) {
                $ticket->update([
                    'ai_conversation_id' => $agent->currentConversation(),
                ]);
            }

            $run->update([
                'status' => 'success',
                'response' => is_string($response)
                    ? $response
                    : json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            ]);

            $usage = data_get($response, 'usage');

            if ($usage) {
                $run->usage()->create([
                    'prompt_tokens' => data_get($usage, 'input_tokens', data_get($usage, 'prompt_tokens', 0)),
                    'completion_tokens' => data_get($usage, 'output_tokens', data_get($usage, 'completion_tokens', 0)),
                    'total_tokens' => data_get($usage, 'total_tokens', 0),
                    'cost_usd' => data_get($response, 'cost_usd'),
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $response,
            ]);

        } catch (RateLimitedException $e) {
            if ($run) {
                $run->update([
                    'status' => 'rate_limited',
                    'error_message' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'AI service is temporarily rate limited. Please try again in a moment.',
            ], 429);

        } catch (Throwable $e) {
            if ($run) {
                $run->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unexpected server error.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
