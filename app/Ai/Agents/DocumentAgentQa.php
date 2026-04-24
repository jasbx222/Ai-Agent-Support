<?php

namespace App\Ai\Agents;

use App\Ai\Tools\AnalyzeDocumentTool;
use Laravel\Ai\Attributes\MaxSteps;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\UseSmartestModel;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider([Lab::Gemini])]
#[UseSmartestModel]
#[MaxTokens(500)]
#[MaxSteps(3)]
class DocumentAgentQa implements Agent, Conversational, HasTools
{
    use Promptable;

    public function __construct(
        public readonly int $documentId,
    ) {}

    public function instructions(): Stringable|string
    {

        return <<<'PROMPT'
You are a document question-answering assistant.

You MUST use the document tool to get the content before answering.

Rules:
- Do not answer unless you first call the document tool.
- Your answer must be based only on the content returned by the tool.
- If the answer is not found in the content, say clearly: "Not found in the document".
- Do not use prior knowledge.
- Keep the answer short and clear.
PROMPT;
    }

    /**
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new AnalyzeDocumentTool($this->documentId),
        ];
    }
}
