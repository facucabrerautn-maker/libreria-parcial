# Design

## Context

Estado actual: la carpeta del proyecto contiene **solo andamiaje documental** (`docs/`, `knowledge-base/`,
`openspec/`, `CHANGES.md`, `AGENTS.md`/`CLAUDE.md`, `.atl/`, `.opencode/`). No existe ningún archivo de
aplicación: no hay `index.html`, ni `css/`, ni `js/`, ni `README.md`.

Restricciones que moldean el diseño (no negociables, vienen de la consigna y de
`knowledge-base/02_descripcion_general.md §Restricciones duras del stack`):

- **Cero dependencias y cero build**: no `package.json`, no `node_modules`, no bundler, no transpilador. La
  entrega se abre con doble clic sobre `index.html` (RN-ALC-01, RN-ENT-01).
- **Cero red**: no `fetch`, no API, no backend, no base de datos, no login, no variables de entorno (RN-ALC-02,
  RN-ALC-03). La única persistencia futura es `localStorage` (RN-PER-01).
- **HTML semántico + CSS propio en archivos externos + JavaScript nativo ES6+** (RN-ACC-02, RN-ACC-03).
- **Entrega por navegador y por docente**: el docente abre la carpeta y evalúa lo que ve. El punto de partida
  es un documento que se renderiza, no un esqueleto de archivos vacíos.

Relación con el roadmap: `C-01` es el único change sin dependencias y desbloquea el GATE 1 (C-02, C-03, C-04,
C-05). El **Ejercicio 1 de la consigna (20 pts)** se cierra con **C-01 + C-02**: C-01 entrega la estructura de
las cinco vistas y sus enlaces; C-02 (que depende de C-01) entrega el comportamiento de navegación
(hash router, `aria-current="page"`, gestión de foco, regiones de mensajes, formularios y tablas de cada vista).
Ambos artefactos dejan explícita esa frontera.

Ver la justificación del cambio en `proposal.md` y los contratos de comportamiento en
`specs/estructura-navegacion/spec.md`.

## Goals / Non-Goals

**Goals:**

- Entregar una **entrada única** `index.html` que ya se renderiza con doble clic: encabezado con la identidad,
  navegación con las cinco rutas y `<main>` con las cinco secciones de vista.
- Entregar la **estructura de carpetas** y el **esqueleto modular** completo (`js/`, `js/vistas/`, `css/`,
  `assets/img/`) con **contratos públicos estables**, de modo que los changes C-04 a C-13 puedan importar y
  llamar a funciones ya nombradas sin rediseñar nada.
- Dejar los **tokens de diseño** centralizados en `:root` desde el primer archivo CSS, para que la regla
  "nunca escribir hex sueltos en componentes" se cumpla desde el commit inicial y no haya una capa que
  "despachar" después.
- **Verificar** la apertura por doble clic en Chrome y Firefox, y dejar resuelta —no pendiente— la pregunta de
  módulos ES vs. scripts clásicos.
- Cero lógica de negocio: ningún seed, ningún store con datos, ninguna validación, ningún render de contenido,
  ningún acceso a `localStorage`.

**Non-Goals:**

- Enrutado por hash funcional, conmutación visible de vistas, `aria-current`, foco al navegar, regiones
  `aria-live` y contenido interno de cada vista (formularios, tablas, estados vacíos) → **C-02**.
- Paleta, tipografía de marca, espaciado fino, componentes finales y adaptabilidad verificada a 320/1280 px →
  **C-03**.
- Seed, entidades, store en memoria → **C-04**. Helpers de DOM → **C-05**. Validaciones y normalizaciones →
  **C-06**. Lectura/escritura en `localStorage` y siembra condicional → **C-07**. Catálogo y filtro → **C-08**.
  Altas de libros y clientes → **C-09 / C-10**. Venta → **C-11**. Historial → **C-12**. Verificación
  end-to-end → **C-13**. Contenido del `README.md` → **C-14**. Los 8 casos manuales → **C-15**.

## Decisions

