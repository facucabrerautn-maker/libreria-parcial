# Spec (delta)

**Change**: C-12 `historial-inmutable`  
**Capability**: `historial-inmutable`  
**Depende de**: C-04, C-05, C-07, C-11 (todas completadas)  
**Rúbrica**: Ejercicio 5 — Confirmación e historial inmutable = 7 pts  

Este spec es un **delta** sobre los módulos existentes. Implementa el cuerpo de `js/vistas/historial.js` (de stub a implementación completa). No define nuevos módulos.

## 1. Alcance funcional (qué debe hacer el sistema)

| ID | Requisito | Regla / Fuente |
|----|-----------|----------------|
| HIS-01 | Tabla con identificador, fecha, cliente y total de cada venta confirmada, ordenada de más reciente a más antigua | RN-HIS-01, SU-03, US-025 CA-1 |
| HIS-02 | Cada fila ofrece una acción para consultar los renglones de esa venta | RN-HIS-01, US-025 CA-2 |
| HIS-03 | Detalle de venta: renglones con libro, cantidad, precio unitario y subtotal leídos del propio registro de la venta (snapshot), nunca del catálogo | RN-VEN-07, RN-HIS-02, US-026 |
| HIS-04 | Inmutabilidad: no hay acciones de edición ni de borrado desde la interfaz; ninguna función elimina registros de `libreria.ventas` | RN-HIS-02, US-027, RN-EX-04 |
| HIS-05 | Historial alimentado por `store.listarVentas()` (datos locales), nunca por un array paralelo en memoria | US-025 CA-3 |
| HIS-06 | Estado vacío: mensaje propio con enlace a la vista Ventas | 07 §Flujo 8, US-004 CA-1 |
| HIS-07 | Mensaje de estado inicial escrito en la región `role="status"` de la sección al renderizar | C-02, RN-ACC-02 |
| HIS-08 | Refresco automático cuando cambia el store (`alCambiarElStore`) | RN-HIS-01, C-07 |

## 2. Contratos consumidos (ya implementados en cambios previos)

| Contrato | Archivo | Definido en |
|----------|---------|-------------|
| `store.listarVentas()` | `js/datos.js` | C-04 |
| `store.obtenerVenta(id)` | `js/datos.js` | C-04 |
| `ui.crearElemento(tag, texto, clase)` | `js/ui.js` | C-05 |
| `ui.crearTabla(encabezados, filas, opciones)` | `js/ui.js` | C-05 |
| `ui.mostrarMensaje(contenedor, texto, tipo)` | `js/ui.js` | C-05 |
| `ui.formatearMonto(n)` | `js/ui.js` | C-05 |
| `ui.formatearFecha(iso)` | `js/ui.js` | C-05 |
| `ui.mostrarErrores(contenedor, errores, opciones)` | `js/ui.js` | C-05 |
| `datos.suscribir(callback)` | `js/datos.js` | C-04 |
| `app.montarVista(nombreVista)` | `js/app.js` | C-01 / C-02 |

## 3. Comportamiento del listado de ventas

- `render(sec)` obtiene `store.listarVentas()` y renderiza una tabla con columnas: Identificador, Fecha, Cliente, Total, Detalle.
- Cada fila muestra el `id` de la venta, la fecha formateada con `ui.formatearFecha()` (dd/mm/aaaa), el `clienteNombre` (snapshot) y el `total` con `ui.formatearMonto()`.
- La columna "Detalle" contiene un botón por fila que, al hacer clic, muestra el detalle de renglones de esa venta.
- Las ventas están ordenadas de más reciente a más antigua (ya ordenadas por `store.listarVentas()`).

## 4. Comportamiento del detalle de renglones

- Al clic en "Detalle" de una venta, se obtiene `store.obtenerVenta(id)` y se muestran sus renglones.
- Cada renglón muestra: libro (`titulo`), cantidad, precio unitario y subtotal, todos leídos del registro (snapshot), nunca del catálogo.
- Los importes se muestran con `ui.formatearMonto()`.
- No hay botones de editar ni borrar en el detalle (inmutabilidad).

## 5. Estados de la vista

| Estado | Qué se muestra |
|--------|----------------|
| Vacío (sin ventas) | Mensaje "El historial todavía no tiene ventas registradas..." con enlace a la vista Ventas |
| Con ventas | Tabla de ventas (id, fecha, cliente, total, detalle) |
| Detalle abierto | Renglones de la venta seleccionada con libro, cantidad, precio unitario y subtotal |

## 6. Out of scope

- Edición o borrado de ventas confirmadas (prohibido por RN-HIS-02).
- Persistencia end-to-end y comprobación de precio histórico → C-13.
- Contenido del README y casos manuales → C-14, C-15.
