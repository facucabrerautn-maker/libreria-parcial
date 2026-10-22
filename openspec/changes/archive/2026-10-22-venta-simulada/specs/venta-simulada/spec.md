# Spec (delta)

**Change**: C-11 `venta-simulada`  
**Capability**: `venta-simulada`  
**Depende de**: C-03, C-04, C-05, C-06, C-07, C-09, C-10 (todas completadas)  
**Rúbrica**: Ejercicio 5 — Composición y validaciones (8) + Cálculos (5) = 13 pts  

Este spec es un **delta** sobre los módulos existentes. No define nuevos módulos; implementa el cuerpo de
`js/vistas/ventas.js` y añade reglas de estilo en `css/vistas.css`.

## 1. Alcance funcional (qué debe hacer el sistema)

| ID | Requisito | Regla / Fuente |
|----|-----------|----------------|
| VEN-01 | Selector de cliente alimentado con `store.clientes` y selector de libro con `store.libros`, ambos reflejando altas en vivo | RN-LIB-05, RN-CLI-03, 07 §Flujo 6 paso 1 |
| VEN-02 | Al agregar renglón: validar cliente existente, libro existente, cantidad **entera mayor que cero** (rechazar cero, negativos, decimales) | RN-VEN-01, 07 §Flujo 6 paso 2 |
| VEN-03 | Si el `libroId` ya está en el borrador, incrementar la cantidad del renglón existente e informar el duplicado; nunca crear un segundo renglón con el mismo libro | RN-VEN-02, caso manual nº 4 |
| VEN-04 | Cada renglón guarda snapshot: `titulo`, `isbn`, `autores`, `editorial`, `precioUnitario` (precio del catálogo al agregar), `cantidad`, `subtotal` | DD-04, DD-09, RN-VEN-07 |
| VEN-05 | Antes de confirmar: cambiar cantidades y quitar renglones mientras la venta no está confirmada | RN-VEN-03 |
| VEN-06 | Subtotal = cantidad × precio unitario; total = suma de subtotales; todo con dos decimales | RN-VEN-04, US-022 |
| VEN-07 | Bloquear confirmación sin cliente, sin renglones o con cantidades inválidas; motivo explícito al usuario | RN-VEN-05, US-023 |
| VEN-08 | Al confirmar: crear `Venta` con `id` correlativo `VEN-###`, `fecha` ISO 8601 UTC, `clienteId`, `clienteNombre` (snapshot), `renglones`, `total`; persistir en `libreria.ventas`; limpiar formulario y borrador; mostrar mensaje con el id de la venta | RN-VEN-06, RN-HIS-03, 07 §Flujo 7 |
| VEN-09 | Botón "Confirmar venta" deshabilitado mientras se procesa (evitar doble venta por doble clic) | 07 §Flujo 7, caso de error |
| VEN-10 | Vista Ventas escribe su mensaje de estado inicial en la región `role="status"` de la sección | C-02, RN-ACC-02 |
| VEN-11 | Tabla de renglones dentro de contenedor con `overflow-x: auto`; panel de resumen de la venta | RN-ACC-04 |

## 2. Contratos consumidos (ya implementados en cambios previos)

| Contrato | Archivo | Definido en |
|----------|---------|-------------|
| `store.listarClientes()`, `store.obtenerCliente(id)` | `js/datos.js` | C-04 |
| `store.listarLibros()`, `store.obtenerLibro(id)` | `js/datos.js` | C-04 |
| `store.agregarVenta(venta)` | `js/datos.js` | C-04 |
| `validaciones.validarVenta(borrador, contexto)` | `js/validaciones.js` | C-06 |
| `validaciones.calcularSubtotal(cantidad, precioUnitario)`, `calcularTotal(renglones)` | `js/validaciones.js` | C-06 |
| `validaciones.normalizarIsbn(valor)` | `js/validaciones.js` | C-06 |
| `ui.crearElemento(tag, props, hijos)`, `ui.crearTabla(columnas, filas)` | `js/ui.js` | C-05 |
| `ui.mostrarMensaje(region, texto, tipo)`, `ui.mostrarErrores(campo, mensaje)` | `js/ui.js` | C-05 |
| `ui.formatearMonto(n)`, `ui.formatearFecha(iso)` | `js/ui.js` | C-05 |
| `datos.suscribir(callback)` | `js/datos.js` | C-04 |
| `storage.guardarVentas()` | `js/storage.js` | C-07 |
| `app.montarVista(nombreVista)`, `app.avisarCambioDelStore()` | `js/app.js` | C-01 / C-02 / C-07 |

## 3. Comportamiento de validación (delegado a `js/validaciones.js`)

El módulo de ventas **no** valida por sí mismo. Llama a `validaciones.validarVenta(borrador, contexto)` que
devuelve una lista de errores por campo; si hay errores, se muestran junto al control y no se escribe nada
(RN-EX-04). Las reglas aplicadas son:

- `clienteId` debe resolver contra `store.clientes`.
- Al menos un renglón.
- Cada renglón: `libroId` existe, `cantidad` es entero `>= 1`.
- Ningún `libroId` repetido dentro del borrador (duplicado → se incrementa cantidad del existente).

## 4. Comportamiento de snapshot (precio congelado)

Al agregar un renglón, el módulo de ventas lee el libro de `store.libros` y copia al renglón:

| Campo renglón | Origen |
|---------------|--------|
| `libroId` | id del libro seleccionado |
| `titulo` | `libro.titulo` |
| `isbn` | `libro.isbn` |
| `autores` | nombres de autores unidos (resueltos por `autorIds`) |
| `editorial` | nombre de editorial (resuelto por `editorialId`) |
| `precioUnitario` | `libro.precio` (valor del catálogo **en ese momento**) |
| `cantidad` | cantidad ingresada |
| `subtotal` | `round2(cantidad × precioUnitario)` |

El historial (C-12) leerá estos valores **del registro de la venta**, nunca del catálogo (RN-VEN-07).

## 5. Estados de la vista

| Estado | Qué se muestra |
|--------|----------------|
| Vacío (sin cliente, sin renglones) | Mensaje inicial en región de mensajes; botón "Confirmar venta" deshabilitado |
| Borrador con renglones | Tabla de renglones con cantidad, precio unitario, subtotal; panel de resumen con total; botón "Confirmar venta" habilitado si es válido |
| Borrador inválido (sin cliente o sin renglones) | Botón deshabilitado + motivo explícito en región de mensajes |
| Confirmación exitosa | Formulario y borrador limpiados; mensaje de resultado con `VEN-###`; historial se refresca (C-12) |
| Doble clic en confirmar | Botón deshabilitado mientras se procesa |

## 6. Reglas de estilo (css/vistas.css)

- Tabla de renglones envuelta en contenedor con `overflow-x: auto` (RN-ACC-04).
- Panel de resumen de la venta con total destacado.
- Todos los importes con dos decimales (`formatearMonto`).
- Sin `position: absolute` para maquetar; sin anchos fijos de layout en `px`; sin recursos remotos.

## 7. Out of scope

- Detalle de renglones desde el historial → C-12.
- Persistencia end-to-end y comprobación de precio histórico → C-13.
- Contenido del README y casos manuales → C-14, C-15.
