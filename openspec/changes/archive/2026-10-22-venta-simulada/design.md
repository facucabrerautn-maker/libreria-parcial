# Design

## Context

Estado actual: las vistas Catálogo, Libros y Clientes están implementadas y verificadas (C-01 a C-10). Las vistas
Ventas e Historial son **stubs** que solo escriben un mensaje de estado inicial en la región de mensajes de su
sección (ver `js/vistas/ventas.js` y `js/vistas/historial.js`). El store (`js/datos.js`), las validaciones
(`js/validaciones.js`), la persistencia (`js/storage.js`), los helpers de DOM (`js/ui.js`) y el router (`js/app.js`)
ya están completos y funcionan.

C-11 implementa la **composición y confirmación de la venta** en `js/vistas/ventas.js`, consumiendo los contratos
ya publicados por C-04 a C-10. No crea nuevos módulos ni nuevos archivos de entrega; solo rellena el cuerpo del
módulo de vista Ventas y añade reglas de estilo en `css/vistas.css`.

Restricciones que moldean el diseño (no negociables):

- **Cero dependencias y cero build**: la entrega se abre con doble clic sobre `index.html` (RN-ALC-01, RN-ENT-01).
- **Cero red**: no `fetch`, no API, no backend (RN-ALC-02, RN-ALC-03).
- **HTML semántico + CSS propio en archivos externos + JavaScript nativo con scripts clásicos IIFE** (RN-ACC-03).
- **Un solo `<h1>` por vista; cada control con `<label for>`; tablas con `<th scope="col">`** (RN-ACC-02).
- **Nunca `innerHTML` con datos de usuario**: `textContent` + `createElement` (RN-DAT-05).
- **Archivos de ≤ 200 líneas; un módulo = una cosa** (regla dura de JavaScript).
- **localStorage con `try/catch`** en cada acceso (regla dura de JavaScript).

Relación con el roadmap: C-11 depende de C-03, C-04, C-05, C-06, C-07, C-09 y C-10, todas completadas. Es el
siguiente en el camino crítico; tras él vienen C-12 (historial), C-13 (persistencia integrada), C-14 (README) y
C-15 (casos manuales).

## Goals / Non-Goals

**Goals:**

- Vista Ventas completa: selector de cliente, selector de libro, campo de cantidad, botón "Agregar renglón",
  tabla de renglones, panel de resumen con total, botón "Confirmar venta".
- Validación al agregar renglón: cliente existente, libro existente, cantidad entera > 0.
- Control de duplicados: un libro solo aparece una vez por venta; se incrementa cantidad si se repite.
- Snapshot del precio unitario al agregar el renglón (precio congelado, RN-VEN-07).
- Edición del borrador: cambiar cantidad y quitar renglones antes de confirmar.
- Cálculos con dos decimales: subtotal por renglón y total de la venta.
- Bloqueo de confirmación inválida con motivo explícito.
- Confirmación: objeto `Venta` con id correlativo, fecha ISO 8601 UTC, snapshot del cliente, renglones y total;
  persistencia en `libreria.ventas`; limpieza de formulario y borrador; mensaje de resultado.
- Botón "Confirmar venta" deshabilitado durante el procesamiento (doble clic).
- Mensaje de estado inicial en la región de mensajes de la vista.

**Non-Goals:**

- Detalle de venta desde el historial → C-12.
- Verificación end-to-end de persistencia → C-13.
- Contenido del README → C-14.
- Ejecución de los 8 casos manuales → C-15.
- Edición y borrado de libros y clientes → fuera de alcance del proyecto.

## Decisions

### D1 — El módulo de ventas no valida; delega en `js/validaciones.js`

**Decisión**: `js/vistas/ventas.js` construye el borrador de venta en memoria y, al agregar renglón o al
confirmar, llama a `validaciones.validarVenta(borrador, contexto)`. Los errores se muestran con
`ui.mostrarErrores(campo, mensaje)` junto al control. Si hay errores, no se escribe nada (RN-EX-04).

**Por qué**: las funciones puras de validación ya están implementadas y verificadas en C-06. Duplicar lógica de
validación en la vista rompería la regla "un módulo = una cosa" y crearía dos fuentes de verdad.

### D2 — Snapshot al agregar el renglón (P-04, DD-04)

**Decisión**: el precio unitario se lee de `store.libros` en el momento de agregar el renglón y viaja con el
renglón hasta la confirmación. El historial (C-12) leerá estos valores del registro de la venta, nunca del
catálogo (RN-VEN-07).