### D1 — Un único `index.html` con cinco `<section>` ocultas (SPA con enrutado por hash)

**Decisión**: la entrega tiene un solo documento, `index.html`, con `<header>`, `<nav>` y `<main>`; dentro de
`<main>` viven las cinco `<section id="vista-*">`, todas con `hidden` en el HTML entregado.

**Por qué**: DD-01 ya la fijó. La consigna permite "varias páginas o secciones de una misma página, siempre que
exista navegación clara"; un único documento cumple el formato de entrega más simple, evita duplicar
encabezado, navegación y estilos en cinco archivos, y funciona sobre `file://` (donde `history.pushState` sí
queda bloqueado por CORS).

**Alternativas consideradas**: (a) cinco archivos `.html` con enlaces — multiplica la estructura semántica y el
mantenimiento, y obliga a resolver rutas relativas distintas por archivo; (b) `pushState` — incompatible con
`file://`.

**Trade-off**: se pierde el estado del formulario al navegar entre vistas; el historial del navegador funciona
por hash. Aceptable: los borradores de venta viven en el estado del módulo de Ventas (SU-06).

### D2 — Los enlaces de navegación ya están en el HTML, pero el router NO es de C-01

**Decisión**: C-01 entrega los cinco `<a href="#/…">` con su texto visible y las cinco secciones con su `id`.
La **conmutación** de vistas (escuchar `hashchange`, vaciar la vista anterior, `aria-current="page"`, mover el
foco, resolver `#/` y el hash desconocido a `#/catalogo`) es de **C-02**.

**Por qué**: el alcance de C-01 en `CHANGES.md §FASE 0` es explícito sobre qué contiene `index.html` y no
menciona el router; y C-02 es quien lista el comportamiento de navegación en su propio scope. Partir el
comportamiento evita que C-01 y C-02 compitan por los mismos archivos y deja el Ejercicio 1 repartido en dos
changes con una frontera nítida.

**Consecuencia asumida**: al terminar C-01, todas las secciones siguen ocultas y el documento se ve con el
esqueleto pero sin vistas conmutables. Es el estado intermedio esperado del roadmap.

### D3 — Módulos ES como forma principal, con fallback a scripts clásicos con IIFE decidido por verificación

**Decisión**: la implementación **arranca** con módulos ES (`<script type="module" src="js/app.js">` en
`index.html`, `import`/`export` explícitos en cada archivo), tal como fija el scope de C-01, DD-12 y
`knowledge-base/08_arquitectura_propuesta.md §Patrones aplicados`. La **tarea de verificación** abre el
proyecto con doble clic en Chrome y Firefox y comprueba la consola: si el navegador bloquea la carga de módulos
ES bajo `file://` por CORS, se aplica el **fallback de scripts clásicos con IIFE**, que ya está contemplado en
`knowledge-base/02_descripcion_general.md §Stack tecnológico` y en el scope de C-01.

**Por qué una decisión con condición y no una decisión cerrada**: el comportamiento de los módulos ES bajo
`file://` no es uniforme entre navegadores —Chrome y Firefox ≥ 68 tratan el documento `file://` como origen
opaco (`null`) y rechazan la carga de scripts de tipo módulo como origen cruzado—, y la consigna exige que la
entrega funcione **con doble clic**, sin servidor. La verificación empírica del propio change decide cuál de
las dos variantes queda como implementativa; el roadmap ya anticipation este exact punto de bifurcación.

**Forma concreta del fallback (diseñada por adelantado para que aplicarlo no exija replanificar)**:

- Cada archivo se envuelve en una IIFE y publica su módulo en **un único namespace**:
  `window.Libreria = window.Libreria || {}`, con `Libreria.datos`, `Libreria.storage`, `Libreria.validaciones`,
  `Libreria.ui`, `Libreria.vistas.catalogo`, etc. No se crea ninguna otra variable global.
- `index.html` carga los scripts clásicos en **orden de dependencia** (`storage` → `datos` → `validaciones` →
  `ui` → vistas → `app.js`) y `app.js` es el último, que dispara el arranque.
