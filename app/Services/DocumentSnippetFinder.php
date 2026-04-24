<?php

namespace App\Services;

class DocumentSnippetFinder
{
    public function findRelevantPart(string $text, string $question, int $length = 2500): string
    {
        $text = trim($text);
        $question = trim($question);

        if ($text === '') {
            return '';
        }

        $keywords = preg_split('/\s+/u', $question, -1, PREG_SPLIT_NO_EMPTY);

        $bestPos = 0;

        foreach ($keywords as $word) {
            $pos = mb_stripos($text, $word);
            if ($pos !== false) {
                $bestPos = max(0, $pos - 300);
                break;
            }
        }

        return mb_substr($text, $bestPos, $length);
    }
}
