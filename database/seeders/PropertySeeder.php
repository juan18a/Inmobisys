<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        // ── NUEVO: asignar las propiedades de seed al primer admin disponible ──
        // Si no existe ningún admin, las propiedades quedan sin dueño (user_id null)
        // y solo el admin podrá gestionarlas desde el panel.
        $admin = User::where('role', 'admin')->first();

        if (! $admin) {
            $this->command->warn('⚠️  No se encontró ningún admin. Las propiedades se crearán con user_id = null.');
        }

        $properties = [
            [
                'title'         => 'Villa Obsidiana',
                'description'   => 'Espectacular villa de lujo con acabados en mármol y madera noble. Cuenta con piscina infinita, jardín tropical y vista panorámica a las montañas. Ideal para familias que buscan exclusividad y confort.',
                'type'          => 'house',
                'operation'     => 'sale',
                'price'         => 4250000,
                'currency'      => 'USD',
                'address'       => 'Calle Obsidiana 142',
                'city'          => 'Guadalajara',
                'state'         => 'Jalisco',
                'country'       => 'MX',
                'zip_code'      => '44100',
                'bedrooms'      => 5,
                'bathrooms'     => 6,
                'parking_spots' => 3,
                'area_total'    => 850,
                'area_built'    => 620,
                'year_built'    => 2020,
                'features'      => ['Alberca', 'Jardín', 'Terraza', 'Seguridad 24h', 'Cuarto de servicio'],
                'status'        => 'available',
                'is_featured'   => true,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Penthouse Monolith',
                'description'   => 'Penthouse de diseño contemporáneo en el corazón de la ciudad. Amplias terrazas con vista a 360 grados, cocina gourmet y acabados de primera. Una joya arquitectónica única.',
                'type'          => 'apartment',
                'operation'     => 'sale',
                'price'         => 8900000,
                'currency'      => 'USD',
                'address'       => 'Av. Reforma 500, Piso 32',
                'city'          => 'Ciudad de México',
                'state'         => 'CDMX',
                'country'       => 'MX',
                'zip_code'      => '06600',
                'bedrooms'      => 4,
                'bathrooms'     => 5,
                'parking_spots' => 4,
                'area_total'    => 580,
                'area_built'    => 580,
                'year_built'    => 2022,
                'features'      => ['Terraza', 'Gimnasio', 'Roof garden', 'Elevador', 'Seguridad 24h'],
                'status'        => 'available',
                'is_featured'   => true,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Loft Ether',
                'description'   => 'Moderno loft en zona artística con techos de doble altura, ventanales de piso a techo y detalles industriales. Perfecto para profesionales creativos.',
                'type'          => 'apartment',
                'operation'     => 'rent',
                'price'         => 28000,
                'currency'      => 'MXN',
                'address'       => 'Calle Álvaro Obregón 78',
                'city'          => 'Ciudad de México',
                'state'         => 'CDMX',
                'country'       => 'MX',
                'zip_code'      => '06700',
                'bedrooms'      => 2,
                'bathrooms'     => 2,
                'parking_spots' => 1,
                'area_total'    => 165,
                'area_built'    => 165,
                'year_built'    => 2019,
                'features'      => ['Terraza', 'Gas natural', 'Amueblado'],
                'status'        => 'available',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Residencia Aqua Marine',
                'description'   => 'Majestuosa residencia frente al mar con acceso privado a la playa. Diseño bioclimático con materiales naturales, piscina desbordante y múltiples terrazas.',
                'type'          => 'house',
                'operation'     => 'sale',
                'price'         => 12500000,
                'currency'      => 'USD',
                'address'       => 'Blvd. Kukulcán Km 12',
                'city'          => 'Cancún',
                'state'         => 'Quintana Roo',
                'country'       => 'MX',
                'zip_code'      => '77500',
                'bedrooms'      => 7,
                'bathrooms'     => 9,
                'parking_spots' => 5,
                'area_total'    => 1200,
                'area_built'    => 780,
                'year_built'    => 2021,
                'features'      => ['Alberca', 'Jardín', 'Terraza', 'Seguridad 24h', 'Paneles solares', 'Cuarto de servicio'],
                'status'        => 'available',
                'is_featured'   => true,
                'cover_image'   => null,
            ],
            [
                'title'         => 'The Glass Sanctuary',
                'description'   => 'Casa minimalista rodeada de bosque con muros de cristal que integran el interior con la naturaleza. Calefacción radiante, spa privado y estudio de meditación.',
                'type'          => 'house',
                'operation'     => 'sale',
                'price'         => 3700000,
                'currency'      => 'USD',
                'address'       => 'Camino al Bosque 33',
                'city'          => 'Valle de Bravo',
                'state'         => 'Estado de México',
                'country'       => 'MX',
                'zip_code'      => '51200',
                'bedrooms'      => 3,
                'bathrooms'     => 3,
                'parking_spots' => 2,
                'area_total'    => 600,
                'area_built'    => 380,
                'year_built'    => 2018,
                'features'      => ['Jardín', 'Terraza', 'Gimnasio', 'Paneles solares'],
                'status'        => 'available',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Oficina Corporativa Centro',
                'description'   => 'Planta completa en edificio corporativo AAA con certificación LEED. Incluye sala de juntas, recepción y estacionamiento exclusivo. Excelente ubicación.',
                'type'          => 'office',
                'operation'     => 'rent',
                'price'         => 95000,
                'currency'      => 'MXN',
                'address'       => 'Paseo de la Reforma 250, Piso 18',
                'city'          => 'Ciudad de México',
                'state'         => 'CDMX',
                'country'       => 'MX',
                'zip_code'      => '06500',
                'bedrooms'      => 0,
                'bathrooms'     => 4,
                'parking_spots' => 6,
                'area_total'    => 420,
                'area_built'    => 420,
                'year_built'    => 2016,
                'features'      => ['Elevador', 'Seguridad 24h', 'Gas natural'],
                'status'        => 'available',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Terreno Frente al Mar',
                'description'   => 'Terreno plano con 40 metros de frente de playa en zona de alta plusvalía. Todos los servicios disponibles. Oportunidad única de inversión.',
                'type'          => 'land',
                'operation'     => 'sale',
                'price'         => 6800000,
                'currency'      => 'USD',
                'address'       => 'Costa Esmeralda Lote 7',
                'city'          => 'Puerto Morelos',
                'state'         => 'Quintana Roo',
                'country'       => 'MX',
                'zip_code'      => '77580',
                'bedrooms'      => 0,
                'bathrooms'     => 0,
                'parking_spots' => 0,
                'area_total'    => 2400,
                'area_built'    => 0,
                'year_built'    => null,
                'features'      => [],
                'status'        => 'available',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Casa Velvet Horizon',
                'description'   => 'Elegante casa de campo con caballerizas, huerto orgánico y casa de huéspedes independiente. Ambiente tranquilo a solo 45 minutos de la ciudad.',
                'type'          => 'house',
                'operation'     => 'sale',
                'price'         => 5100000,
                'currency'      => 'USD',
                'address'       => 'Carretera Tepoztlán Km 8',
                'city'          => 'Tepoztlán',
                'state'         => 'Morelos',
                'country'       => 'MX',
                'zip_code'      => '62520',
                'bedrooms'      => 4,
                'bathrooms'     => 4,
                'parking_spots' => 4,
                'area_total'    => 3200,
                'area_built'    => 450,
                'year_built'    => 2015,
                'features'      => ['Jardín', 'Alberca', 'Cuarto de servicio', 'Paneles solares'],
                'status'        => 'reserved',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Departamento Ivory Peak',
                'description'   => 'Departamento de lujo en condominio con amenidades de resort: spa, club de golf, restaurante y marina privada. La vida que mereces.',
                'type'          => 'apartment',
                'operation'     => 'sale',
                'price'         => 9200000,
                'currency'      => 'USD',
                'address'       => 'Marina Vallarta Blvd 1',
                'city'          => 'Puerto Vallarta',
                'state'         => 'Jalisco',
                'country'       => 'MX',
                'zip_code'      => '48335',
                'bedrooms'      => 4,
                'bathrooms'     => 5,
                'parking_spots' => 2,
                'area_total'    => 380,
                'area_built'    => 380,
                'year_built'    => 2023,
                'features'      => ['Alberca', 'Gimnasio', 'Terraza', 'Elevador', 'Seguridad 24h'],
                'status'        => 'available',
                'is_featured'   => true,
                'cover_image'   => null,
            ],
            [
                'title'         => 'Local Comercial Premium',
                'description'   => 'Local en esquina en plaza comercial de alto tráfico. Fachada de doble altura, bodega y estacionamiento para clientes. Ideal para franquicia o restaurante.',
                'type'          => 'commercial',
                'operation'     => 'rent',
                'price'         => 65000,
                'currency'      => 'MXN',
                'address'       => 'Plaza Antara Local 42',
                'city'          => 'Ciudad de México',
                'state'         => 'CDMX',
                'country'       => 'MX',
                'zip_code'      => '11590',
                'bedrooms'      => 0,
                'bathrooms'     => 2,
                'parking_spots' => 8,
                'area_total'    => 210,
                'area_built'    => 210,
                'year_built'    => 2014,
                'features'      => ['Seguridad 24h', 'Elevador'],
                'status'        => 'available',
                'is_featured'   => false,
                'cover_image'   => null,
            ],
        ];

        foreach ($properties as $data) {
            // ── NUEVO: asignar user_id del admin ──────────────────────────────
            $data['user_id'] = $admin?->id;

            // Generar slug único
            $data['slug'] = Str::slug($data['title']);
            $slug  = $data['slug'];
            $count = 1;
            while (Property::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $slug . '-' . $count++;
            }

            // Crear propiedad
            $property = Property::create($data);

            // Descargar imagen desde picsum y guardarla en storage
            try {
                $imageUrl     = "https://picsum.photos/seed/{$property->id}/800/600";
                $imageContent = Http::timeout(10)->get($imageUrl)->body();
                $filename     = "cover_{$property->id}.jpg";
                $path         = "properties/{$property->id}/{$filename}";

                Storage::disk('public')->put($path, $imageContent);

                $property->images()->create([
                    'path'          => $path,
                    'filename'      => $filename,
                    'original_name' => $filename,
                    'mime_type'     => 'image/jpeg',
                    'size'          => strlen($imageContent),
                    'sort_order'    => 0,
                    'is_cover'      => true,
                ]);

                $property->update(['cover_image' => $path]);

                $this->command->info("✅ {$property->title} — imagen guardada.");
            } catch (\Exception $e) {
                $this->command->warn("⚠️  {$property->title} — sin imagen: {$e->getMessage()}");
            }
        }

        $this->command->info('🏠 ' . count($properties) . ' propiedades creadas correctamente.');
    }
}
