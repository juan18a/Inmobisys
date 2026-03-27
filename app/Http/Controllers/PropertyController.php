<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    // ── Index ──────────────────────────────────────────────────────────────────

    // ── Index (Admin Dashboard & Public Gallery) ──────────────────────────────

    public function index(Request $request): Response
    {
        $isAdmin = auth()->check();

        $properties = Property::with('images')
            ->when($request->search, fn($q, $v) =>
                $q->where('title', 'like', "%{$v}%")
                  ->orWhere('address', 'like', "%{$v}%")
                  ->orWhere('city', 'like', "%{$v}%")
            )
            ->when($request->type,      fn($q, $v) => $q->where('type', $v))
            ->when($request->operation, fn($q, $v) => $q->where('operation', $v))
            ->when($isAdmin && $request->status, fn($q, $v) => $q->where('status', $v))
            ->when(!$isAdmin || !$request->status, fn($q) => $q->whereIn('status', ['available', 'reserved']))
            ->latest()
            ->paginate($isAdmin ? 12 : 6)
            ->withQueryString()
            ->through(fn($p) => $this->formatProperty($p));

        // Decidir qué vista mostrar según si es admin o público
        $view = $isAdmin ? 'Properties/Index' : 'Properties/Gallery';

        return Inertia::render($view, [
            'properties' => [
                ...$properties->toArray(),
                'data' => Inertia::merge($properties->items()),
            ],
            'filters' => $request->only(['search', 'type', 'operation', 'status']),
        ]);
    }


    //-------------------------- Landing

    public function landing(Request $request): Response
    {
        $properties = Property::with('images')
            ->whereIn('status', ['available', 'reserved'])
            ->latest()
            ->paginate(6)
            ->through(fn($p) => $this->formatProperty($p));

        return Inertia::render('landing', [
            'properties' => [
                ...$properties->toArray(),
                'data' => Inertia::merge($properties->items()),
            ],
        ]);
    }

