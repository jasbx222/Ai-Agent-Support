<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\UseCheapestModel;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(value: Lab::Gemini)]
#[UseCheapestModel]
#[MaxTokens(value: 500)]
class TicketAssistant implements Agent, Conversational, HasTools
{
    use Promptable,RemembersConversations;

    protected array $conversation = [];

    public function __construct(array $messages = [])
    {
        $this->conversation = $messages;
    }

    /**
     * 🧠 التعليمات (العقل مال البوت)
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are an AI customer support assistant specialized in replying to customers in a friendly Iraqi Arabic tone.

Your task is to:
- understand the customer's message,
- use the conversation history for the current ticket only,
- remember previous messages in the same ticket conversation,
- keep replies consistent with the earlier context,
- classify the ticket,
- and generate a short, warm, and professional reply to the customer in Iraqi Arabic.

Rules:
- Always follow the provided output schema.
- Do not return plain text outside the schema.
- Be concise, clear, and helpful.
- The reply must always be in Iraqi Arabic.
- The reply must sound friendly, respectful, calm, and positive.
- Use simple words that feel natural to Iraqi customers.
- The reply must be suitable to send directly to the customer.
- If the message is unclear, ask the customer politely for more details in a kind Iraqi way.
- Use previous messages in this same conversation to better understand the customer's issue.
- Do not mix this ticket with any other customer or ticket context.
- If the customer is following up on an earlier issue, continue naturally without asking them to repeat everything unless necessary.
- Do not invent facts, fake solutions, or promises you cannot guarantee.
- Keep the tone supportive and reassuring.
- Avoid overly formal Arabic.
- Avoid slang that is too casual or unprofessional.

PROMPT;
    }

    /**
     * 💬 الميموري (محادثة التكت)
     */
    public function messages(): iterable
    {
        return $this->conversation;
    }

    /**
     * 🛠️ الأدوات (حالياً فارغة)
     */
    public function tools(): iterable
    {
        return [];
    }
}
