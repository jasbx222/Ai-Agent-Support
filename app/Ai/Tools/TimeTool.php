<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class TimeTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'A tool to get the current date and time in Baghdad, Iraq. Useful for providing accurate timestamps in customer support replies.';
    }

    public function handle(Request $request): Stringable|string
    {
        return json_encode([
            'timezone' => 'Asia/Baghdad',
            'datetime' => now()->timezone('Asia/Baghdad')->format('Y-m-d H:i:s'),
            'date' => now()->timezone('Asia/Baghdad')->format('Y-m-d'),
            'time' => now()->timezone('Asia/Baghdad')->format('H:i:s'),
        ], JSON_UNESCAPED_UNICODE);
    }

    public function schema(JsonSchema $schema): array
    {
        return [

        ];
    }
}
