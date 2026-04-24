<?php

namespace App\Services;

use App\Models\UploadDocument;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

class DocumentTextExtractor
{
    public function extract(UploadDocument $document): ?string
    {
        $path = Storage::disk('public')->path($document->file_path);

        if (! file_exists($path)) {
            throw new \Exception('الملف غير موجود في المسار: '.$path);
        }

        // TXT
        if ($document->mime_type === 'text/plain') {
            $text = file_get_contents($path);

            return trim($text) ?: null;
        }

        // PDF
        if ($document->mime_type === 'application/pdf') {
            $parser = new Parser;
            $pdf = $parser->parseFile($path);
            $text = $pdf->getText();

            $text = trim($text);

            if ($text === '') {
                throw new \Exception('تم فتح PDF لكن لم يتم العثور على نص. غالباً الملف صورة أو scanned.');
            }

            return $text;
        }

        throw new \Exception('نوع الملف غير مدعوم: '.$document->mime_type);
    }
}