**Por qué**: P-04 ya fue resuelto con este default. Además, evita que el importe que el usuario ve mientras arma
la venta cambie bajo sus ojos si el catálogo se modifica durante la composición.

**Trade-off**: si el precio de un libro cambia entre que se agrega el renglón y que se confirma la venta, el
renglón conserva el precio antiguo. Ese es el comportamiento exigido por RN-VEN-07 y por el caso manual nº 6.

### D3 — Control de duplicados: incrementar cantidad, no crear segundo renglón

**Decisión**: si el `libroId` ya está en el borrador, se incrementa la cantidad del renglón existente y se
informa al usuario mediante un mensaje en la región de mensajes o junto al control. Nunca se crea un segundo
renglón con el mismo `libroId` (RN-VEN-02, caso manual nº 4).

**Alternativa considerada**: rechazar el duplicado con error. Se descarta porque la consigna permite incrementar
la cantidad y es más amigable para el operador.

### D4 — Estado del borrador vive en el módulo de ventas, no en el store

**Decisión**: el borrador de venta (cliente seleccionado, array de renglones) es estado privado del módulo
`js/vistas/ventas.js`. El store solo persiste la `Venta` confirmada (RN-VEN-06).

**Por qué**: la regla dura "nunca dejar estado global mutable" prohíbe poner el borrador en `window.Libreria`.
El store es la única fuente de verdad de datos persistidos; el borrador es transitorio de una sola vista.

**Consecuencia**: al navegar fuera de la vista Ventas y volver, el borrador se pierde. Es aceptable: el borrador
no es un dato de negocio persistido; solo la venta confirmada lo es.

### D5 — `css/vistas.css` para la vista Ventas

**Decisión**: se añaden reglas en `css/vistas.css` para la tabla de renglones (contenedor `overflow-x: auto`)
y el panel de resumen de la venta. No se crean nuevas hojas de estilo.

**Por qué**: C-01 ya fijó la separación de CSS en tres hojas; C-03 completa la identidad visual. C-11 solo
añade lo específico de la vista Ventas en `css/vistas.css`, que es su archivo natural.

### D6 — Confirmación deshabilita el botón durante el procesamiento

**Decisión**: al hacer clic en "Confirmar venta", el botón se deshabilita hasta que la escritura en
`localStorage` termine (07 §Flujo 7, caso de error: doble clic).

**Por qué**: evitar crear dos ventas por un doble clic rápido. RN-EX-04 exige que ninguna acción deje el estado
incoherente.

### D7 — `capability-path` elegido: `venta-simulada`

**Decisión**: la capacidad nueva es `venta-simulada` (spec en
`specs/venta-simulada/spec.md`).

**Por qué**: es el nombre del change en `CHANGES.md` y describe exactamente el alcance: composición y
confirmación de una venta simulada. No se fusiona con `historial-inmutable` (C-12) porque son capacidades
distintas con dependencias distintas.

## Risks / Trade-offs

- **[El borrador se pierde al cambiar de vista]** → aceptado: el borrador es transitorio de la vista Ventas;
  solo la venta confirmada se persiste. No es un dato de negocio que deba sobrevivir a la navegación.
- **[C-11 y C-12 tocan `css/vistas.css`]** → C-11 añade estilos de tabla de renglones y panel de resumen;
  C-12 añadirá estilos del historial. Son zonas distintas del archivo; no se pisan.
- **[localStorage cuota excedida al confirmar]** → `storage.guardarVentas()` devuelve `false` si falla; `app.js`
  ya muestra el aviso de persistencia fallida (C-07). La venta queda en memoria pero no persistida.
- **[Ningún módulo nuevo]** → el alcance de C-11 es puro relleno de `js/vistas/ventas.js`; no hay riesgo de
  romper contratos existentes.

## Migration Plan

No aplica: no hay despliegue, ni base de datos, ni datos persistidos de venta (la colección `libreria.ventas`
está vacía con el seed). C-11 solo añade código al módulo de vista Ventas.

**Rollback**: revertir `js/vistas/ventas.js` al stub anterior y eliminar las reglas añadidas en `css/vistas.css`.
No hay estado que deshacer porque `libreria.ventas` empieza vacío.

## Open Questions

Ninguna que bloquee la implementación. Las decisiones de diseño que afectan a C-11 ya están resueltas en
`10_preguntas_abiertas.md` y `09_decisiones_y_supuestos.md`:

- P-01, P-02, P-03, P-04, P-05, P-06: resueltos con defaults adoptados (ids, claves, importes, congelamiento de
  precio, fecha, orden).
- IN-09: el precio se congela al agregar el renglón, no al confirmar (DD-04).
