<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',          // ← NUEVO: vendedor propietario
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

    // ── Relationships ──────────────────────────────────────────────────────────

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    /**
     * El vendedor que creó esta propiedad.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ── Helpers de autorización ────────────────────────────────────────────────

    /**
     * Devuelve true si el usuario dado puede editar esta propiedad.
     * Admin puede editar cualquiera; seller solo las suyas.
     */
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

    /**
     * Scope: propiedades visibles para un usuario dado.
     * Admin ve todas; seller solo las suyas.
     */
    public function scopeVisibleFor($query, User $user)
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }
}
