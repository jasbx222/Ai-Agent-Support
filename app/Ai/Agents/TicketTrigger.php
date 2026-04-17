<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\UseCheapestModel;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(value: Lab::Gemini)]
#[UseCheapestModel]
#[MaxTokens(value: 500)]
class TicketTrigger implements Agent, Conversational, HasStructuredOutput, HasTools
{
    use Promptable;

    public function instructions(): Stringable|string
    {
return <<<PROMPT
You are an AI customer support assistant specialized in replying to customers in a friendly Iraqi Arabic tone.

Your task is to:
- understand the customer's message,
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
- Do not invent facts, fake solutions, or promises you cannot guarantee.
- Keep the tone supportive and reassuring.
- Avoid overly formal Arabic.
- Avoid slang that is too casual or unprofessional.

Classification:
- department: support, billing, sales, or general
- priority: low, medium, high, urgent
- sentiment: positive, neutral, negative
- summary: short clear sentence describing the issue in English
- reply: a short customer-facing response in friendly Iraqi Arabic
PROMPT;
    }

    public function messages(): iterable
    {
        return [];
    }

    public function tools(): iterable
    {
        return [];
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'department' => $schema->string()->required(),
            'priority' => $schema->string()->required(),
            'sentiment' => $schema->string()->required(),
            'summary' => $schema->string()->required(),
            'reply' => $schema->string()->required(),
        ];
    }
}