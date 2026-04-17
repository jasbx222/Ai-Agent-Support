<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'subject' => $this->subject,
            'description' => $this->description,
            'department' => $this->department,
            'priority' => $this->priority,
            'sentiment' => $this->sentiment,
            'status' => $this->status,
            'ai_suggestion' => $this->ai_suggestion,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
