<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class TestController extends Controller
{
    public function __invoke()
    {
        $response = Http::withToken(config('services.openai.key'))
            ->acceptJson()
            ->post('https://api.openai.com/v1/audio/speech', [
                'model' => 'gpt-4o-mini-tts',
                'voice' => 'alloy',
                'input' => 'مرحبا شلونك',
                'format' => 'mp3',
            ]);

        if ($response->failed()) {
            return response()->json([
                'error' => $response->json(),
                'body' => $response->body(),
            ], 500);
        }

        return response($response->body(), 200, [
            'Content-Type' => 'audio/mpeg',
            'Content-Disposition' => 'inline; filename="audio.mp3"',
        ]);
    }
}