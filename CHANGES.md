# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librería — Parcial 1 (Programación III)**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**
>
> **Restricción dura del proyecto** (RN-ALC-01, RN-ALC-02, RN-ALC-03): HTML, CSS y JavaScript nativos únicamente.
> Ningún change de este roadmap puede introducir framework, librería, CDN, `package.json`, `node_modules`, bundler,
> transpilador, backend, API, base de datos, servidor ni paso de build. La persistencia es `localStorage` (Web Storage API).
> El sistema no tiene autenticación, roles, pagos, despliegue ni variables de entorno.

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 estructura-base-spa ✓
│
├── C-02 navegación-hash-vistas ──────┐ ✓
├── C-03 css-identidad-visual ────────┤ ✓
├── C-04 modelo-datos-y-seed ─────────┤ ✓
│   ├── C-06 validaciones-puras ──────┼── C-09 alta-libros (+ C-07) ────┐ ✓
│   │                                └── C-10 alta-clientes (+ C-07) ┤ ✓
│   └── C-07 persistencia-localstorage┐ ✓                            │
│                                       └── C-08 catálogo-render-filtro ✓
├── C-05 helpers-ui ───────────────────┘ ✓
│
│          C-09 + C-10 ──────────────────────────┐
│                                                 ▼
│                                          C-11 venta-simulada
│                                                 │
│                                          C-12 historial-inmutable
│                                                 │
│                                          C-13 persistencia-integrada
│                                                 │
│                                          C-14 readme-entrega
│                                                 │
│                                          C-15 casos-manuales-verificacion
```

> El árbol muestra la espina principal y las bifurcaciones. Las dependencias transversales (por ejemplo, que
> `C-08` también necesita `C-02`, `C-03` y `C-05`) están listadas explícitamente en la sección **Dependencias**
> de cada change.

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 estructura-base-spa ✓                       [Agente A]

GATE 1: C-01 ✓                     ← PRIMER FORK (4 paralelos)
  → C-02 navegación-hash-vistas                      ✓ [Agente A]
  → C-03 css-identidad-visual                       ✓ [Agente A]
  → C-04 modelo-datos-y-seed                         ✓ [Agente B]
  → C-05 helpers-ui                                  ✓ [Agente C]

GATE 2: C-04 + C-05 ✓               ← FORK (2 paralelos)
  → C-06 validaciones-puras                          ✓ [Agente B]
  → C-07 persistencia-localstorage                   ✓ [Agente B]

GATE 3: C-02 + C-03 + C-05 + C-07 ✓
  → C-08 catálogo-render-filtro ✓ [Agente A]

GATE 4: C-03 + C-04 + C-05 + C-06 + C-07 ✓         ← FORK (2 paralelos)
  → C-09 alta-libros                              ✓ [Agente C]
  → C-10 alta-clientes                              ✓ [Agente C]

GATE 5: C-09 + C-10 ✓
  → C-11 venta-simulada                              [Agente C]

GATE 6: C-11 ✓
  → C-12 historial-inmutable                         [Agente C]

GATE 7: C-12 ✓
  → C-13 persistencia-integrada                      [Agente B]

GATE 8: C-13 ✓
  → C-14 readme-entrega                              [Agente B]

GATE 9: C-14 ✓
  → C-15 casos-manuales-verificacion                [Agente C]
```

### Camino crítico (9 changes — mínimo irreducible)

```
C-01 → C-04 → C-06 → C-09 → C-11 → C-12 → C-13 → C-14 → C-15
```

> Es la cadena de dependencias más larga: fija la duración mínima del plan completo (9 sesiones encadenadas).
> Variante equivalente: `C-01 → C-04 → C-07 → C-09 → C-11 → C-12 → C-13 → C-14 → C-15`.
> Las ramas `C-02`, `C-03`, `C-05`, `C-08` y `C-10` se ejecutan en paralelo y **no alargan** el camino crítico.
> Entran en el camino crítico solo changes exigidos por la rúbrica de 100 puntos: no hay features opcionales,
> refactors visuales ni extras de dashboard.

### Plan óptimo con 3 agentes

```
Paso │ Agente A (HTML y CSS)      │ Agente B (Datos y persistencia) │ Agente C (Interacción y verificación)
─────┼────────────────────────────┼───────────────────────────────┼──────────────────────────────
  1  │ C-01 estructura-base-spa    │              —                │              —
  2  │ C-02 navegación-hash-vistas │ C-04 modelo-datos-y-seed       │ C-05 helpers-ui
  3  │ C-03 css-identidad-visual   │ C-06 validaciones-puras        │              —
  4  │              —              │ C-07 persistencia-localstorage │              —
  5  │ C-08 catálogo-render-filtro │              —                │              —
  6  │              —              │ C-09 alta-libros               │ C-10 alta-clientes
  7  │              —              │ C-11 venta-simulada            │              —
  8  │              —              │              —                │ C-12 historial-inmutable
  9  │              —              │ C-13 persistencia-integrada    │              —
 10  │              —              │ C-14 readme-entrega            │              —
 11  │              —              │              —                │ C-15 casos-manuales-verificacion
```

> Los tramos con un solo change disponible (pasos 3, 4, 7, 9, 10) son esperas impuestas por el grafo de
> dependencias, no por falta de capacidad: el change se toma en cuanto se desbloquea. Carga por agente:
> A = 4 changes, B = 6, C = 5. `C-05` puede pasar al Agente A o B si el Agente C se atrasa en el paso 2.