- El **contrato público de cada módulo no cambia** entre variantes: los mismos nombres de función, con la
  misma firma. La diferencia es únicamente el mecanismo de enlace (`import`/`export` frente a una propiedad del
  namespace). Por eso C-04 a C-13 se escriben contra el contrato, no contra el mecanismo, y el cambio de
  variante es mecánico.
- El estado de negocio **no** vive en el namespace: sigue siendo responsabilidad exclusiva de `js/datos.js`
  (store), conforme a la regla dura "nunca dejar estado global mutable".

**Alternativas consideradas**: (a) servir siempre con `python -m http.server` — contradice el requisito de
doble clic (RN-ENT-01); (b) incrustar el código en `<script>` en línea — rompe la separación entre estructura y
comportamiento (RN-ACC-03) y la regla de no scripts en línea; (c) un único `app.js` monolítico con módulos ES
— contradice DD-12 y la rúbrica de "funciones acotadas".

**Trade-off**: la verificación de navegador es una tarea obligatoria de este change (no opcional) y su resultado
determina si la entrega usa `<script type="module">` o `<script src>` clásico. Es un costo de un día de trabajo,
a cambio de una garantía dura: **la entrega abre con doble clic**.

### D4 — Los módulos se crean con contrato declarado y sin lógica; el seed NO está en C-01

**Decisión**: `js/app.js`, `js/datos.js`, `js/storage.js`, `js/validaciones.js`, `js/ui.js` y los cinco módulos
de `js/vistas/` se crean **vacíos de lógica de negocio**, pero con:

1. su **responsabilidad declarada** en el encabezado del archivo;
2. su **contrato público completo**, con los mismos nombres de función que usan los changes posteriores, extraídos
   de `CHANGES.md` (C-04 a C-08) y de `knowledge-base/05_reglas_de_negocio.md`:
   - `app.js` → `iniciar()`, `montarVista()`;
   - `datos.js` → `listarLibros()`, `listarClientes()`, `listarVentas()`, `obtenerLibro()`, `obtenerCliente()`,
     `agregarLibro()`, `agregarCliente()`, `agregarVenta()`, `suscribir()`;
   - `storage.js` → `leerTodo()`, `hidratar()`, `guardarLibros()`, `guardarClientes()`, `guardarVentas()`;
   - `validaciones.js` → `validarLibro()`, `validarCliente()`, `validarVenta()`, `normalizarIsbn()`,
     `normalizarEmail()`, `calcularSubtotal()`, `calcularTotal()`;
   - `ui.js` → `crearElemento()`, `crearTabla()`, `mostrarMensaje()`, `mostrarErrores()`, `moverFoco()`,
     `enfocarPrimerError()`, `formatearMonto()`, `formatearFecha()`, `normalizarTitulo()`, `esVacio()`;
   - `js/vistas/*.js` → `render(contenedor)` por vista.
3. cuerpos **neutros y sin efectos** (devuelven `[]`, `null` o `document.createDocumentFragment()` vacío) y un
   comentario que indica el change que implementa esa función.

**Por qué el seed NO entra en C-01**: el seed de datos (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes)
es de **C-04** (`js/datos.js`) y su escritura condicional en `localStorage` es de **C-07** (`js/storage.js`).
Incluirlo ahora obligaría a C-04/C-07 a **deshacer** lo hecho, y expone al riesgo de "re-sembrar en cada
arranque" (RN-PER-02), que es la regla que hace concluyente el caso manual nº 6. C-01 tampoco **accede** a
`localStorage`: `js/storage.js` nace sin tocar el almacenamiento, de modo que no exista todavía ninguna ruta de
escritura que pueda violar la siembra condicional.

**Por qué no un archivo vacío**: un módulo sin contrato obliga a que C-04 a C-13 redisenñen las interfaces al
mismo tiempo que escriben la lógica, y multiplica los conflictos entre los changes paralelos del GATE 1. Con el
contrato fijado acá, C-04, C-05 y C-07 pueden escribirse **en paralelo sin pisarse**.

