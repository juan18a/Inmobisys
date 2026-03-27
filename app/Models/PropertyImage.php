<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'path',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'sort_order',
        'is_cover',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
        'size'     => 'integer',
    ];

    protected $appends = ['url'];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