---

## FASE 0 — Cimientos de la aplicación

> C-01 es el único change sin dependencias y desbloquea todo lo demás. C-02 se apoya sobre el esqueleto de
> C-01 y no puede adelantarse.

### [C-01] `estructura-base-spa`
- **Estado**: `[x]` completado — archivado el 2026-10-22 en `openspec/changes/archive/2026-10-22-estructura-base-spa/`
- **Scope**: Esqueleto completo del proyecto, sin dependencias y sin build
  - Carpeta raíz con `index.html` único (doctype estándar, `lang="es"`, `<title>` "Librería — Catálogo, clientes y ventas") + carpetas `css/`, `js/`, `js/vistas/`, `assets/img/`, `docs/`, `knowledge-base/`, `openspec/`
  - `index.html`: `<header>` (identidad de la librería), `<nav>` con los 5 enlaces `href="#/catalogo"`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`, `<main>` con 5 `<section id="vista-catalogo|libros|clientes|ventas|historial" hidden>` y los `<script src>` clásicos en orden de dependencia, con `js/app.js` al final
  - Módulos con la responsabilidad declarada en `07_flujos_principales.md §Componentes implicados`: `js/app.js`, `js/datos.js`, `js/storage.js`, `js/validaciones.js`, `js/ui.js`, `js/vistas/{catalogo,libros,clientes,ventas,historial}.js`, cada uno con su contrato público en el namespace único `window.Libreria`
  - **Variante de enlace resuelta en la verificación en navegador**: Chrome y Firefox bloquean los módulos ES bajo `file://` por CORS, así que la entrega usa **scripts clásicos con IIFE** (mismo contrato público, mecanismo de enlace independiente). Verificado en Chrome 155.0.8059.85 y Firefox 137.0.1
  - Archivos CSS con separación de responsabilidades: `css/base.css` (reset, tokens, tipografía, layout), `css/componentes.css` (tarjetas, formularios, botones, tablas, badges, mensajes), `css/vistas.css` (detalles por vista)
  - Cero recursos remotos: ninguna fuente, script, imagen o hoja de estilos externa; sin `package.json`, `node_modules`, `package-lock.json` ni carpeta `dist/` (RN-ALC-01, RN-ENT-01)
  - Verificación de apertura por doble clic sobre `file://` en Chrome y Firefox: si el navegador bloquea los módulos ES por CORS, aplicar la alternativa de scripts clásicos con IIFE contemplada en `02_descripcion_general.md §Stack tecnológico`
  - `README.md` de entrega creado como archivo vacío (se completa en C-14)
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/08_arquitectura_propuesta.md §Estructura de directorios`
  - `knowledge-base/02_descripcion_general.md §Stack tecnológico`
  - `knowledge-base/02_descripcion_general.md §Restricciones duras del stack`
  - `knowledge-base/08_arquitectura_propuesta.md §Modelo de despliegue`
  - `knowledge-base/07_flujos_principales.md §Componentes implicados`

---

### [C-02] `navegacion-hash-vistas`
- **Estado**: `[x]` completado - archivado el 2026-10-22 en `openspec/changes/archive/2026-10-22-navegacion-hash-vistas/`
- **Scope**: Router por hash, navegación entre las 5 vistas y estructura semántica del documento (Ejercicio 1 — 20 pts)
  - `js/app.js`: resolución de `location.hash` → id de `<section>`; hash vacío o desconocido → `#/catalogo` con aviso visible, nunca pantalla en blanco (RN-ACC-01)
  - Ciclo de vida de vista: desmontaje de la vista anterior (vaciar su `<section>`) y re-registro de los listeners en cada render (07 §Flujo 2)
  - Vista activa marcada en el DOM con `aria-current="page"` y con clase visual de estado activo (US-002 CA-2)
  - Gestión de foco: al navegar, el foco pasa al `<h1>` de la vista o a `<main tabindex="-1">` (03 §Consideraciones de accesibilidad sobre la navegación)
  - Región de mensajes por vista: `<div role="status" aria-live="polite">` en cada `<section>` para resultados y errores (RN-ACC-02)
  - Estructura semántica en `index.html`: `<header>`, `<nav>`, `<main>`; cada control con `<label for>`; botones con texto que describe la acción; tablas con `<thead><th scope="col">` y `<tbody><td>` (RN-ACC-02, US-003)
  - Mensajes de estado inicial de cada listado: estado vacío propio por vista (RN-ACC-02, US-004 CA-1)
  - Rutas públicas implementadas: `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial` y `#/` → redirección a `#/catalogo` (03 §Rutas públicas)
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 2: Navegación entre vistas`
  - `knowledge-base/03_actores_y_roles.md §Rutas públicas`
  - `knowledge-base/03_actores_y_roles.md §Consideraciones de accesibilidad sobre la navegación`
  - `knowledge-base/08_arquitectura_propuesta.md §Estrategia de renderizado por vista`
  - `knowledge-base/06_funcionalidades.md §Épica 1: Estructura, vistas y navegación HTML`

---

## FASE 1 — Identidad visual y núcleo de datos

> Los cuatro changes de esta fase se desbloquean al mismo tiempo (GATE 1): CSS, modelo de datos, helpers de DOM y
> navegación avanzan en paralelo porque tocan archivos distintos.

### [C-03] `css-identidad-visual`
- **Estado**: `[x]` completado — 2026-10-22. Verificado por revisión de estilos y por el test de integración; la comprobación visual a 320 px / 1280 px queda para el caso manual nº 8 (C-15)
- **Scope**: Identidad visual propia, layout adaptable y base de accesibilidad (Ejercicio 2 — 20 pts)
  - `css/base.css`: reset mínimo, `box-sizing: border-box`, tokens centralizados en `:root` (color, tipografía del sistema, escala de espaciado), ancho máximo cómodo del contenedor a 1280 px, foco visible con `:focus-visible` contrastado sin eliminar `outline` (RN-ACC-03, RN-ACC-05)
  - `css/componentes.css`: clases reutilizables de tarjeta, formulario (input, select, campo de error), botón (variantes primaria y secundaria), tabla, badge, mensaje de resultado y mensaje de error, badge «Sin clasificar»
  - `css/vistas.css`: estilos de detalle por vista (contenedores de grilla, formularios y tablas), listos para recibir los módulos de vista
  - Layout construido con Flexbox o Grid; sin posicionamiento absoluto como mecanismo de maquetación (RN-ACC-04)
  - Adaptabilidad: sin desplazamiento horizontal de la página a 320 px; jerarquía visual mantenida a 1280 px; tablas anchas dentro de un contenedor con `overflow-x: auto` (RN-ACC-04, caso manual nº 8)
  - Errores expresados con texto y con color como apoyo, nunca solo con color (RN-ACC-05)
  - Sin CDN, sin framework, sin preprocesador (Sass/Less) (RN-ALC-01)
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md §Stack tecnológico`
  - `knowledge-base/08_arquitectura_propuesta.md §Accesibilidad — resumen de compromisos técnicos`
  - `knowledge-base/08_arquitectura_propuesta.md §Patrones aplicados`
  - `knowledge-base/06_funcionalidades.md §Épica 2: Presentación CSS, adaptabilidad y accesibilidad`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: HTML semántico, CSS y accesibilidad (RN-ACC)`

---

### [C-04] `modelo-datos-y-seed`
- **Estado**: `[x]` completado — 2026-10-22. Verificado con 27 pruebas automatizadas (`js/datos.js`)
- **Scope**: Entidades, seed determinista y store en memoria (base del Ejercicio 3 — 15 pts)
  - `js/datos.js`: entidades `Libro`, `Editorial`, `Género`, `Autor`, `Cliente`, `Venta` y `Renglón` con los atributos y constraints de `04_modelo_de_datos.md §Entidades` (`isbnNorm`, `emailNorm`, `precio > 0`, `autorIds.length >= 1`, `generoId ∈ {null} ∪ géneros`)
  - Seed determinista: 2 editoriales (`EDI-001`, `EDI-002`), 2 géneros (`GEN-001`, `GEN-002`), 3 autores (`AUT-001`…`AUT-003`), 6 libros (`LIB-001`…`LIB-006`) y 3 clientes (`CLI-001`…`CLI-003`, emails en el dominio reservado `example.com`)
  - Precios del seed con `LIB-001` = 1500.00 y `LIB-002` = 2000.00 para reproducir el caso manual nº 5 sin cargar datos extra (DD-02)
  - Cobertura del seed: `LIB-002` y `LIB-005` sin género (→ «Sin clasificar»), `LIB-002` y `LIB-004` con dos autores (ejercitan la relación N..N), ISBN ficticios sin dígito de control
  - Store en memoria como única copia del estado: `agregarLibro`, `agregarCliente`, `agregarVenta`, `obtenerLibro`, `obtenerCliente`, `listarLibros`, `listarClientes`, `listarVentas` (RN-EX-02)
  - Generadores de identificadores correlativos `LIB-###`, `CLI-###`, `VEN-###`, `REN-###` calculados sobre el máximo existente de cada colección (DD-06, SU-05)
  - Notificación de cambios: el store emite un evento en cada mutación para que las vistas suscritas se re-rendericen sin recargar la página (RN-LIB-05, RN-CLI-03)
  - Orden de listados: libros por título ascendente con desempate por `id` (SU-02); ventas por fecha descendente (SU-03)
