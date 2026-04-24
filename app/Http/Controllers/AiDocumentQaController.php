<?php

namespace App\Http\Controllers;

use App\Ai\Agents\DocumentAgentQa;
use App\Models\UploadDocument;
use Illuminate\Http\Request;
use Throwable;

class AiDocumentQaController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'message' => ['required', 'string'],
            'document_id' => ['required', 'integer', 'exists:upload_documents,id'],
        ]);

        try {
            $document = UploadDocument::findOrFail($request->integer('document_id'));

            $agent = new DocumentAgentQa(
                documentId: $document->id
            );

            $response = $agent->prompt($request->string('message')->toString());

            return response()->json([
                'success' => true,
                'data' => $response,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ أثناء تحليل المستند',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
