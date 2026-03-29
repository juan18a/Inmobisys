<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo usuarios autenticados pueden crear propiedades.
        // (La ruta ya tiene middleware auth, pero es buena práctica confirmarlo aquí.)
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['required', 'string'],
            'type'          => ['required', 'in:house,apartment,office,land,commercial'],
            'operation'     => ['required', 'in:sale,rent'],
            'price'         => ['required', 'numeric', 'min:0'],
            'currency'      => ['sometimes', 'string', 'size:3'],
            'address'       => ['required', 'string', 'max:255'],
            'city'          => ['required', 'string', 'max:100'],
            'state'         => ['nullable', 'string', 'max:100'],
            'country'       => ['sometimes', 'string', 'max:100'],
            'zip_code'      => ['nullable', 'string', 'max:10'],
            'latitude'      => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'     => ['nullable', 'numeric', 'between:-180,180'],
            'bedrooms'      => ['sometimes', 'integer', 'min:0'],
            'bathrooms'     => ['sometimes', 'integer', 'min:0'],
            'parking_spots' => ['sometimes', 'integer', 'min:0'],
            'area_total'    => ['nullable', 'numeric', 'min:0'],
            'area_built'    => ['nullable', 'numeric', 'min:0'],
            'year_built'    => ['nullable', 'integer', 'min:1800', 'max:' . (date('Y') + 2)],
            'features'      => ['sometimes', 'array'],
            'features.*'    => ['string'],
            'status'        => ['sometimes', 'in:available,sold,rented,reserved'],
            'is_featured'   => ['sometimes', 'boolean'],
            'images'        => ['sometimes', 'array', 'max:20'],
            'images.*'      => ['image', 'mimes:jpeg,png,webp,jpg', 'max:5120'],
            'cover_index'   => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'El título es obligatorio.',
            'description.required' => 'La descripción es obligatoria.',
            'type.required'        => 'El tipo de propiedad es obligatorio.',
            'type.in'              => 'El tipo debe ser: casa, apartamento, oficina, terreno o comercial.',
            'operation.required'   => 'La operación (venta/renta) es obligatoria.',
            'price.required'       => 'El precio es obligatorio.',
            'price.numeric'        => 'El precio debe ser un número válido.',
            'address.required'     => 'La dirección es obligatoria.',
            'city.required'        => 'La ciudad es obligatoria.',
            'images.*.image'       => 'Cada archivo debe ser una imagen válida.',
            'images.*.mimes'       => 'Solo se permiten imágenes JPEG, PNG o WebP.',
            'images.*.max'         => 'Cada imagen no puede superar los 5 MB.',
            'images.max'           => 'No se pueden subir más de 20 imágenes.',
        ];
    }
}
