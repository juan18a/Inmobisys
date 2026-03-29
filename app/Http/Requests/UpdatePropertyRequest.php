<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Recuperamos la propiedad desde la ruta (model binding).
        // Admin puede editar cualquiera; seller solo las suyas.
        $property = $this->route('property');
        $user     = $this->user();

        if (! $user || ! $property) {
            return false;
        }

        return $property->canBeEditedBy($user);
    }

    public function rules(): array
    {
        return [
            'title'             => ['sometimes', 'required', 'string', 'max:255'],
            'description'       => ['sometimes', 'required', 'string'],
            'type'              => ['sometimes', 'required', 'in:house,apartment,office,land,commercial'],
            'operation'         => ['sometimes', 'required', 'in:sale,rent'],
            'price'             => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency'          => ['sometimes', 'string', 'size:3'],
            'address'           => ['sometimes', 'required', 'string', 'max:255'],
            'city'              => ['sometimes', 'required', 'string', 'max:100'],
            'state'             => ['nullable', 'string', 'max:100'],
            'country'           => ['sometimes', 'string', 'max:100'],
            'zip_code'          => ['nullable', 'string', 'max:10'],
            'latitude'          => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'         => ['nullable', 'numeric', 'between:-180,180'],
            'bedrooms'          => ['sometimes', 'integer', 'min:0'],
            'bathrooms'         => ['sometimes', 'integer', 'min:0'],
            'parking_spots'     => ['sometimes', 'integer', 'min:0'],
            'area_total'        => ['nullable', 'numeric', 'min:0'],
            'area_built'        => ['nullable', 'numeric', 'min:0'],
            'year_built'        => ['nullable', 'integer', 'min:1800', 'max:' . (date('Y') + 2)],
            'features'          => ['sometimes', 'array'],
            'features.*'        => ['string'],
            'status'            => ['sometimes', 'in:available,sold,rented,reserved'],
            'is_featured'       => ['sometimes', 'boolean'],
            'images'            => ['sometimes', 'array'],
            'images.*'          => ['image', 'mimes:jpeg,png,webp,jpg', 'max:5120'],
            'delete_images'     => ['sometimes', 'array'],
            'delete_images.*'   => ['integer', 'exists:property_images,id'],
            'cover_image_id'    => ['sometimes', 'nullable', 'integer', 'exists:property_images,id'],
        ];
    }
}