**Consecuencia asumida**: hasta que C-04 a C-13 completen los cuerpos, la aplicación no muestra datos ni
persiste nada. Es el estado intermedio esperado; el `README.md` de C-14 documenta lo implementado y lo
pendiente.

### D5 — Separación del CSS en tres hojas por responsabilidad, con tokens desde el primer archivo

**Decisión**: `css/base.css` (reset, tokens en `:root`, tipografía del sistema, layout y ancho máximo del
contenedor), `css/componentes.css` (tarjetas, formularios, botones, tablas, badges, mensajes) y `css/vistas.css`
(grillas y detalles por vista), enlazados con `<link rel="stylesheet">` desde `index.html`.

**Por qué**: RN-ACC-03 exige identidad visual coherente con CSS en archivos externos y clases reutilizadas;
DD-12 separa por responsabilidad; y la separación hace que **C-03** (identidad visual) y los changes de vista
(C-08, C-09, C-10, C-11, C-12) trabajen en archivos distintos sin conflictos, que es la condición para que el
GATE 1 y los gates posteriores puedan ir en paralelo.

**Por qué los tokens ya en C-01**: la regla dura "nunca escribir hex sueltos en componentes → tokens semánticos
en `:root`" es más barata de cumplir desde el inicio que de "despachar" después: C-01 declara el conjunto
mínimo de tokens (fondo, superficie, texto, texto suave, acento, borde, foco; tipografía del sistema; escala de
espaciado en base 0.25rem; radios; ancho máximo del contenedor) y las dos hojas restantes solo consumen
`var(--…)`. La paleta y la identidad definitivas las completa C-03 sin romper el contrato.

**Trade-off**: `base.css` y `componentes.css` nacen con un conjunto de reglas mínimo y funcional; C-03 los
expande. No es "CSS terminado" en C-01, y no pretende serlo: la identidad visual es de C-03.

### D6 — Un `<h1>` por vista; el encabezado de la aplicación no lleva `<h1>`

**Decisión**: cada `<section>` de vista lleva **exactamente un `<h1>`** con el nombre de la vista ("Catálogo",
"Libros", "Clientes", "Ventas", "Historial"); el `<header>` presenta la identidad de la librería como texto
(`<p>` con `<strong>`), **sin** `<h1>`.

**Por qué**: la regla dura del proyecto exige "un solo `<h1>` por vista" y "sin saltar niveles de encabezado".
Con cinco vistas en un mismo documento, el patrón correcto es un `h1` por vista y el encabezado de la
aplicación como texto de marca: evita tener un `h1` de la marca competido con cinco `h1` de contenido y evita
saltar a `h2` para nombrar cada vista.

**Consecuencia**: el `h1` de cada vista es también el destino natural del foco al navegar, que es exactamente
lo que C-02 implementa.

### D7 — `assets/img/` se crea aunque quede vacía, con marcador para git

**Decisión**: se crea `assets/img/` con un archivo marcador (`.gitkeep`), porque DD-11 y el formato de entrega
exigen una carpeta de recursos locales aunque no se usen imágenes de terceros (la identidad se resuelve con CSS
y, si hace falta, SVG inline con `aria-hidden="true"`).

**Por qué el marcador**: git no versiona directorios vacíos; sin `.gitkeep`, la carpeta desaparecería del
repositorio y de la entrega.

### D8 — `README.md` se crea vacío en C-01

**Decisión**: se crea `README.md` en la raíz **sin contenido**, porque RN-ENT-01 exige que la entrega incluya un
`README.md` y porque el contenido obligatorio (RN-ENT-02) se redacta en **C-14**, donde ya se conoce lo
implementado.

**Por qué no un README provisional**: un README con texto provisional es documentación que hay que corregir y
que puede quedar desincronizada. Un archivo vacío es honesto y no inventa información.

**Trade-off**: en el estado intermedio el `README.md` no cumple RN-ENT-02. C-14 está en el camino crítico
(`C-01 → … → C-13 → C-14 → C-15`), así que la entrega final sí lo cumple.