// ── API for N8N (consumed by the chat agent) ───────────────────────────────
 
    public function apiIndex(Request $request): JsonResponse
    {
    
             
        
        $properties = Property::with('images')
            ->whereIn('status', ['available', 'reserved'])
            ->when($request->type,      fn($q, $v) => $q->where('type', $v))
            ->when($request->operation, fn($q, $v) => $q->where('operation', $v))
            ->when($request->city,      fn($q, $v) => $q->where('city', 'like', "%{$v}%"))
            ->when($request->min_price, fn($q, $v) => $q->where('price', '>=', $v))
            ->when($request->max_price, fn($q, $v) => $q->where('price', '<=', $v))
            ->when($request->bedrooms,  fn($q, $v) => $q->where('bedrooms', '>=', $v))
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn($p) => $this->formatProperty($p));
 
        return response()->json([
            'success' => true,
            'count'   => $properties->count(),
            'data'    => $properties,
        ]);
    }
 



    // ── Create ─────────────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('Properties/Create');
    }

    // ── Store ──────────────────────────────────────────────────────────────────

    public function store(StorePropertyRequest $request): \Illuminate\Http\RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['slug'] = $this->uniqueSlug($data['title']);

            // Remove images from main data
            unset($data['images'], $data['cover_index']);

            $property = Property::create($data);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $this->storeImages(
                    $property,
                    $request->file('images'),
                    (int) $request->input('cover_index', 0)
                );
            }
        });

        return redirect()
            ->route('properties.index')
            ->with('success', 'Propiedad creada correctamente.');
    }

    // ── Show ───────────────────────────────────────────────────────────────────

    public function show(Property $property): Response
    {
        $property->load('images');

        return Inertia::render('Properties/Show', [
            'property' => $this->formatProperty($property),
        ]);
    }

    // ── Edit ───────────────────────────────────────────────────────────────────

    public function edit(Property $property): Response
    {
        $property->load('images');

        return Inertia::render('Properties/Edit', [
            'property' => $this->formatProperty($property),
        ]);
    }

    // ── Update ─────────────────────────────────────────────────────────────────

    public function update(UpdatePropertyRequest $request, Property $property): \Illuminate\Http\RedirectResponse
    {
        DB::transaction(function () use ($request, $property) {
            $data = $request->validated();

            // Remove image-related keys from main update data
            $deleteImageIds = $data['delete_images'] ?? [];
            $coverImageId   = $data['cover_image_id'] ?? null;
            unset($data['images'], $data['delete_images'], $data['cover_image_id']);

            // Regenerate slug only if title changed
            if (isset($data['title']) && $data['title'] !== $property->title) {
                $data['slug'] = $this->uniqueSlug($data['title'], $property->id);
            }

            $property->update($data);

            // Delete selected images
            if (!empty($deleteImageIds)) {
                $toDelete = $property->images()->whereIn('id', $deleteImageIds)->get();
                foreach ($toDelete as $img) {
                    Storage::disk('public')->delete($img->path);
                    $img->delete();
                }
            }

            // Upload new images
            if ($request->hasFile('images')) {
                $this->storeImages($property, $request->file('images'));
            }

            // Update cover image
            if ($coverImageId) {
                $property->images()->update(['is_cover' => false]);
                $coverImg = $property->images()->find($coverImageId);
                if ($coverImg) {
                    $coverImg->update(['is_cover' => true]);
                    $property->update(['cover_image' => $coverImg->path]);
                }
            }

            // Reorder remaining images
            $property->images()
                     ->orderBy('sort_order')
                     ->get()
                     ->each(fn($img, $i) => $img->update(['sort_order' => $i]));
        });

        return redirect()
            ->route('properties.index')
            ->with('success', 'Propiedad actualizada correctamente.');
    }

    // ── Destroy ────────────────────────────────────────────────────────────────

    public function destroy(Property $property): \Illuminate\Http\RedirectResponse
    {
        DB::transaction(function () use ($property) {
            // Delete all images from disk
            foreach ($property->images as $img) {
                Storage::disk('public')->delete($img->path);
            }

            $property->images()->delete();
            $property->delete(); // SoftDelete
        });

        return redirect()
            ->route('properties.index')
            ->with('success', 'Propiedad eliminada correctamente.');
    }

    // ── API: Delete single image ───────────────────────────────────────────────

    public function destroyImage(Property $property, PropertyImage $image): JsonResponse
    {
        abort_unless($image->property_id === $property->id, 403);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        // If deleted image was cover, assign next available
        if ($image->is_cover) {
            $next = $property->images()->first();
            if ($next) {
                $next->update(['is_cover' => true]);
                $property->update(['cover_image' => $next->path]);
            } else {
                $property->update(['cover_image' => null]);
            }
        }

        return response()->json(['message' => 'Imagen eliminada.']);
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private function storeImages(Property $property, array $files, int $coverIndex = 0): void
    {
        $existingCount = $property->images()->count();

        foreach ($files as $i => $file) {
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $directory = 'properties/' . $property->id;
            $path      = $file->storeAs($directory, $filename, 'public');

            $isCover = ($i === $coverIndex) && ($existingCount === 0);

            $image = $property->images()->create([
                'path'          => $path,
                'filename'      => $filename,
                'original_name' => $file->getClientOriginalName(),
                'mime_type'     => $file->getMimeType(),
                'size'          => $file->getSize(),
                'sort_order'    => $existingCount + $i,
                'is_cover'      => $isCover,
            ]);

            if ($isCover) {
                $property->update(['cover_image' => $path]);
            }
        }
    }

    private function uniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug  = Str::slug($title);
        $count = 0;

        do {
            $candidate = $count ? "{$slug}-{$count}" : $slug;
            $exists    = Property::where('slug', $candidate)
                                 ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                                 ->exists();
            $count++;
        } while ($exists);

        return $candidate;
    }

    private function formatProperty(Property $property): array
    {
        return [
            'id'               => $property->id,
            'title'            => $property->title,
            'slug'             => $property->slug,
            'description'      => $property->description,
            'type'             => $property->type,
            'operation'        => $property->operation,
            'price'            => $property->price,
            'formatted_price'  => $property->formatted_price,
            'currency'         => $property->currency,
            'address'          => $property->address,
            'city'             => $property->city,
            'state'            => $property->state,
            'country'          => $property->country,
            'zip_code'         => $property->zip_code,
            'latitude'         => $property->latitude,
            'longitude'        => $property->longitude,
            'bedrooms'         => $property->bedrooms,
            'bathrooms'        => $property->bathrooms,
            'parking_spots'    => $property->parking_spots,
            'area_total'       => $property->area_total,
            'area_built'       => $property->area_built,
            'year_built'       => $property->year_built,
            'features'         => $property->features ?? [],
            'status'           => $property->status,
            'is_featured'      => $property->is_featured,
            'cover_image_url'  => $property->cover_image_url,
            'images'           => $property->images->map(fn($img) => [
                'id'       => $img->id,
                'url'      => $img->url,
                'is_cover' => $img->is_cover,
            ])->toArray(),
            'created_at'       => $property->created_at?->toDateString(),
        ];
    }
}
