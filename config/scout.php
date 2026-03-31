<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Search Engine
    |--------------------------------------------------------------------------
    | Usa el driver 'database' de Scout, que indexa directamente en PostgreSQL.
    | Sin servicios externos, sin redes Docker, sin configuración adicional.
    */

    'driver' => env('SCOUT_DRIVER', 'database'),

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
    | En producción se puede activar para no bloquear el request al indexar.
    | Requiere que el queue worker esté corriendo.
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
    | Database Driver
    |--------------------------------------------------------------------------
    | El driver 'database' usa la tabla 'scout_*' para el índice full-text.
    | Con PostgreSQL aprovecha el índice FULLTEXT creado en la migración.
    |
    | after: php artisan scout:import "App\Models\Property"
    */

    'database' => [
        'driver' => 'database',
    ],

    /*
    |--------------------------------------------------------------------------
    | Algolia (no usado)
    |--------------------------------------------------------------------------
    */

    'algolia' => [
        'id'     => env('ALGOLIA_APP_ID', ''),
        'secret' => env('ALGOLIA_SECRET', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Meilisearch (no usado)
    |--------------------------------------------------------------------------
    */

    'meilisearch' => [
        'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
        'key'  => env('MEILISEARCH_KEY'),
    ],

];