### D9 — `capability-path` elegido: `estructura-navegacion`

**Decisión**: la capacidad nueva es `estructura-navegacion` (spec en
`specs/estructura-navegacion/spec.md`).

**Por qué**: la capacidad que C-01 introduce tiene **dos** caras inseparables —el esqueleto (punto de entrada
único, secciones, carpetas, módulos, CSS) y **su navegación** (los cinco hashes que estructuran las cinco
vistas)—. Un solo nombre que las cubre evita crear dos capacidades casi gemelas (`app-shell` + `navegacion`),
que es justo lo que la guía de capabilities desaconseja.

**Por qué no `app-shell`**: "shell" sugiere el contenedor de la interfaz (chrome, layout) y deja fuera la
navegación, que en este proyecto es parte inseparable del esqueleto: sin los `href` de las cinco rutas, las
cinco `<section>` no son alcanzables y el documento no cumple RN-ACC-01. C-02 ampliará **esta misma**
capacidad con el comportamiento del router (`aria-current`, foco, regiones de mensajes) en lugar de abrir una
capacidad nueva.

**Convención de la organización**: `openspec/specs/` está vacío, así que no hay jerarquía previa que respetar.
Se adopta **plano** (una carpeta por capacidad, sin niveles adicionales), coherente con un proyecto de un solo módulo
funcional, y el nombre sigue el patrón `kebab-case` de dominio-rasgo.

### D10 — La carpeta `.opencode/` (y `.atl/`) no forma parte de la entrega funcional

**Decisión**: el proyecto incluye `.opencode/` (skills del workflow OPSX, con su propio `package.json` y
`node_modules/` para el tooling del agente) y `.atl/` (registro de skills). Ambos están fuera de la **entrega
funcional** y no se tocan en C-01.

**Por qué**: la regla dura de "cero `package.json` / `node_modules`" aplica al **proyecto de la aplicación**;
`openspec/specs/` y `knowledge-base/` ya son material de trabajo, y
`knowledge-base/08_arquitectura_propuesta.md §Estructura de directorios` establece que la evaluación se centra
en `index.html`, `css/`, `js/`, `assets/` y `README.md`.

**Riesgo que esto crea**: si el docente recibe la carpeta completa, verá un `package.json` dentro de `.opencode/`.
Mitigación: `.gitignore` ya excluye `node_modules/`, `package.json` y `package-lock.json` del versionado, y
**C-14** documenta en el `README.md` la estructura entregada y delimita qué carpetas son andamiaje del proceso.

## Risks / Trade-offs

- **[Los módulos ES pueden quedar bloqueados por CORS bajo `file://` en Chrome y Firefox]** → el fallback de
  scripts clásicos con IIFE está **diseñado por adelantado** (D3) y la tarea de verificación en navegador es
  obligatoria en este change, no opcional. El contrato público no cambia entre variantes, así que la decisión no
  bloquea C-04 a C-13.
- **[El estado intermedio de la app no muestra datos ni persiste nada]** → es intencional (D4): el seed es de
  C-04 y la persistencia de C-07. Cada change declara en su alcance qué aporta, y el `README.md` de C-14
  registra lo implementado y lo pendiente.
- **[C-01 y C-02 tocan ambos `index.html` y `js/app.js`]** → la frontera está fijada por D2: C-01 escribe la
  estructura (secciones, enlaces, `h1`, `script` de entrada); C-02 escribe el comportamiento del router y el
  contenido interno de las vistas. C-02 se ejecuta después de C-01 (GATE 1), sin paralelismo entre ambos.
- **[`css/base.css` y `css/componentes.css` quedan "a medio camino" hasta C-03]** → mitigado por D5: el
  contrato de tokens y de clases reutilizables queda fijado acá, y C-03 amplía en vez de rediseñar.
- **[La carpeta `.opencode/` con `node_modules` dentro del repositorio puede leerse como una violación de
  "cero dependencias"]** → mitigado por D10: es tooling del proceso de desarrollo, ya fuera del versionado por
  `.gitignore`, y C-14 delimita en el `README.md` la estructura de entrega funcional.