- **Dependencias**: C-01
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md §Entidades`
  - `knowledge-base/04_modelo_de_datos.md §Seed data inicial`
  - `knowledge-base/04_modelo_de_datos.md §ERD (Entity Relationship Diagram)`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-06 — Identificadores con prefijo y número de 3 dígitos`
  - `knowledge-base/06_funcionalidades.md §Épica 3: Datos locales, catálogo y filtro`

---

### [C-05] `helpers-ui`
- **Estado**: `[x]` completado — 2026-10-22. Verificado con 21 pruebas automatizadas (`js/ui.js`)
- **Scope**: Helpers de DOM compartidos por las cinco vistas
  - `js/ui.js`: `crearElemento(etiqueta, props, hijos)` que inserta datos de usuario solo con `textContent` y `value` — sin `innerHTML` ni `insertAdjacentHTML` con contenido dinámico (RN-DAT-05, RN-EX-02)
  - `crearTabla(columnas, filas)`: `<thead>` con `<th scope="col">` y `<tbody>` con celdas `<td>` (RN-ACC-02)
  - `mostrarMensaje(vista, texto, tipo)`: escritura en la región `role="status"` de la vista (resultado y error)
  - `mostrarErrores(campo, mensaje)`: texto del error junto al control, `aria-describedby` al mensaje y `aria-invalid="true"` en el campo (RN-ACC-05, RN-EX-03)
  - `moverFoco(elemento)` y `enfocarPrimerError(campos)`: foco al `<h1>` de la vista o al primer campo con error
  - Formato de presentación: `formatearMonto(n)` → `toFixed(2)` sin símbolo de moneda; `formatearFecha(iso)` → formato local legible desde ISO 8601 UTC (DD-10, SU-01, SU-04)
  - Utilidades de texto: `normalizarTitulo(t)` en minúsculas para comparaciones parciales y `esVacio(t)`
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/08_arquitectura_propuesta.md §Patrones aplicados`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Modelo de datos y datos locales (RN-DAT)`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-10 — Formato de importes y de fecha`
  - `knowledge-base/06_funcionalidades.md §Épica 1: Estructura, vistas y navegación HTML`

---

## FASE 2 — Reglas de negocio y persistencia

> C-06 y C-07 se ejecutan en paralelo (GATE 2): ninguno depende del otro y ambos dependen de C-04.

### [C-06] `validaciones-puras`
- **Estado**: `[x]` completado — 2026-10-22. Verificado con 42 pruebas automatizadas (`js/validaciones.js`)
- **Scope**: Funciones puras de validación y cálculo (bloque "validación y actualización" — 5 pts de la rúbrica)
  - `js/validaciones.js`: funciones puras que reciben datos + contexto y devuelven errores por campo; no tocan el DOM (RN-EX-01)
  - `validarLibro(datos, contexto)`: título no vacío, ISBN no vacío, ISBN no duplicado por `isbnNorm`, precio numérico mayor que cero, editorial existente, al menos un autor seleccionado y todos existentes, género existente o ausente (RN-LIB-03)
  - `normalizarIsbn(valor)`: quita espacios y guiones y pasa a minúsculas; `normalizarEmail(valor)`: quita solo espacios exteriores y pasa a minúsculas — dos funciones distintas, nunca una compartida (DD-05, IN-04)
  - `validarCliente(datos, contexto)`: nombre no vacío, email no vacío, formato de email válido (regex laxa con dominio y TLD) y email duplicado por `emailNorm` (RN-CLI-02, P-12)
  - `validarVenta(borrador, contexto)`: cliente existente, al menos un renglón, cantidades enteras mayores que cero y ningún `libroId` repetido (RN-VEN-01, RN-VEN-02, RN-VEN-05)
  - `calcularSubtotal(cantidad, precioUnitario)` y `calcularTotal(renglones)` con redondeo a dos decimales en cada subtotal y en el total (RN-VEN-04)
  - Contrato de todo-o-nada: las funciones devuelven la lista completa de errores antes de que el store mute; un alta fallida no escribe nada (RN-EX-04)
- **Dependencias**: C-04
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Alta de libros (RN-LIB)`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Alta de clientes (RN-CLI)`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Composición y confirmación de venta (RN-VEN)`
  - `knowledge-base/05_reglas_de_negocio.md §Excepciones globales`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-05 — Normalización asimétrica de ISBN y email`

---

### [C-07] `persistencia-localstorage`
- **Estado**: `[x]` completado — 2026-10-22. Verificado con 18 pruebas de persistencia y 9 de arranque (`js/storage.js`, `js/app.js`)
- **Scope**: Capa de persistencia en `localStorage` y arranque de la aplicación
  - `js/storage.js`: una clave por colección con namespace de proyecto — `libreria.libros`, `libreria.clientes`, `libreria.ventas`, `libreria.editoriales`, `libreria.generos`, `libreria.autores` — con lectura y escritura por `JSON.parse` / `JSON.stringify` (DD-03, DD-07, RN-PER-01)
  - Siembra condicional por clave: el seed se escribe solo si la clave no existe; con la clave presente manda el contenido guardado y no se re-siembra ni se fusiona por `id` (DD-08, RN-PER-02) — condición que hace concluyente el caso manual nº 6
  - `hidratar()`: lectura de las 6 claves y población del store; `guardarLibros()`, `guardarClientes()`, `guardarVentas()` invocados desde las mutaciones del store
  - Resiliencia: JSON corrupto en una clave → se descarta esa colección, se vuelve a sembrar esa clave y se informa en consola sin romper el arranque (07 §Flujo 1)
  - Resiliencia: `localStorage` no disponible (modo privado restrictivo, cookies bloqueadas) → la app sigue funcionando en memoria y se muestra un aviso de que la persistencia no está disponible
  - `js/app.js`: bootstrap — siembra/hidratación antes de resolver el hash y renderizar la vista inicial; `#/catalogo` por defecto
  - Aviso de cuota excedida al escribir, si el navegador rechaza la operación (P-11)
