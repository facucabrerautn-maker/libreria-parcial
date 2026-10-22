# Proposal

## Why

C-01 dejó el esqueleto de la aplicación (un `index.html`, cinco `<section>` ocultas y los cinco enlaces
`#/…`), pero **sin comportamiento**: `js/app.js` no registra escuchas ni resuelve la ruta, así que al abrir la
entrega el usuario ve un documento con la navegación y **ninguna vista visible**. El Ejercicio 1 (20 pts) exige
navegación clara entre las cinco vistas (RN-ACC-01), la vista activa marcada en el DOM y con estado visual
(US-002 CA-2), estructura semántica con etiquetas asociadas y tablas con encabezados (RN-ACC-02, US-003) y
mensajes de estado para listas vacías (US-004 CA-1). Nada de eso existe todavía.

C-02 es el change dueño de la navegación (el segundo del camino crítico `C-01 → C-04 → C-06 → C-09 → C-11 →
C-12 → C-13 → C-14 → C-15`): sin él, el resto del roadmap construye vistas que todavía no se pueden abrir.

## What Changes

- `js/app.js` deja de ser un cascarón y pasa a ser el **router por hash**: resuelve `location.hash` contra las
  cinco rutas públicas (`#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`), monta la sección
  correspondiente y monta la vista por defecto `#/catalogo` cuando el hash está vacío, es la raíz `#/` o es
  desconocido, **con aviso visible** y nunca con pantalla en blanco (RN-ACC-01).
- **Ciclo de vida de vista**: la vista anterior se desmonta vaciando su `<section>` y cada render vuelve a
  registrar las escuchas de su módulo de vista, de modo que no queden escuchas duplicadas
  (`07_flujos_principales.md §Flujo 2`).
- La **vista activa** se marca en el DOM con `aria-current="page"` y con una clase visual de estado activo
  (US-002 CA-2), y el enlace que la marca queda distinguido sin depender solo del color (RN-ACC-05).
- **Gestión de foco** al navegar: el foco pasa al `<h1>` de la vista activa o, si no es posible, a la región
  `<main tabindex="-1">` (`03_actores_y_roles.md §Consideraciones de accesibilidad sobre la navegación`).
- Cada `<section>` de vista gana una **región de mensajes** `<div role="status" aria-live="polite">` para
  resultados y errores (RN-ACC-02), y los errores se expresan en texto, nunca solo con color (RN-ACC-05).
- `index.html` gana la **estructura semántica** que exige la regla dura del proyecto: `<main tabindex="-1">`,
  `<nav>` con `aria-label`, y por cada control un `<label for>` asociado, botones nativos cuyo texto describe la
  acción, y tablas con `<thead>` + `<th scope="col">` y `<tbody>` + `<td>` (RN-ACC-02, US-003).
- Cada vista con listado muestra un **estado vacío propio**, distinto del de "búsqueda sin resultados" y del de
  error, de modo que nunca haya un área vacía sin explicación (RN-ACC-02, US-004 CA-1).
- Se resuelve el **hallazgo de foco verificado en Firefox 137.0.1**: al completar el ciclo de tabulación y salir
  del documento, los enlaces de la barra de navegación dejaban de coincidir con `:focus-visible` y perdían el
  anillo de foco. C-02 agrega un respaldo con `:focus` para esos enlaces, además de `:focus-visible`.
- **Cero lógica de negocio**: no hay seed, ni acceso al almacenamiento local del navegador, ni render de
  catálogo, ni formularios de alta, ni venta, ni historial. El `render()` de cada vista queda en su estado vacío
  con su mensaje de estado inicial.

### Fuera de alcance (explícito)

- Identidad visual completa, paleta final y adaptabilidad verificada a 320 px / 1280 px → **C-03**.
- Seed y store en memoria → **C-04**. Helpers de DOM → **C-05**. Validaciones → **C-06**. Persistencia en el
  almacenamiento local del navegador → **C-07**. Catálogo y filtro por título → **C-08**. Alta de libros →
  **C-09**. Alta de clientes → **C-10**. Venta → **C-11**. Historial → **C-12**. Verificación end-to-end →
  **C-13**. Contenido del `README.md` → **C-14**. Ejecución de los 8 casos manuales → **C-15**.
- Lo que exceda el scope de C-02 se registra en el `README.md` de entrega como "pendiente", no se implementa.

## Capabilities

### New Capabilities

Ninguna. La capacidad `estructura-navegacion` ya existe (creada al archivar C-01) y C-02 la **amplía** con el
comportamiento de navegación; no se abre una capacidad gemela.

### Modified Capabilities

- `estructura-navegacion`: se amplía con el router por hash y su normalización de rutas, el ciclo de vida de la
  vista activa, la gestión de foco al navegar, la región de mensajes por vista, la estructura semántica de
  controles y tablas y el estado vacío propio por vista; y se modifican los requirements existentes
  `Barra de navegación con las cinco rutas`, `Estructura semántica del documento` y
  `Separación entre estructura, estilos y comportamiento`.

## Impact

- **Archivos modificados**: `index.html` (región de mensajes por vista, `tabindex` del `<main>`, `aria-label` del
  `<nav>`, foco visible de los enlaces de navegación), `js/app.js` (router por hash, ciclo de vida, foco,
  `aria-current`), `js/vistas/catalogo.js`, `js/vistas/libros.js`, `js/vistas/clientes.js`, `js/vistas/ventas.js`,
  `js/vistas/historial.js` (render con estado vacío propio) y el CSS mínimo del estado activo del nav y del
  respaldo de foco en `css/base.css` / `css/componentes.css`.
- **Archivos nuevos**: ninguno. La entrega sigue siendo `index.html` + `css/` + `js/` + `assets/img/`, sin
  `package.json`, `node_modules`, `package-lock.json`, `dist/`, bundler ni transpilador (RN-ALC-01, RN-ENT-01).
- **Sin red, sin backend y sin persistencia**: no se usa `fetch` ni ninguna API de red, no hay base de datos ni
  servidor ni login, y este change no escribe ni lee el almacenamiento local del navegador (RN-ALC-02,
  RN-ALC-03). La siembra y la persistencia son de C-04 y C-07.
- **Contrato público sin cambios**: `Libreria.app.iniciar()` y `Libreria.app.montarVista(id)` conservan sus
  firmas de C-01, y los cinco módulos de vista siguen exponiendo `render(contenedor)`. C-04 a C-13 se escriben
  contra ese contrato.
- **Mecanismo de enlace sin cambios**: se sigue con scripts clásicos con IIFE sobre `window.Libreria`, porque
  Chrome y Firefox bloquean los módulos ES bajo `file://` por CORS (verificado en C-01). El contrato no depende
  del mecanismo, así que la decisión no bloquea el resto del roadmap.
- **Riesgo asumido**: el estado vacío de las vistas se renderiza sin datos hasta que C-04/C-07 carguen el store;
  es el estado intermedio esperado del roadmap y no implica un fallo de la aplicación.
