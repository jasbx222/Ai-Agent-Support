<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UploadDocument;
use App\Services\DocumentTextExtractor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class UploadDocumentController extends Controller
{
    public function store(Request $request, DocumentTextExtractor $extractor)
    {
        $request->validate([
            'file' => [
                'required',
                'file',

                'mimes:pdf,txt,doc,docx',
                'max:10240', // 10MB
            ],
        ]);

        try {
            $file = $request->file('file');

            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();

            $path = $file->storeAs(
                'documents',
                Str::uuid().'_'.$originalName,
                'public'
            );

            $document = UploadDocument::create([
                'file_name' => $originalName,
                'file_path' => $path,
                'mime_type' => $mimeType,
                'user_id' => 1,
                'extracted_text' => null,
            ]);

            $text = $extractor->extract($document);

            $document->update([
                'extracted_text' => $text,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الملف وتحليل النص بنجاح',
                'data' => [
                    'id' => $document->id,
                    'file_name' => $document->file_name,
                    'file_path' => $document->file_path,
                    'mime_type' => $document->mime_type,
                    'text_extracted' => filled($document->fresh()->extracted_text),
                    'url' => Storage::disk('public')->url($document->file_path),
                ],
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل رفع الملف أو تحليل محتواه',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