- **[El `README.md` vacío no cumple RN-ENT-02 en el estado intermedio]** → C-14 está en el camino crítico y lo
  completa antes de C-15 y de la entrega (D8).
- **[Los contratos públicos de los módulos se fijan antes de existir]** → riesgo bajo: los nombres salen de
  `CHANGES.md` (C-04 a C-08), que es el documento que gobierna la implementación posterior; si un change
  posterior necesita cambiar un nombre, se hace en ese change y no en C-01.

## Migration Plan

No aplica: no hay despliegue, ni base de datos, ni datos persistidos, ni usuarios. La "migración" es la
creación de archivos nuevos en una carpeta que no tenía aplicación.

**Rollback**: eliminar `index.html`, `README.md`, `css/`, `js/` y `assets/` — no hay estado que deshacer. Como
C-01 es el primero de la cadena, no hay ningún change previo que dependa de estos archivos.

## Open Questions

Ninguna que bloquee la implementación ni que deba responderse antes de empezar. Las decisiones que la consigna
deja abiertas están asignadas a otros changes y **no** cambian el diseño de C-01:

- `P-01` (formato de identificadores), `P-02` (claves de `localStorage`), `P-03` (formato de importes) y `P-04`
  (momento de congelamiento del precio unitario) se resuelven en **C-04, C-06 y C-07** con los defaults ya
  documentados. C-01 no define ids, claves ni importes.
- La variante definitiva de enlace de módulos (ES vs. IIFE) la decide la **verificación en navegador** dentro de
  este mismo change; no requiere decisión del usuario ni altera los specs. **Resuelta**: ver la sección siguiente.

---

## Resultado de la verificación en navegador

> Registro del resultado **observado** (tasks 5.1 a 5.4). No se declara aprobada ninguna variante que no se haya
> ejecutado.

### Variante adoptada: scripts clásicos con IIFE

La entrega se implementa con **scripts clásicos** (`<script src>`) y cada módulo publica su contrato en el
namespace único `window.Libreria`. **No se usan módulos ES.**

### Qué se probó y cómo

| Prueba | Resultado observado |
|---|---|
| Módulos ES bajo `file://` (variante inicial, misma topología de la entrega: `index.html` → `js/app.js` → `js/datos.js` → `js/vistas/catalogo.js` → `../ui.js`) | **BLOQUEADO.** Consola de Chrome: `Access to script at 'file:///…/app.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.` El módulo no se ejecuta. Se comprobó también en el mismo directorio y subiendo un nivel: **el bloqueo no depende de la relación entre carpetas**, alcanza con que el script sea de tipo módulo |
| Scripts clásicos con IIFE bajo `file://` (misma topología, 7 scripts en orden de dependencia) | **FUNCIONA.** El DOM refleja la ejecución y la consola queda **sin un solo mensaje** |
| Carga real de la entrega (`index.html` de este change, 10 scripts clásicos en orden de dependencia) | **FUNCIONA.** Consola: **0 mensajes y 0 excepciones**; sin error de CORS |

### Navegadores y versiones

| Navegador | Versión | Estado |
|---|---|---|
| Chrome (Windows) | **155.0.8059.85** | **Verificado**: documento cargado, 5 secciones ocultas, 5 enlaces de navegación, consola limpia, recorrido por teclado con foco visible |
| Firefox (Windows) | **137.0.1** (instalado para esta comprobación) | **Verificado**: documento cargado, 5 secciones ocultas, 5 enlaces de navegación, **sin ningún mensaje de consola procedente de la entrega**, recorrido por teclado con foco visible. Matiz de `:focus-visible` al completar el ciclo, documentado más abajo |

### Evidencia de la carga real

Verificado en **ambos** navegadores, en modo headless y sobre el `index.html` de la entrega. Chrome con el
protocolo DevTools; Firefox con Marionette (protocolo WebDriver). Los dos coinciden en todos los puntos:

