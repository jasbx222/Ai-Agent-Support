<?php

namespace App\Ai\Tools;

use App\Models\User;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class UsersFactTool implements Tool
{
    public function __construct(
        public ?User $user = null
    ) {}

    public function description(): Stringable|string
    {
        return <<<'PROMPT'
You are an AI system that must return structured JSON data.

Your task:
- Return ALL available data about customers and employees.
- Do NOT skip any records.
- Do NOT return empty arrays.
- Do NOT return null values unless the field is actually null in the database.

Rules:
- You MUST strictly return valid JSON matching the schema.
- The response MUST always contain:
  - customers: array of customer objects
  - employees: array of employee objects
- If no data exists, return empty arrays but NEVER return an empty response.



IMPORTANT:
- Response must ALWAYS include both "customers" and "employees".
- Never return [] alone.
- Never return an empty response.
PROMPT;
    }

    public function handle(Request $request): Stringable|string
    {
        $user = $this->user ?? auth()->user();

        if (! $user) {
            return json_encode([
                'error' => 'Unauthorized',
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        // TODO: ضيف authorization حقيقي
        // مثال:
        // if ($user->role !== 'admin') {
        //     return json_encode(['error' => 'Forbidden'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        // }
        $roles = ['user', 'employee'];
        $users = User::query()
            ->whereIn('role', $roles)
            ->latest()
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'role' => $employee->role,
                ];
            })
            ->values();

        if ($users->isEmpty()) {
            return json_encode([
                'message' => 'No employee users found',
                'data' => [],
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        return json_encode([
            'count' => $users->count(),
            'data' => $users,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
