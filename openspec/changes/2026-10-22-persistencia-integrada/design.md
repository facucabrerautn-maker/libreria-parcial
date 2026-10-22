# Design

## Context

Estado actual: C-01 a C-12 están completados y archivados. La capa de persistencia (`js/storage.js`) ya implementa: seis claves `libreria.*`, siembra condicional (solo si la clave no existe), hidratación del store, `guardarLibros()`, `guardarClientes()`, `guardarVentas()`, `guardarTodo()`, `leerTodo()`, resiliencia ante JSON corrupto y cuota agotada. Las mutaciones de alta de libro (C-09), alta de cliente (C-10) y confirmación de venta (C-11) ya escriben en `localStorage` vía `storage.guardar*`.

C-13 es de **verificación end-to-end**: confirma que todo el flujo de escritura y lectura funciona correctamente junto, que la recarga no duplica, que el precio histórico se conserva y que los avisos al usuario operan. No añade lógica de negocio ni modifica los módulos existentes.

Restricciones que moldean el diseño (no negociables):

- **Cero dependencias y cero build**: la entrega se abre con doble clic sobre `index.html` (RN-ALC-01, RN-ENT-01).
- **Cero red**: no `fetch`, no API, no backend (RN-ALC-02, RN-ALC-03).
- **JavaScript nativo con scripts clásicos IIFE** (RN-ACC-03).
- **Nunca re-sembrar `localStorage` en cada arranque**: siembra condicional a que la clave no exista (regla dura del proyecto).
- **Nunca releer el precio del catálogo al mostrar el historial**: el renglón guarda el snapshot (regla dura del proyecto).
- **localStorage con `try/catch`** en cada acceso (regla dura de JavaScript).

## Goals / Non-Goals

**Goals:**

- Verificar que toda mutación persiste vía `storage.guardar*` (PER-01).
- Verificar que la recarga no duplica ejemplos ni ventas (PER-02).
- Verificar la integridad del precio histórico: modificar el precio de catálogo y recargar → la venta conserva sus importes (PER-03).
- Verificar que las 6 claves `libreria.*` existen con estructura coherente (PER-04).
- Verificar los avisos al usuario: persistencia no disponible, cuota excedida, JSON corrupto (PER-05).
- Documentar los límites de `localStorage` para el README (PER-06).

**Non-Goals:**

- Implementar nuevas escrituras (ya existen desde C-07 a C-12).
- Contenido del README → C-14.
- Ejecución de los 8 casos manuales → C-15.

## Decisions

### D1 — C-13 es de verificación, no de implementación

**Decisión**: C-13 no añade archivos de entrega ni modifica los existentes. Su "implementación" es la verificación end-to-end de comportamientos ya codificados en C-07 a C-12.

**Por qué**: el roadmap define C-13 como "Verificación end-to-end de las escrituras, la recarga sin duplicados y la integridad del precio histórico". Toda la lógica de escritura ya existe; C-13 confirma que funciona junto.

### D2 — No tocar `js/storage.js` ni `js/datos.js`

**Decisión**: no se modifican los módulos de persistencia ni de datos en este change.

**Por qué**: ya están completos y verificados (C-04, C-06, C-07). Modificarlos ampliaría el alcance sin necesidad.

### D3 — Documentar límites para el README (C-14)

**Decisión**: los límites de `localStorage` (dependencia del navegador, perfil y ubicación; ausencia de sincronización entre usuarios; límite de cuota) se documentan para que C-14 los incluya en el README (RN-PER-03, RN-ALC-04).

## Risks / Trade-offs

- **[localStorage bajo `file://` puede ser bloqueado]** → `storage.disponible` y `obtenerAlmacenamiento()` ya manejan este caso; la app funciona en memoria y avisa (C-07).
- **[Cuota agotada]** → `guardar()` devuelve `false`; `app.js` muestra el aviso de persistencia fallida (C-07).
- **[JSON corrupto]** → `leerColeccion()` descarta la colección corrupta, vuelve a sembrar y se informa en consola sin romper el arranque (C-07).

## Migration Plan

No aplica: no hay despliegue, ni base de datos, ni datos previos.

**Rollback**: no hay cambios de entrega que deshacer.

## Open Questions

Ninguna que bloquee la implementación.