- **Dependencias**: C-04, C-05
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md §Estructura persistida en localStorage`
  - `knowledge-base/07_flujos_principales.md §Flujo 1: Arranque de la aplicación y siembra inicial`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-08 — Seed condicional: solo se siembra si la clave no existe`
  - `knowledge-base/10_preguntas_abiertas.md §IN-02 — Persistencia obligatoria vs. precio de catálogo que el docente modifica a mano`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Persistencia (RN-PER)`

---

## FASE 3 — Catálogo y búsqueda

> Depende de la navegación (C-02), de los estilos (C-03), de los helpers (C-05) y del store hidratado desde
> `localStorage` (C-07). Cierra el Ejercicio 3 junto con C-04 y C-07.

### [C-08] `catalogo-render-filtro`
- **Estado**: `[x]` completado - 2026-10-22. Verificado con 53 pruebas automatizadas (`js/vistas/catalogo.js`, `js/vistas/catalogo-buscador.js`, `js/vistas/catalogo-fichas.js`); la comprobación visual a 320 px / 1280 px queda para el caso manual nº 8 (C-15)
- **Scope**: Catálogo generado por JavaScript y filtro por título (Ejercicio 3 — 15 pts)
  - `js/vistas/catalogo.js`: render de la grilla de libros desde `store.libros` — nunca desde HTML fijo (RN-CAT-01)
  - Cada ficha muestra título, ISBN, editorial, género, autores y precio; libro sin género → badge «Sin clasificar» (RN-CAT-04, US-011)
  - Buscador por título: `submit` interceptado con `preventDefault` + escucha en `input`; `trim()` del texto, comparación en minúsculas y coincidencia parcial (RN-CAT-02)
  - Búsqueda vacía o con solo espacios → se muestra el catálogo completo (RN-CAT-03, IN-05)
  - Estados distintos: catálogo vacío → mensaje propio; búsqueda sin coincidencias → mensaje «No se encontraron libros para "…"» (RN-CAT-04, US-004 CA-2)
  - Suscripción al evento de cambio del store: un alta de libro actualiza la grilla sin recargar la página (RN-LIB-05)
  - Orden del listado por título ascendente con desempate por `id` (SU-02); precios con dos decimales (DD-10)
  - `css/vistas.css`: grilla de catálogo responsiva con Flexbox/Grid, sin desplazamiento horizontal de página a 320 px
- **Dependencias**: C-02, C-03, C-05, C-07
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 3: Búsqueda en el catálogo`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Catálogo, render y filtro (RN-CAT)`
  - `knowledge-base/06_funcionalidades.md §Épica 3: Datos locales, catálogo y filtro`
  - `knowledge-base/08_arquitectura_propuesta.md §Estrategia de renderizado por vista`
  - `knowledge-base/09_decisiones_y_supuestos.md §SU-02 — El catálogo se ordena por título ascendente`

---

## FASE 4 — Altas de libros y clientes

> C-09 y C-10 son paralelos (GATE 4) y cubren el Ejercicio 4 (15 pts). Ninguno depende del otro: comparten el
> mismo módulo de validaciones (C-06) y el mismo store (C-04).

### [C-09] `alta-libros`
- **Estado**: `[x]` completado - 2026-10-22. Verificado con 36 pruebas automatizadas (`js/vistas/libros.js`, `js/vistas/libros-formulario.js`, `js/vistas/libros-listado.js`); 214 en total con las 178 previas
- **Scope**: Formulario de alta de libros con selectores relacionados y listado de libros (Ejercicio 4 — 6 pts)
  - `js/vistas/libros.js`: formulario con título, ISBN, precio, editorial, género y autores; `type="number"`, `min`, `step` y `required` como primera barrera, no como única (08 §Seguridad)
  - Selectores generados desde los datos locales: `<select>` de editorial y de género, `<select multiple>` (o checkboxes equivalentes) de autores; la opción «Sin clasificar» mapea a `generoId = null` (RN-LIB-01, RN-LIB-02, IN-06)
  - `submit` con `preventDefault` y llamada a `validarLibro()`: errores por campo mostrados junto al control con `aria-describedby`; si hay un error no se escribe nada (RN-LIB-03, RN-LIB-05, RN-EX-01, RN-EX-03, RN-EX-04)
  - Alta: construcción del `Libro` con `id` nuevo, `isbnNorm` calculado y `generoId = null` si se eligió «Sin clasificar»; `store.agregarLibro()` y `storage.guardarLibros()`
  - Tras el alta: limpiar el formulario, emitir mensaje de resultado y refrescar el listado de Libros, el catálogo y el selector de libros de Ventas sin recargar la página (RN-LIB-05, US-015)
  - Listado de libros registrados con título, ISBN, editorial, género, autores y precio; sin acciones de edición ni de borrado (IN-07)
  - `css/vistas.css`: layout del formulario y del listado de libros, con la tabla dentro de un contenedor con `overflow-x: auto`
- **Dependencias**: C-03, C-04, C-05, C-06, C-07
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 4: Alta de libro`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Alta de libros (RN-LIB)`
  - `knowledge-base/06_funcionalidades.md §Épica 4: Alta de libros`
  - `knowledge-base/08_arquitectura_propuesta.md §Seguridad`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-05 — Normalización asimétrica de ISBN y email`

