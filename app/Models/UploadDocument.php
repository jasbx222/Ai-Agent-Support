<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadDocument extends Model
{
    protected $table = 'upload_documents';

    protected $fillable = [
        'file_name',
        'file_path',
        'mime_type',
        'extracted_text',

        'metadata',
        'user_id',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
