<?php

use App\Models\Property;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Search Engine
    |--------------------------------------------------------------------------
    */

    'driver' => env('SCOUT_DRIVER', 'typesense'),

    /*
    |--------------------------------------------------------------------------
    | Index Prefix
    |--------------------------------------------------------------------------
    */

    'prefix' => env('SCOUT_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Queue Data Syncing
    |--------------------------------------------------------------------------
    | Recomendado en producción para no bloquear el request al crear/actualizar
    */

    'queue' => [
        'connection' => env('SCOUT_QUEUE_CONNECTION', false),
        'queue'      => env('SCOUT_QUEUE', 'scout'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Identify User
    |--------------------------------------------------------------------------
    */

    'identify' => env('SCOUT_IDENTIFY', false),

    /*
    |--------------------------------------------------------------------------
    | Algolia Configuration (no usado, pero se deja por si acaso)
    |--------------------------------------------------------------------------
    */

    'algolia' => [
        'id'     => env('ALGOLIA_APP_ID', ''),
        'secret' => env('ALGOLIA_SECRET', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Meilisearch Configuration (no usado)
    |--------------------------------------------------------------------------
    */

    'meilisearch' => [
        'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
        'key'  => env('MEILISEARCH_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Typesense Configuration
    |--------------------------------------------------------------------------
    */

    'typesense' => [
        'client-settings' => [
            'api_key'                        => env('TYPESENSE_API_KEY', 'xyz'),
            'nodes' => [
                [
                    'host'     => env('TYPESENSE_HOST', 'localhost'),
                    'port'     => env('TYPESENSE_PORT', '8108'),
                    'path'     => env('TYPESENSE_PATH', ''),
                    'protocol' => env('TYPESENSE_PROTOCOL', 'http'),
                ],
            ],
            'nearest_node' => [
                'host'     => env('TYPESENSE_HOST', 'localhost'),
                'port'     => env('TYPESENSE_PORT', '8108'),
                'path'     => env('TYPESENSE_PATH', ''),
                'protocol' => env('TYPESENSE_PROTOCOL', 'http'),
            ],
            'connection_timeout_seconds'  => env('TYPESENSE_TIMEOUT', 2),
            'healthcheck_interval_seconds' => 30,
            'num_retries'                 => 3,
            'retry_interval_seconds'      => 1,
        ],

        /*
        |----------------------------------------------------------------------
        | Model Settings
        | Aquí se define el schema de cada colección en Typesense.
        | Cada campo en toSearchableArray() debe tener su entrada aquí
        | con el tipo correcto.
        |----------------------------------------------------------------------
        */

        'model-settings' => [

            Property::class => [

                'collection-schema' => [
                    'fields' => [
                        // Campos de texto — buscables por defecto
                        ['name' => 'id',          'type' => 'string'],
                        ['name' => 'title',       'type' => 'string'],
                        ['name' => 'description', 'type' => 'string'],
                        ['name' => 'address',     'type' => 'string'],
                        ['name' => 'city',        'type' => 'string'],
                        ['name' => 'state',       'type' => 'string'],
                        ['name' => 'country',     'type' => 'string'],

                        // Campos para filtrado (facets) — no buscables por texto
                        ['name' => 'type',      'type' => 'string', 'facet' => true],
                        ['name' => 'operation', 'type' => 'string', 'facet' => true],
                        ['name' => 'status',    'type' => 'string', 'facet' => true],

                        // Campos numéricos — útiles para ordenar y filtrar por rango
                        ['name' => 'price',      'type' => 'float'],
                        ['name' => 'bedrooms',   'type' => 'int32'],
                        ['name' => 'created_at', 'type' => 'int64'],
                    ],

                    // Campo por el que Typesense ordena por defecto
                    'default_sorting_field' => 'created_at',
                ],

                // Campos en los que Scout busca cuando llamas a Property::search('texto')
                'search-parameters' => [
                    'query_by' => 'title,description,address,city,state,country',
                ],
            ],

        ],
    ],

];