---

### [C-10] `alta-clientes`
- **Estado**: `[x]` completado - 2026-10-22. Verificado con 26 pruebas automatizadas (`js/vistas/clientes.js`, `js/vistas/clientes-formulario.js`, `js/vistas/clientes-listado.js`); 240 en total con las 214 previas
- **Scope**: Formulario de alta de clientes y padroneo de clientes (Ejercicio 4 — 4 pts)
  - `js/vistas/clientes.js`: formulario con nombre completo (campo único, sin apellido separado) y email con `type="email"` (RN-CLI-01, P-07)
  - `submit` con `preventDefault` y llamada a `validarCliente()`: errores por campo mostrados junto al control; nada se escribe si falla una comprobación (RN-CLI-02, RN-EX-03, RN-EX-04)
  - Alta: construcción del `Cliente` con `id` nuevo y `emailNorm` calculado; `store.agregarCliente()` y `storage.guardarClientes()`
  - Tras el alta: limpiar el formulario, emitir mensaje de resultado y refrescar el listado de Clientes y el selector de cliente de Ventas sin recargar la página (RN-CLI-03, US-018)
  - Listado de clientes con nombre y email; sin acciones de edición ni de borrado (IN-07)
  - `css/vistas.css`: layout del formulario y del listado de clientes
