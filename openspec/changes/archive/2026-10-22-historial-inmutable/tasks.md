# Tasks

> Change `C-12` — `historial-inmutable`. Historial consultable de ventas con detalle de renglones leídos del snapshot (Ejercicio 5 — 7 pts).
> Implementa el cuerpo de `js/vistas/historial.js`.
>
> Verificación: no hay test runner en el proyecto (prohibido por RN-ALC-01 y RN-ENT-01). Cada task indica cómo se comprueba a mano.

## 1. Listado de ventas

- [x] 1.1 En `js/vistas/historial.js`, renderizar una tabla con columnas: Identificador, Fecha, Cliente, Total, Detalle.
  - Usar `<thead>` con `<th scope="col">` y `<tbody>` con `<td>` (RN-ACC-02).
  - Los datos vienen de `store.listarVentas()` (ya ordenados de más reciente a más antigua, SU-03).
  - Cada fila muestra: `id`, `fecha` formateada con `ui.formatearFecha()` (dd/mm/aaaa), `clienteNombre`, `total` con `ui.formatearMonto()`, y un botón "Detalle".
  Verificar que la tabla se renderiza con los encabezados correctos y que no hay ventas inicialmente (estado vacío).
- [x] 1.2 Cada fila tiene un botón "Detalle" que, al hacer clic, muestra los renglones de esa venta.
  Verificar que el botón existe por fila y que su `dataset` lleva el `id` de la venta.
- [x] 1.3 Mensaje de estado vacío cuando no hay ventas: texto propio en la región `.region-mensajes` con enlace a la vista Ventas (`#/ventas`).
  Verificar con `Select-String` sobre el texto del mensaje y la presencia del enlace.

## 2. Detalle de renglones (snapshot)

- [x] 2.1 Al clic en "Detalle" de una venta, obtener `store.obtenerVenta(id)` y mostrar sus renglones.
  Verificar que se lee del registro de la venta, no del catálogo.
- [x] 2.2 Cada renglón muestra: libro (`titulo`), cantidad, precio unitario y subtotal.
  Los importes se muestran con `ui.formatearMonto()`.
  Verificar que los valores coinciden con los del snapshot (no con el precio actual del catálogo).
- [x] 2.3 No hay botones de editar ni borrar en el detalle de renglones (inmutabilidad, RN-HIS-02).
  Verificar que no existen controles de edición/borrado.

## 3. Refresco automático y mensaje inicial

- [x] 3.1 Implementar `alCambiarElStore()` que vuelva a renderizar la tabla desde `store.listarVentas()`.
  Verificar que al confirmar una venta desde la vista Ventas, el historial se actualiza sin recargar.
- [x] 3.2 Mensaje de estado inicial escrito en la región de mensajes al renderizar (C-02).
  Verificar que el mensaje aparece al abrir la vista Historial.

## 4. Verificación integral de alcance

- [x] 4.1 Confirmar que `js/vistas/historial.js` no supera las 200 líneas y que tiene una sola responsabilidad (render y eventos de la vista Historial).
  Verificar con conteo de líneas.
- [x] 4.2 Confirmar que no hay `innerHTML` en `js/vistas/historial.js` (datos de usuario solo con `textContent` y `value`).
  Verificar con `Select-String -Path js\vistas\historial.js -Pattern 'innerHTML'` → sin coincidencias.
- [x] 4.3 Confirmar que no hay `fetch(`, `XMLHttpRequest` ni `https?://` en `js/vistas/historial.js`.
- [x] 4.4 Abrir `index.html` con doble clic, navegar a `#/historial` y verificar:
  - mensaje de estado vacío inicialmente;
  - después de confirmar una venta desde Ventas, aparece en el historial;
  - al clic en "Detalle", se ven los renglones con libro, cantidad, precio unitario y subtotal;
  - no hay botones de editar ni borrar;
  - la consola del navegador queda limpia.
- [x] 4.5 Confirmar que `git status` muestra únicamente `js/vistas/historial.js` modificado y que no se tocó nada de `docs/`, `knowledge-base/` ni `openspec/` fuera de este change.

## Workflow follow-up

- Marcar `[x]` la entrada de C-12 en `CHANGES.md` una vez archivado el change.
- Archivar el change con `/opsx:archive historial-inmutable`.
- Recordar el paso siguiente del roadmap: **C-13 `persistencia-integrada`** (depende de C-07, C-09, C-10, C-11, C-12) completa el Ejercicio 6 con la verificación end-to-end.

---
> Resultado **observado** de cada punto marcado. Ningún punto se da por aprobado sin haber ejecutado la comprobación.
