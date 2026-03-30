<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Property extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'type',
        'operation',
        'price',
        'currency',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'latitude',
        'longitude',
        'bedrooms',
        'bathrooms',
        'parking_spots',
        'area_total',
        'area_built',
        'year_built',
        'features',
        'status',
        'is_featured',
        'cover_image',
    ];

    protected $casts = [
        'price'       => 'decimal:2',
        'area_total'  => 'decimal:2',
        'area_built'  => 'decimal:2',
        'latitude'    => 'decimal:7',
        'longitude'   => 'decimal:7',
        'features'    => 'array',
        'is_featured' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // ── Scout / Typesense ──────────────────────────────────────────────────────

    /**
     * Campos que Typesense indexa.
     *
     * IMPORTANTE: Typesense es estricto con los tipos.
     * - 'id' DEBE ser string
     * - Los campos numéricos deben coincidir exactamente con el schema en scout.php
     * - Los campos string nunca pueden ser null (usar '' como fallback)
     */
    public function toSearchableArray(): array
    {
        return [
            'id'          => (string) $this->id,
            'title'       => (string) ($this->title ?? ''),
            'description' => (string) ($this->description ?? ''),
            'type'        => (string) ($this->type ?? ''),
            'operation'   => (string) ($this->operation ?? ''),
            'address'     => (string) ($this->address ?? ''),
            'city'        => (string) ($this->city ?? ''),
            'state'       => (string) ($this->state ?? ''),
            'country'     => (string) ($this->country ?? ''),
            'status'      => (string) ($this->status ?? ''),
            'price'       => (float)  ($this->price ?? 0),
            'bedrooms'    => (int)    ($this->bedrooms ?? 0),
            'created_at'  => $this->created_at?->timestamp ?? 0,
        ];
    }

    /**
     * Solo indexar propiedades no eliminadas con soft-delete.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->deleted_at === null;
    }

    // ── Relationships ──────────────────────────────────────────────────────────

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ── Helpers de autorización ────────────────────────────────────────────────

    public function canBeEditedBy(User $user): bool
    {
        return $user->isAdmin() || $this->user_id === $user->id;
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    public function getCoverImageUrlAttribute(): ?string
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }

        $firstImage = $this->images()->first();
        return $firstImage ? asset('storage/' . $firstImage->path) : null;
    }

    public function getFormattedPriceAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->price, 0, '.', ',');
    }

    // ── Mutators ───────────────────────────────────────────────────────────────

    public function setTitleAttribute(string $value): void
    {
        $this->attributes['title'] = $value;
        if (empty($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value);
        }
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByOperation($query, string $operation)
    {
        return $query->where('operation', $operation);
    }

    public function scopeVisibleFor($query, User $user)
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }
}