- **Dependencias**: C-03, C-04, C-05, C-06, C-07
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 5: Alta de cliente`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Alta de clientes (RN-CLI)`
  - `knowledge-base/06_funcionalidades.md §Épica 5: Alta de clientes`
  - `knowledge-base/04_modelo_de_datos.md §Cliente`
  - `knowledge-base/10_preguntas_abiertas.md §IN-04 — "Sin espaciar exterior" en email vs. "sin espacios ni guiones" en ISBN`

---

## FASE 5 — Venta simulada e historial

> C-11 necesita los dos formularios de alta (C-09 y C-10) para que sus selectores reflejen las altas en vivo;
> C-12 se apoya sobre las ventas ya confirmadas.

### [C-11] `venta-simulada`
- **Estado**: `[x]` completado - archivado el 2026-10-22 en `openspec/changes/archive/2026-10-22-venta-simulada/`
- **Scope**: Composición de la venta, cálculos, validación y confirmación (Ejercicio 5 — 13 pts)
  - `js/vistas/ventas.js`: selector de cliente alimentado con `store.clientes` y selector de libro alimentado con `store.libros`, ambos reflejando las altas en vivo (RN-LIB-05, RN-CLI-03)
  - Agregar renglón: cliente existente, libro existente y cantidad **entera** mayor que cero — se rechazan cero, negativos y decimales (RN-VEN-01)
  - Control de duplicados: si el `libroId` ya está en el borrador, se incrementa la cantidad del renglón existente y se informa el duplicado; nunca se crea un segundo renglón con el mismo libro (RN-VEN-02, caso manual nº 4)
  - Snapshot en el renglón: `titulo`, `isbn`, `autores`, `editorial` y `precioUnitario` leído del catálogo al agregar el renglón (DD-04, DD-09, RN-VEN-07)
  - Edición del borrador: cambiar la cantidad y quitar renglones mientras la venta no está confirmada (RN-VEN-03)
  - Cálculos visibles: subtotal = cantidad × precio unitario, total = suma de subtotales, todo con dos decimales (RN-VEN-04)
  - Bloqueo de confirmación: sin cliente, sin renglones o con cantidades inválidas → acción deshabilitada y motivo explícito al usuario (RN-VEN-05)
  - Confirmación: objeto `Venta` con `id` correlativo `VEN-###`, `fecha` en ISO 8601 UTC, `clienteId`, `clienteNombre` (snapshot), `renglones` y `total`; persistencia en `libreria.ventas`; limpieza del formulario y del borrador; mensaje de resultado con el identificador (RN-VEN-06, RN-HIS-03)
  - Doble clic en «Confirmar venta» → botón deshabilitado mientras procesa, para no crear dos ventas (07 §Flujo 7)
  - `css/vistas.css`: tabla de renglones dentro de un contenedor con `overflow-x: auto` y panel de resumen de la venta
- **Dependencias**: C-03, C-04, C-05, C-06, C-07, C-09, C-10
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 6: Composición de la venta`
  - `knowledge-base/07_flujos_principales.md §Flujo 7: Confirmación de la venta`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Composición y confirmación de venta (RN-VEN)`
  - `knowledge-base/04_modelo_de_datos.md §Venta`
  - `knowledge-base/04_modelo_de_datos.md §Renglón`

---

### [C-12] `historial-inmutable`
- **Estado**: `[x]` completado - archivado el 2026-10-22 en `openspec/changes/archive/2026-10-22-historial-inmutable/`
- **Scope**: Historial consultable con detalle de renglones e inmutabilidad de la venta confirmada (Ejercicio 5 — 7 pts)
  - `js/vistas/historial.js`: tabla con identificador, fecha, cliente y total, ordenada de más reciente a más antigua (RN-HIS-01, SU-03)
  - Detalle de venta: renglones con libro, cantidad, precio unitario y subtotal leídos **del propio registro de la venta**, nunca del catálogo (RN-VEN-07, RN-HIS-02)
  - Inmutabilidad: la vista no ofrece acciones de edición ni de borrado, y ninguna función de la interfaz elimina registros de `libreria.ventas` (RN-HIS-02, US-027)
  - Historial alimentado por `store.ventas` (datos locales), nunca por un array paralelo en memoria (US-025 CA-3)
  - Estado vacío: mensaje propio con enlace a la vista Ventas (07 §Flujo 8)
  - `css/vistas.css`: layout del historial y del detalle de venta
- **Dependencias**: C-04, C-05, C-07, C-11
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 8: Consulta del historial y detalle de una venta`
  - `knowledge-base/07_flujos_principales.md §Flujo 9: Comprobación guiada del precio histórico (caso manual nº 6)`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Historial e inmutabilidad (RN-HIS)`
  - `knowledge-base/06_funcionalidades.md §Épica 7: Historial e inmutabilidad`
  - `knowledge-base/09_decisiones_y_supuestos.md §DD-09 — Snapshot descriptivo en el renglón y en la venta`

---

## FASE 6 — Persistencia integrada y entrega

> C-13 cierra el bloque de persistencia (Ejercicio 6 — 4 pts) verificando el comportamiento end-to-end sobre las
> cuatro escrituras reales. C-14 documenta la entrega y C-15 registra los 8 casos manuales ejecutados.

