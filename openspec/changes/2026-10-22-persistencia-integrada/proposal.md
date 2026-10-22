# Proposal

## Why

Las vistas Catálogo, Libros, Clientes, Ventas e Historial están implementadas y verificadas (C-01 a C-12). La persistencia ya tiene su capa base en C-07 (`js/storage.js`) y cada mutación escribe en `localStorage`. Sin embargo, falta una **verificación end-to-end** que confirme que:

1. Toda mutación (alta de libro, alta de cliente, confirmación de venta) pasa por `storage.guardar*` y queda reflejada en `libreria.libros`, `libreria.clientes` y `libreria.ventas` (RN-PER-01).
2. Al recargar después de altas y de una venta, se recuperan los registros guardados sin duplicar ejemplos ni ventas (RN-PER-02, caso manual nº 7).
3. El precio histórico se conserva: modificar únicamente el `precio` de un libro en `libreria.libros` y recargar → la venta confirma su `precioUnitario`, subtotales y total intactos (RN-VEN-07, caso manual nº 6).
4. Las 6 claves `libreria.*` están pobladas y con contenido coherente con el modelo (DD-03, DD-07).
5. Los avisos al usuario funcionan: persistencia no disponible, cuota excedida y recuperación ante JSON corrupto (07 §Flujo 1, P-11).

Este change es **C-13 `persistencia-integrada`**, el siguiente en el camino crítico tras C-12 (sus dependencias están resueltas: C-07, C-09, C-10, C-11, C-12). Sin él no puede avanzar C-14 `readme-entrega` ni cerrar el camino crítico hacia C-15.

## What Changes

Este change se centra en la **verificación end-to-end** de la persistencia y la integridad histórica. Como la capa de escritura ya existe (C-07), C-13:

- Verifica la traza de escritura única: cada mutación alta de libro, alta de cliente y confirmación de venta persiste vía `storage.guardarLibros()`, `storage.guardarClientes()` y `storage.guardarVentas()` respectivamente.
- Verifica la recarga sin duplicados: el seed solo se escribe si la clave no existe; con la clave presente, el contenido guardado manda (DD-08, RN-PER-02).
- Verifica la integridad del precio histórico: confirmar una venta, modificar el precio del catálogo guardado en `libreria.libros`, recargar y comprobar que el renglón conserva `precioUnitario`, subtotal y total (RN-VEN-07, caso manual nº 6).
- Verifica que las 6 claves `libreria.*` existen y tienen estructura coherente con `04_modelo_de_datos.md §Estructura persistida en localStorage`.
- Verifica los avisos al usuario: persistencia no disponible, cuota excedida al escribir y recuperación ante JSON corrupto.

### Fuera de alcance (explícito)

- Implementar nuevas escrituras (ya existen desde C-07, C-09, C-10, C-11).
- Contenido del `README.md` → **C-14 `readme-entrega`**.
- Ejecución de los 8 casos manuales → **C-15 `casos-manuales-verificacion`**.

## Capabilities

### New Capabilities

- `persistencia-integrada`: verificación end-to-end de las escrituras en `localStorage`, la recarga sin duplicados y la integridad del precio histórico.

### Modified Capabilities

Ninguna. `openspec/specs/` ya contiene `estructura-navegacion` (C-01/C-02), `venta-simulada` (C-11) y `historial-inmutable` (C-12); este change añade la capacidad `persistencia-integrada` sin tocar las previas.

## Impact

- **Sin archivos nuevos** en la entrega funcional (la capa de escritura ya existe en `js/storage.js`).
- **Sin archivos modificados** en la entrega funcional (C-13 es de verificación; no añade lógica de negocio).
- **Sin dependencias**: no se agregan `package.json`, `node_modules`, `package-lock.json`, `dist/`, bundler, transpilador, framework, librería, CDN ni fuente remota (RN-ALC-01, RN-ENT-01).
- **Sin red ni backend**: no hay API, base de datos, servidor, login ni variables de entorno (RN-ALC-02, RN-ALC-03). No se usa `fetch` ni ninguna API de red.

## Open Questions

Ninguna que bloquee la implementación. Las decisiones de diseño que afectan a C-13 ya están resueltas:

- **P-02**: claves `libreria.*` con prefijo, una por colección, valor es array de objetos en JSON (DD-07).
- **P-04**: el precio unitario se congela al agregar el renglón, no al confirmar (DD-04).
- **P-11**: si la cuota se agota, la escritura falla, la app sigue funcionando en memoria y muestra un aviso (RN-PER-01).
- **IN-02**: la siembra es condicional a que la clave no exista (DD-08); el precio modificado por el docente sobrevive a la recarga.
