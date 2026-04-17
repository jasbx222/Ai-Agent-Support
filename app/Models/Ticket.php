<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'subject',
        'message',
        'department',
        'priority',
        'sentiment',
        'status',
    ];
}