### [C-13] `persistencia-integrada`
- **Estado**: `[x]` completado - archivado el 2026-10-22 en `openspec/changes/archive/2026-10-22-persistencia-integrada/`
- **Scope**: Verificación end-to-end de la persistencia y de la integridad histórica (Ejercicio 6 — 4 pts)
  - Traza de escritura única: toda mutación (alta de libro, alta de cliente, confirmación de venta) pasa por `storage.guardar*` y queda reflejada en `libreria.libros`, `libreria.clientes` y `libreria.ventas` (RN-PER-01)
  - Recarga después de altas y de una venta: se recuperan los registros guardados sin duplicar ejemplos ni ventas (RN-PER-02, caso manual nº 7)
  - Precio histórico: modificar **únicamente** el `precio` de un libro en `libreria.libros` y recargar → la venta conserva `precioUnitario`, subtotales y total (RN-VEN-07, caso manual nº 6)
  - Confirmación de las 6 claves `libreria.*` pobladas y con contenido coherente con el modelo de `04_modelo_de_datos.md §Estructura persistida en localStorage` (DD-03, DD-07)
  - Avisos al usuario verificados: persistencia no disponible, cuota excedida al escribir y recuperación ante JSON corrupto (07 §Flujo 1, P-11)
  - Límites documentados para el README: dependencia del navegador, del perfil y de la ubicación de apertura; ausencia de sincronización entre usuarios (RN-PER-03, RN-ALC-04)
- **Dependencias**: C-07, C-09, C-10, C-11, C-12
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md §Flujo 9: Comprobación guiada del precio histórico (caso manual nº 6)`
  - `knowledge-base/07_flujos_principales.md §Flujo 10: Recarga y verificación de persistencia (caso manual nº 7)`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Persistencia (RN-PER)`
  - `knowledge-base/04_modelo_de_datos.md §Estructura persistida en localStorage`
  - `knowledge-base/10_preguntas_abiertas.md §IN-02 — Persistencia obligatoria vs. precio de catálogo que el docente modifica a mano`

---

### [C-14] `readme-entrega`
- **Estado**: `[ ]` pendiente
- **Scope**: `README.md` de entrega con toda la información obligatoria (Ejercicio 6 — 3 pts)
  - Responsables de la entrega (RN-ENT-02)
  - Pasos para abrir `index.html` con doble clic, sin npm, sin build y sin servidor (RN-ENT-01, RN-ENT-02)
  - Navegación entre las 5 vistas con sus hashes (`#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`) (RN-ACC-01, US-033 CA-3)
  - Funcionalidades implementadas y pendientes: pendientes explícitos de sin edición ni borrado de libros y clientes, sin CRUD de editoriales/géneros/autores, sin stock, sin pagos, sin login y sin sincronización (RN-ENT-02, 01 §Fuera de alcance, IN-07)
  - Ubicación de los datos iniciales: seed en `js/datos.js` y claves `libreria.*` en `localStorage`, con tabla de claves y estructura de un libro y de una venta (RN-ENT-03, US-032, P-02)
  - Procedimiento guiado para el docente: modificar solo el precio del libro guardado y recargar, sobre una copia del proyecto, sin tocar las ventas guardadas (caso manual nº 6, DD-08)
  - Funcionamiento y límites de `localStorage`: depende del navegador, del perfil y de la ubicación de apertura; no se comparte información entre usuarios (RN-PER-03, RN-ALC-04)
  - Procedencia de imágenes ajenas: sección con "no se utilizan imágenes de terceros" (recursos locales y SVG inline) (RN-ENT-02, DD-11, P-15)
  - Estructura de carpetas entregada y separación entre estructura, estilos y comportamiento (RN-ENT-01, US-034)
  - Nota operativa: comportamiento de `localStorage` bajo `file://` y alternativa de servir la carpeta con un servidor estático trivial, aclarando que no es requisito del parcial (08 §Modelo de despliegue)
- **Dependencias**: C-04, C-12, C-13
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Entrega, documentación y verificación (RN-ENT)`
  - `knowledge-base/06_funcionalidades.md §Épica 9: Verificación y documentación de la entrega`
  - `knowledge-base/01_vision_y_objetivos.md §Fuera de alcance`
  - `knowledge-base/10_preguntas_abiertas.md §Preguntas abiertas (priorizadas)`
  - `knowledge-base/08_arquitectura_propuesta.md §Modelo de despliegue`

---

### [C-15] `casos-manuales-verificacion`
- **Estado**: `[x]` completado — ejecutado en Chrome 155+ (2026-10-22), Firefox no probado por limitación del entorno; resultados observados registrados en `README.md §7`
- **Scope**: Ejecución de los 8 casos manuales y registro de los resultados observados (Ejercicio 6 — 3 pts)
  - Tabla en el `README.md` con los 8 casos y su resultado observado (RN-ENT-03, US-031)
  - Caso 1: búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente
  - Caso 2: alta de libro con ISBN existente y luego con ISBN nuevo
  - Caso 3: alta de cliente con email inválido, email existente en mayúsculas y email nuevo
  - Caso 4: venta sin cliente, cantidad cero/negativa/decimal y libro repetido
  - Caso 5: venta válida de dos unidades a 1500 y una a 2000 → subtotales 3000 y 2000, total 5000
  - Caso 6: venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba → el precio unitario, los subtotales y el total conservan los valores confirmados
  - Caso 7: recarga después de altas y de una venta → se recuperan datos sin duplicar ejemplos ni ventas
  - Caso 8: navegación por teclado y anchos de 320 px y 1280 px → foco visible, controles utilizables y tabla con desplazamiento propio
  - Si un caso falla o queda pendiente, registrar el comportamiento real; no declarar aprobada ninguna prueba que no se haya ejecutado (RN-ENT-03)
  - Registrar qué registros del seed se usaron como duplicados (`LIB-001`, `CLI-001`) (SU-10)
  - Comprobación de alcance técnico antes de la entrega: 0 librerías, 0 frameworks, 0 CDNs, 0 dependencias, 0 build (01 §Métricas de éxito)
- **Dependencias**: C-13, C-14
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md §Épica 9: Verificación y documentación de la entrega`
  - `knowledge-base/05_reglas_de_negocio.md §Dominio: Entrega, documentación y verificación (RN-ENT)`
  - `knowledge-base/07_flujos_principales.md §Flujo 11: Verificación de navegación por teclado y adaptabilidad (caso manual nº 8)`
  - `knowledge-base/01_vision_y_objetivos.md §Métricas de éxito`
  - `knowledge-base/10_preguntas_abiertas.md §IN-01 — Importes "con dos decimales" vs. importes esperados escritos sin decimales`

