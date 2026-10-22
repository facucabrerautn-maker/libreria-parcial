# Design

## Context

Estado actual: C-11 `venta-simulada` está completo y archivado. La vista Ventas permite armar y confirmar ventas, que se persisten en `libreria.ventas`. La vista Historial es un **stub** que solo escribe un mensaje de estado inicial en la región de mensajes de su sección (ver `js/vistas/historial.js`).

El store (`js/datos.js`) ya tiene `listarVentas()` (ordenado por fecha descendente, SU-03) y `obtenerVenta(id)`. Las validaciones y la persistencia están completas. C-12 implementa el cuerpo de `js/vistas/historial.js` consumiendo los contratos ya publicados.

Restricciones que moldean el diseño (no negociables):

- **Cero dependencias y cero build**: la entrega se abre con doble clic sobre `index.html` (RN-ALC-01, RN-ENT-01).
- **Cero red**: no `fetch`, no API, no backend (RN-ALC-02, RN-ALC-03).
- **HTML semántico + CSS propio en archivos externos + JavaScript nativo con scripts clásicos IIFE** (RN-ACC-03).
- **Un solo `<h1>` por vista; cada control con `<label for>`; tablas con `<th scope="col">`** (RN-ACC-02).
- **Nunca `innerHTML` con datos de usuario**: `textContent` + `createElement` (RN-DAT-05).
- **Archivos de ≤ 200 líneas; un módulo = una cosa** (regla dura de JavaScript).
- **Inmutabilidad de ventas confirmadas**: no hay edición ni borrado desde la interfaz (RN-HIS-02, US-027, RN-EX-04).

Relación con el roadmap: C-12 depende de C-04, C-05, C-07 y C-11, todas completadas. Es el siguiente en el camino crítico; tras él vienen C-13 (persistencia integrada), C-14 (README) y C-15 (casos manuales).

## Goals / Non-Goals

**Goals:**

- Vista Historial completa: tabla de ventas confirmadas (id, fecha, cliente, total) ordenada de más reciente a más antigua.
- Acción "Detalle" por fila para ver los renglones de cada venta.
- Detalle de renglones leído del snapshot de la venta (libro, cantidad, precio unitario, subtotal), nunca del catálogo.
- Inmutabilidad: no hay acciones de edición ni de borrado.
- Mensaje de estado vacío con enlace a la vista Ventas.
- Refresco automático cuando cambia el store (`alCambiarElStore`).
- Mensaje de estado inicial en la región de mensajes al renderizar.

**Non-Goals:**

- Persistencia end-to-end y comprobación de precio histórico → C-13.
- Contenido del README → C-14.
- Ejecución de los 8 casos manuales → C-15.
- Edición o borrado de ventas confirmadas → prohibido por el proyecto.

## Decisions

### D1 — Detalle expandido en la misma vista, no navegación separada

**Decisión**: al hacer clic en "Detalle" de una venta, el módulo de historial muestra los renglones de esa venta debajo de la tabla (o en su lugar) dentro de la misma sección `#vista-historial`, sin navegar a otra ruta.

**Por qué**: la consigna pide "consultar los renglones" desde el historial, no una vista de detalle separada. Hacerlo en la misma vista evita complicar el router y mantiene la simplicidad de la SPA de una sola sección por vista.

### D2 — El detalle se renderiza desde el snapshot de la venta

**Decisión**: los renglones del detalle se leen de `store.obtenerVenta(id).renglones`, que ya contiene los snapshots (título, isbn, autores, editorial, precioUnitario, cantidad, subtotal) congelados al momento de la confirmación (C-11, RN-VEN-07).

**Por qué**: RN-VEN-07 exige que el historial no relea el precio del catálogo. El snapshot ya está guardado con la venta; C-12 solo lo muestra.

### D3 — Inmutabilidad por diseño: no hay botones de editar ni borrar

**Decisión**: la vista Historial no renderiza acciones de edición ni borrado para ninguna venta, ni en el listado ni en el detalle.

**Por qué**: RN-HIS-02 y US-027 lo exigen explícitamente. Además, RN-EX-04 prohíbe que ninguna función de la interfaz elimine registros de `libreria.ventas`.

### D4 — `css/vistas.css` ya tiene los estilos necesarios

**Decisión**: `css/vistas.css` ya define `.vista-historial__listado`, `.vista-historial__detalle` y `.tabla-historial` (con `min-width: 34rem`). C-12 no añade reglas CSS nuevas.

**Por qué**: C-01 y C-03 ya prepararon las cajas de detalle por vista. C-12 solo las consume con las clases existentes.

### D5 — `capability-path` elegido: `historial-inmutable`

**Decisión**: la capacidad nueva es `historial-inmutable` (spec en `specs/historial-inmutable/spec.md`).

**Por qué**: es el nombre del change en `CHANGES.md` y describe exactamente el alcance: historial de ventas con detalle inmutable.

## Risks / Trade-offs

- **[C-12 y C-13 tocan `css/vistas.css`]** → C-12 no modifica CSS; usa las clases preexistentes. C-13 solo verifica persistencia, no añade estilos. No hay conflicto.
- **[El historial se refresca automáticamente]** → `alCambiarElStore` vuelve a renderizar la tabla desde `store.listarVentas()`, lo que refleja ventas nuevas confirmadas desde la vista Ventas (RN-HIS-01).
- **[No hay array paralelo]** → el historial lee directamente de `store.listarVentas()`, cumpliendo US-025 CA-3.

## Migration Plan

No aplica: no hay despliegue, ni base de datos, ni datos de venta previos (la colección `libreria.ventas` está vacía con el seed).

**Rollback**: revertir `js/vistas/historial.js` al stub anterior. No hay estado que deshacer.

## Open Questions

Ninguna que bloquee la implementación. Las decisiones de diseño que afectan a C-12 ya están resueltas en `10_preguntas_abiertas.md` y `09_decisiones_y_supuestos.md`.
