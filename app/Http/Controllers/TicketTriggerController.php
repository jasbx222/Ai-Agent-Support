<?php

namespace App\Http\Controllers;

use App\Ai\Agents\TicketAssistant;
use App\Models\AiRun;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Ai\Exceptions\RateLimitedException;
use Throwable;

class TicketTriggerController extends Controller
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

            if (! empty($validated['ticket_id'])) {
                $ticket = Ticket::findOrFail($validated['ticket_id']);
            } else {
                $ticket = Ticket::create([
                    'user_id' => $user->id,
                    'subject' => 'AI Generated Ticket',
                    'description' => $validated['message'],
                    'status' => 'Open',
                    'priority' => 'Medium',
                ]);
            }

            if (! $ticket->ai_conversation_id) {
                $ticket->ai_conversation_id = (string) Str::uuid();
                $ticket->save();
            }

            $run = AiRun::create([
                'user_id' => $user->id,
                'ticket_id' => $ticket->id,
                'prompt' => $validated['message'],
                'provider' => 'openai',
                'model' => 'gpt-4o-mini',
                'status' => 'pending',
                'feature_key' => 'ticket_assistant',
                'input_hash' => md5($validated['message']),
                'started_at' => now(),
            ]);

            $response = TicketAssistant::make()
                ->continue($ticket->ai_conversation_id, as: $user)
                ->prompt($validated['message']);

            $run->update([
                'status' => 'success',
                'completed_at' => now(),
                'response' => $response,
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
                'conversation_id' => $ticket->ai_conversation_id,
                'ticket_id' => $ticket->id,
                'data' => $response,
            ]);
        } catch (RateLimitedException $e) {
            if ($run) {
                $run->update([
                    'status' => 'rate_limited',
                    'error_message' => $e->getMessage(),
                    'completed_at' => now(),
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
                    'completed_at' => now(),
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