- `title` = «Librería — Catálogo, clientes y ventas»; `lang="es"`; `<header>` presente con la marca «Librería» y
  **sin `<h1>`**.
- `<nav>` con **5** enlaces: `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`.
- `<main>` con **5** `<section id="vista-*">`, **5** `<h1>` en total (exactamente uno por sección, ninguno en el
  `<header>`) y las **5** secciones ocultas tanto por el atributo `hidden` como por el CSS aplicado.
- **10** elementos `<script>`, **todos** con `src` y ninguno con contenido en línea; **3** hojas de estilo
  enlazadas y **0** elementos `<style>`.
- `window.Libreria` existe y publica los **6** módulos (`storage`, `datos`, `validaciones`, `ui`, `vistas`, `app`)
  con su contrato completo, más las **5** vistas. **0** variables globales filtradas además de `window.Libreria`.
- **Consola: en Chrome, 0 mensajes y 0 excepciones. En Firefox, ningún mensaje procedente de la entrega** —la
  consola del navegador solo registra mensajes internos de Firefox—. En ninguno de los dos aparece el error de
  CORS.
- Teclado: cinco pulsaciones de `Tab` recorren los cinco enlaces de navegación en orden; en cada uno
  `:focus-visible` coincide y el indicador de foco es visible (`outline: solid 3px`).
- Los tokens de `:root` resuelven en el documento (`--color-fondo`, `--color-acento`, `--ancho-contenedor`), lo que
  confirma que las tres hojas se aplican.

#### Sobre cómo se leyó la consola en Firefox

Esta versión de Marionette no expone el comando `WebDriver:GetLog`. La consola se leyó desde el contexto
privilegiado del navegador, con `Services.console.getMessageArray()`: los únicos mensajes registrados son internos
de Firefox (carga de complementos, telemetría y la página interna de prueba gráfica) y **ninguno** procede de
`index.html` ni de los scripts de la entrega. Además, que los **10** scripts se hayan ejecutado y que el namespace
esté completo es por sí solo una prueba funcional más fuerte que la ausencia de mensajes: un script bloqueado por
CORS habría dejado su módulo ausente del namespace.

Se generó además una captura de pantalla de la página en Firefox, pero el agente no puede inspeccionar imágenes,
de modo que la evidencia de esta comprobación es la del DOM y de los estilos calculados, no la captura.

#### Hallazgo: `:focus-visible` al completar el ciclo de tabulación

Chrome mantiene el indicador de foco durante todo el ciclo. **Firefox deja de hacer coincidir `:focus-visible`
con los enlaces una vez que la secuencia de `Tab` sale del documento** (pasa por `body`): a partir de ahí los
enlaces siguientes quedan enfocados pero **sin anillo de foco visible**, hasta que el ciclo vuelve a pasar por el
navegador.

La primera pasada por los cinco enlaces —que es lo que exige la tarea— muestra foco visible en ambos navegadores,
así que **no bloquea este change**. Pero es una diferencia real entre navegadores que afecta a la navegación por
teclado: la regla actual de `css/base.css` se apoya solo en `:focus-visible`. El arreglo natural es añadir un
respaldo con `:focus` para los enlaces de la barra de navegación. **No se modifica el CSS en C-01** (regla de no
ampliar alcance): el hallazgo queda registrado aquí y **C-02 `navegacion-hash-vistas`**, que es el change dueño de
la navegación y de la gestión de foco, debe resolverlo.

### Consecuencia para el resto del roadmap

El contrato público de cada módulo es idéntico en las dos variantes (los mismos nombres y firmas), por lo que
**C-04 a C-13 se escriben contra ese contrato y no contra el mecanismo de enlace**. El mecanismo queda fijo en
scripts clásicos; si en el futuro se quisiera volver a módulos ES, el cambio es mecánico y no altera los
consumidores. C-02 implementará el router y el arranque, que hoy no se ejecutan al cargar la página, y es también
el change que debe recoger el hallazgo de `:focus-visible` descrito arriba.

