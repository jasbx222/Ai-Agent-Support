<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AiRun extends Model
{
    protected $fillable = [
     
'user_id',
    'ticket_id',
    'feature_key',
    'key',
    'status',
    'provider',
    'model',
    'input_hash',
    'started_at',
    'error_message',
    'prompt',
    'response'

    ];

    public function usage(): HasOne
    {
        return $this->hasOne(AiUsage::class, 'ai_run_id');
    }

   
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}