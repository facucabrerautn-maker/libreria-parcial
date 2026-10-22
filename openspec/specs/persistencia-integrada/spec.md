# persistencia-integrada Specification

## Purpose

Verificación end-to-end de las escrituras en `localStorage`, la recarga sin duplicados y la integridad del precio histórico.

## Requirements

### Requirement: PER-01
Toda mutación (alta de libro, alta de cliente, confirmación de venta) pasa por `storage.guardar*` y queda reflejada en `libreria.libros`, `libreria.clientes` y `libreria.ventas`.
#### Scenario: RN-PER-01

### Requirement: PER-02
Recarga después de altas y de una venta: se recuperan los registros guardados sin duplicar ejemplos ni ventas.
#### Scenario: RN-PER-02, caso manual nº 7

### Requirement: PER-03
Precio histórico: modificar únicamente el `precio` de un libro en `libreria.libros` y recargar → la venta conserva `precioUnitario`, subtotales y total.
#### Scenario: RN-VEN-07, caso manual nº 6

### Requirement: PER-04
Las 6 claves `libreria.*` están pobladas y con contenido coherente con el modelo de `04_modelo_de_datos.md §Estructura persistida en localStorage`.
#### Scenario: DD-03, DD-07

### Requirement: PER-05
Avisos al usuario: persistencia no disponible, cuota excedida al escribir y recuperación ante JSON corrupto.
#### Scenario: 07 §Flujo 1, P-11

### Requirement: PER-06
Límites documentados: dependencia del navegador, del perfil y de la ubicación de apertura; ausencia de sincronización entre usuarios.
#### Scenario: RN-PER-03, RN-ALC-04
