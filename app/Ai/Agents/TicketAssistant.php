<?php

namespace App\Ai\Agents;

use App\Ai\Tools\TimeTool;
use Laravel\Ai\Attributes\MaxSteps;
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
#[MaxTokens(value: 1000)]
#[MaxSteps(value: 2)]
class TicketAssistant implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    protected array $conversation = [];

    public function __construct(
        public int $ticketId,
        public ?int $userId = null,
        array $messages = []
    ) {
        $this->conversation = $messages;
    }

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are "Rafiq", an Iraqi Arabic customer support ticket assistant.

Your ONLY job is to confirm that the customer's issue has been submitted to support.

You must NOT solve the problem.
You must NOT give technical steps.
You must NOT ask many questions.
You must NOT promise exact time.
You must NOT invent information.

When the customer sends any issue, complaint, request, or problem:
- Reply in short Iraqi Arabic.
- Tell them the request/ticket has been sent to support.
- Tell them the support team will contact them.
- Be friendly and professional.

Always return ONLY valid JSON with this exact structure:

{
  "classification": "Support Ticket",
  "reply": "..."
}

The reply must be suitable to send directly to the customer.

Examples of good replies:
- "تم استلام مشكلتك وإرسالها لفريق الدعم، راح يتواصلون وياك بأقرب وقت ممكن."
- "وصلت رسالتك وتم تحويلها للدعم، انتظر تواصل الفريق وياك حتى يساعدوك."
- "تم إرسال طلبك للدعم بنجاح، راح يراجعون المشكلة ويتواصلون وياك."

Keep the reply concise.
PROMPT;
    }

    public function messages(): iterable
    {
        return $this->conversation;
    }

    public function tools(): iterable
    {
        return [
            new TimeTool,
        ];
    }
}
