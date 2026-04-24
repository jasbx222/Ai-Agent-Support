<?php

namespace App\Ai\Tools;

use App\Models\UploadDocument;
use App\Services\DocumentSnippetFinder;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;

class AnalyzeDocumentTool implements Tool
{
    public function __construct(
        protected int $documentId
    ) {}

    public function description(): string
    {
        return 'Load and return the content of the uploaded document for answering user questions.';
    }

    public function handle(Request $request): string
    {
        $document = UploadDocument::find($this->documentId);

        if (! $document) {
            return json_encode([
                'success' => false,
                'message' => 'المستند غير موجود',
            ], JSON_UNESCAPED_UNICODE);
        }

        $question = $request['question'] ?? '';
        $content = $document->extracted_text ?? '';

        if (blank($content)) {
            return json_encode([
                'success' => false,
                'message' => 'لا يوجد نص داخل المستند',
            ], JSON_UNESCAPED_UNICODE);
        }

        $snippet = app(DocumentSnippetFinder::class)->findRelevantPart($content, $question, 2500);

        return json_encode([
            'success' => true,
            'document_id' => $document->id,
            'document_title' => $document->title,
            'question' => $question,
            'content' => $snippet,
        ], JSON_UNESCAPED_UNICODE);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'question' => $schema->string()
                ->description('The user question about the uploaded document.')
                ->required(),
        ];
    }
}