---

## Resumen de changes

| # | Change | Fase | Alcance en una línea | Governance | Dependencias | Puntos de rúbrica |
|---|--------|------|----------------------|------------|--------------|--------------------|
| C-01 | `estructura-base-spa` | FASE 0 | Esqueleto del proyecto: `index.html` único, carpetas `css/`/`js/`/`js/vistas/`/`assets/` y módulos con contrato público, sin dependencias | BAJO | — | Ej. 1 (base) — **completado** |
| C-02 | `navegacion-hash-vistas` | FASE 0 | Router por hash, navegación entre las 5 vistas, `aria-current`, foco y regiones de mensajes | BAJO | C-01 | Ej. 1 — 20 pts - **completado** |
| C-03 | `css-identidad-visual` | FASE 1 | Tokens de diseño, componentes reutilizables, layout Flexbox/Grid adaptable de 320 px a 1280 px y foco visible | BAJO | C-01 | Ej. 2 — 20 pts |
| C-04 | `modelo-datos-y-seed` | FASE 1 | Entidades, seed 6/2/2/3/3 con ids estables y store en memoria con eventos de cambio | CRITICO | C-01 | Ej. 3 (modelo y ejemplos) |
| C-05 | `helpers-ui` | FASE 1 | Helpers de DOM: creación segura de nodos, tablas, mensajes, errores accesibles y formato de importes y fechas | BAJO | C-01 | transversal |
| C-06 | `validaciones-puras` | FASE 2 | Funciones puras de validación de libro, cliente y venta, más normalización de ISBN y email y cálculos | MEDIO | C-04 | Ej. 4 (validación) — 5 pts |
| C-07 | `persistencia-localstorage` | FASE 2 | Claves `libreria.*`, siembra condicional, hidratación del store, arranque de la app y resiliencia | MEDIO | C-04, C-05 | Ej. 3/6 (persistencia) |
| C-08 | `catalogo-render-filtro` | FASE 3 | Catálogo generado desde el array de libros con filtro por título y estados vacío / sin resultados | BAJO | C-02, C-03, C-05, C-07 | Ej. 3 — 15 pts |
| C-09 | `alta-libros` | FASE 4 | Formulario de alta de libros con selectores dependientes, validaciones y actualización sin recarga | MEDIO | C-03, C-04, C-05, C-06, C-07 | Ej. 4 (libros) — 6 pts |
| C-10 | `alta-clientes` | FASE 4 | Formulario de alta de clientes con validación de email único y actualización sin recarga | MEDIO | C-03, C-04, C-05, C-06, C-07 | Ej. 4 (clientes) — 4 pts |
| C-11 | `venta-simulada` | FASE 5 | Composición de renglones con snapshot de precio, cálculos, bloqueos y confirmación de la venta | MEDIO | C-03, C-04, C-05, C-06, C-07, C-09, C-10 | Ej. 5 — 13 pts |
| C-12 | `historial-inmutable` | FASE 5 | Historial consultable con detalle de renglones leídos de la venta, sin edición ni borrado | MEDIO | C-04, C-05, C-07, C-11 | Ej. 5 — 7 pts |
| C-13 | `persistencia-integrada` | FASE 6 | Verificación end-to-end de las escrituras, la recarga sin duplicados y la integridad del precio histórico | CRITICO | C-07, C-09, C-10, C-11, C-12 | Ej. 6 — 4 pts |
| C-14 | `readme-entrega` | FASE 6 | README de entrega: apertura sin npm, navegación, implementado/pendiente, claves, límites de `localStorage` e imágenes | MEDIO | C-04, C-12, C-13 | Ej. 6 (documentación) — 3 pts |
| C-15 | `casos-manuales-verificacion` | FASE 6 | Ejecución de los 8 casos manuales y registro de los resultados observados en el README | MEDIO | C-13, C-14 | Ej. 6 (pruebas) — 3 pts — **completado** |

**Totales**: 15 changes · 7 fases · 10 gates · camino crítico de 9 changes · 100 puntos de rúbrica cubiertos.

### Primer change recomendado

`C-01` `estructura-base-spa` — es el único change sin dependencias, fija el alcance técnico (nada de dependencias
ni build) y desbloquea los cuatro changes paralelos del GATE 1.

Para arrancar: `/opsx:propose C-01-estructura-base-spa`
