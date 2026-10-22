# Proposal

## Why

La aplicación ya tiene las vistas Catálogo, Libros y Clientes implementadas y verificadas (C-01 a C-10), pero las
vistas Ventas e Historial siguen siendo **stubs** (solo muestran un mensaje de estado inicial; ver
`js/vistas/ventas.js` y `js/vistas/historial.js`). El Ejercicio 5 de la consigna (13 + 7 pts) exige que un operador
pueda armar una venta con renglones, validar cantidades, congelar el precio unitario como histórico, calcular
subtotales y total, bloquear confirmaciones inválidas y registrar la venta confirmada sin edición ni borrado.

Este change es **C-11 `venta-simulada`**, el siguiente en el camino crítico tras C-09 y C-10 (sus dependencias
están todas resueltas: C-03, C-04, C-05, C-06, C-07, C-09, C-10). Sin él no puede avanzar C-12 `historial-inmutable`
ni cerrar el camino crítico hacia C-13, C-14 y C-15.

## What Changes

- **`js/vistas/ventas.js`**: implementa el render completo de la vista Ventas:
  - Selector de cliente alimentado con `store.clientes` y selector de libro alimentado con `store.libros`, ambos
    reflejando las altas en vivo (RN-LIB-05, RN-CLI-03).
  - Campo de cantidad (entero mayor que cero) y botón "Agregar renglón".
  - Validación al agregar renglón: cliente existente, libro existente, cantidad entera > 0 (RN-VEN-01).
  - Control de duplicados: si el `libroId` ya está en el borrador, se incrementa la cantidad del renglón existente
    y se informa al usuario; nunca se crea un segundo renglón con el mismo libro (RN-VEN-02).
  - Snapshot en cada renglón: `titulo`, `isbn`, `autores`, `editorial` y `precioUnitario` leído del catálogo al
    agregar el renglón, más `cantidad` y `subtotal` (DD-04, DD-09, RN-VEN-07).
  - Edición del borrador: cambiar cantidad y quitar renglones antes de confirmar (RN-VEN-03).
  - Cálculos visibles: subtotal por renglón y total de la venta, siempre con dos decimales (RN-VEN-04).
  - Bloqueo de confirmación: sin cliente, sin renglones o cantidades inválidas → botón deshabilitado y motivo
    explícito al usuario (RN-VEN-05).
  - Confirmación: crea el objeto `Venta` con `id` correlativo `VEN-###`, `fecha` en ISO 8601 UTC, `clienteId`,
    `clienteNombre` (snapshot), `renglones` y `total`; persiste en `libreria.ventas`; limpia formulario y borrador;
    muestra mensaje de resultado con el identificador (RN-VEN-06, RN-HIS-03).
  - Botón "Confirmar venta" deshabilitado mientras se procesa (doble clic) (07 §Flujo 7).
  - Mensaje de estado inicial de "sin ventas" escrito en la región de mensajes de la vista (C-02).

- **`css/vistas.css`**: añade los estilos de detalle para la vista Ventas: tabla de renglones dentro de un
  contenedor con `overflow-x: auto` y panel de resumen de la venta (RN-ACC-04).

### Fuera de alcance (explícito)

- Detalle de venta desde el historial → **C-12 `historial-inmutable`**.
- Verificación end-to-end de persistencia (recarga sin duplicados, precio histórico) → **C-13
  `persistencia-integrada`**.
- Contenido del `README.md` → **C-14 `readme-entrega`**.
- Ejecución de los 8 casos manuales → **C-15 `casos-manuales-verificacion`**.
- Edición y borrado de libros y clientes → fuera de alcance del proyecto (IN-07).
- CRUD de editoriales, géneros y autores → fuera de alcance (IN-07, IN-08).
- Stock, pagos, login, sincronización → fuera de alcance (RN-ALC).

## Capabilities

### New Capabilities

- `venta-simulada`: composición y confirmación de una venta simulada en una sola vista —selector de cliente y
  de libro, agregado de renglones con precio congelado, control de duplicados, cálculos con dos decimales,
  bloqueo de confirmaciones inválidas y registro de la venta en `libreria.ventas`— sin dependencias externas,
  sin build y con apertura por doble clic sobre `file://`.

### Modified Capabilities

Ninguna. `openspec/specs/` ya contiene `estructura-navegacion` (de C-01/C-02); este change añade la capacidad
`venta-simulada` sin tocar la previa.

## Impact

- **Archivos modificados**: `js/vistas/ventas.js` (de stub a implementación completa) y `css/vistas.css`
  (estilos de tabla de renglones y panel de resumen).
- **Sin archivos nuevos** en la entrega funcional.
- **Sin dependencias**: no se agregan `package.json`, `node_modules`, `package-lock.json`, `dist/`, bundler,
  transpilador, framework, librería, CDN ni fuente remota (RN-ALC-01, RN-ENT-01).
- **Sin red ni backend**: no hay API, base de datos, servidor, login ni variables de entorno (RN-ALC-02,
  RN-ALC-03). No se usa `fetch` ni ninguna API de red.
- **Sin cambios de contrato de datos**: el modelo `Venta` y `Renglón` ya está definido en C-04
  (`js/datos.js`) y las claves `libreria.*` en C-07 (`js/storage.js`). C-11 solo consume esos contratos.

## Open Questions

Ninguna que bloquee la implementación. Las decisiones de diseño que afectan a C-11 ya están resueltas:

- **P-01 / P-02 / P-03 / P-05 / P-06**: ids con prefijo + 3 dígitos, claves `libreria.*`, importes con dos
  decimales sin símbolo, fecha ISO 8601 UTC, orden por título/fecha (10_preguntas_abiertas.md).
- **P-04**: el precio unitario se congela al **agregar el renglón** (DD-04), no al confirmar.
