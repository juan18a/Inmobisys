<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatProxyController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'message'    => ['required', 'string', 'max:500'],
            'session_id' => ['required', 'string', 'max:100'],
        ]);

        $webhookUrl = config('services.n8n.webhook_url');

        if (empty($webhookUrl)) {
            return response()->json(
                ['reply' => 'Chat is not configured. Please contact support.'],
                503
            );
        }

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($webhookUrl, [
                    // Mensaje del usuario
                    'message'    => $request->input('message'),
                    'session_id' => $request->input('session_id'),
                    'timestamp'  => now()->toISOString(),

                    // Credenciales inyectadas server-side (nunca llegan al browser)
                    'laravel_url' => config('app.url'),
                    'api_key'     => config('services.n8n.key'),
                ]);

            if ($response->failed()) {
                Log::warning('N8N webhook error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);

                return response()->json(
                    ['reply' => 'The assistant is temporarily unavailable. Please try again.'],
                    503
                );
            }

            $data  = $response->json();
            $reply = $data['reply'] ?? 'I received an unexpected response. Please try again.';

            return response()->json(['reply' => $reply]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('N8N connection failed', ['error' => $e->getMessage()]);

            return response()->json(
                ['reply' => 'Could not reach the assistant. Please try again in a moment.'],
                503
            );
        }
    }
}
