# Tasks

> Change `C-01` — `estructura-base-spa`. Esqueleto del proyecto: punto de entrada único, carpetas de la
> entrega, módulos ES con contrato declarado y las tres hojas de estilo. **Cero lógica de negocio**: no hay
> seed, ni store con datos, ni validaciones, ni render de contenido, ni acceso a `localStorage`.
>
> Verificación: no hay test runner en el proyecto (prohibido por RN-ALC-01 y RN-ENT-01). Cada task indica cómo
> se comprueba a mano, con un comando de PowerShell o con la observación en el navegador.

## 1. Andamiaje de carpetas y archivos raíz

- [x] 1.1 Crear las carpetas `css/`, `js/`, `js/vistas/` y `assets/img/`, y dentro de `assets/img/` un archivo
      marcador `.gitkeep` (git no versiona directorios vacíos). Verificar con
      `Get-ChildItem -Recurse -Directory css,js,assets` que las cuatro carpetas existen y que
      `assets/img/.gitkeep` está presente.
- [x] 1.2 Crear `README.md` en la raíz **vacío** (0 bytes), sin texto provisional. Verificar con
      `(Get-Item README.md).Length -eq 0` y con `Get-Content README.md` sin salida. El contenido obligatorio lo
      redacta C-14 (RN-ENT-02).
- [x] 1.3 Confirmar que la raíz **no** contiene `package.json`, `package-lock.json`, `node_modules/` ni `dist/`
      (RN-ALC-01, RN-ENT-01). Verificar con `Get-ChildItem -Force` en la raíz: ninguno de esos cuatro elementos
      aparece. Las carpetas `.opencode/` y `.atl/` son tooling del proceso y quedan fuera de la entrega funcional
      (ver `design.md §D10`).
- [x] 1.4 Conservar sin cambios las carpetas existentes `docs/`, `knowledge-base/` y `openspec/`. Verificar con
      `Get-ChildItem -Directory` que las tres siguen presentes y con `git status` que no hay modificaciones
      dentro de ellas.

## 2. `index.html` — entrada única con las cinco vistas

- [x] 2.1 Escribir el documento con doctype estándar, `<html lang="es">`, `<meta charset="utf-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1">` y
      `<title>Librería — Catálogo, clientes y ventas</title>`. Verificar con
      `Select-String -Path index.html -Pattern 'lang="es"'` y con el título en la pestaña del navegador.
- [x] 2.2 Escribir el `<header>` con la identidad de la librería **sin `<h1>`** (nombre como texto en `<p>` con
      `<strong>`) y el `<nav>` con los cinco enlaces `<a href="#/catalogo">`, `#/libros`, `#/clientes`, `#/ventas`,
      `#/historial`, cada uno con texto visible. Verificar con `Select-String` sobre los cinco `href` y contando
      que el `<nav>` tiene exactamente cinco `<a>`.
- [x] 2.3 Escribir `<main>` con las cinco `<section id="vista-catalogo|libros|clientes|ventas|historial">`, cada
      una con el atributo `hidden` y **exactamente un `<h1>`** propio con el nombre de la vista. Verificar con
      `Select-String -Path index.html -Pattern '<section id="vista-'` (5 coincidencias), con
      `Select-String -Pattern 'hidden'` (5 coincidencias) y contando los `<h1>` (5, uno por sección, ninguno en
      el `<header>`).
- [x] 2.4 Enlazar los tres estilos con `<link rel="stylesheet" href="css/base.css">`, `css/componentes.css` y
      `css/vistas.css`, y cargar el comportamiento con los `<script src>` clásicos en **orden de dependencia**:
      `js/storage.js` → `js/datos.js` → `js/validaciones.js` → `js/ui.js` → `js/vistas/catalogo.js` →
      `js/vistas/libros.js` → `js/vistas/clientes.js` → `js/vistas/ventas.js` → `js/vistas/historial.js` →
      `js/app.js` (último). Verificar con `Select-String` sobre los tres `href` de CSS y sobre los diez `src`.
- [x] 2.5 Confirmar que `index.html` **no** tiene elementos `<style>`, ni atributos `style` con contenido de
      maquetación, ni scripts en línea con lógica de negocio (RN-ACC-03). Verificar con
      `Select-String -Path index.html -Pattern '<style|style='` → sin coincidencias, y con
      `Select-String -Path index.html -Pattern '<script'` → diez coincidencias, **todas** con atributo `src` y
      **ninguna** con contenido en línea.

## 3. Módulos ES con contrato declarado y sin lógica

> Contrato completo y rationale en `design.md §D4`. Cada módulo declara su responsabilidad en un comentario de
> encabezado y publica las funciones que los changes posteriores van a usar.
>
> **Variante de enlace ya adoptada** (decidida por verificación empírica previa a implementar; ver
> `design.md §D3` y la sección final "Resultado de la verificación en navegador"): el proyecto usa **scripts
> clásicos con IIFE**, NO módulos ES. Chrome bloquea la carga de módulos ES bajo `file://` con un error de CORS
> (origen opaco `null`) y la consigna exige que la entrega abra con doble clic. Cada módulo se envuelve en una
> IIFE y publica su contrato en el namespace único `window.Libreria` (`Libreria.datos`, `Libreria.storage`,
> `Libreria.validaciones`, `Libreria.ui`, `Libreria.vistas.catalogo`, …), **sin ninguna otra variable global** y
> **sin estado de negocio** en el namespace. No uses `export` ni `import`.
>
> **Restricción de redacción**: las verificaciones 3.3 y 3.8 buscan el identificador literal `localStorage` con
> `Select-String` y exigen cero coincidencias. En los comentarios de encabezado describí el almacenamiento como
> «almacenamiento local del navegador (Web Storage API)» y nunca escribas ese identificador literal.

- [x] 3.1 Crear `js/app.js` con la responsabilidad "bootstrap, siembra, resolución de ruta por hash y montaje de
      la vista activa", publicando `iniciar()` y `montarVista()`; cuerpos neutros sin efectos y comentario
      indicando que el comportamiento llega en C-02 y C-07. Verificar que el módulo publica en el namespace lo
      declarado y que su cuerpo no ejecuta acciones al cargarse.
- [x] 3.2 Crear `js/datos.js` con la responsabilidad "estado en memoria (store) y operaciones de dominio",
      publicando `listarLibros()`, `listarClientes()`, `listarVentas()`, `obtenerLibro()`, `obtenerCliente()`,
      `agregarLibro()`, `agregarCliente()`, `agregarVenta()` y `suscribir()`. **Sin seed, sin entidades y sin datos
      hardcodeados** (el seed es de C-04). Verificar con `Select-String -Path js\datos.js -Pattern 'LIB-|CLI-|VEN-'`
      → sin coincidencias.
- [x] 3.3 Crear `js/storage.js` con la responsabilidad "lectura y escritura en `localStorage` con siembra
      condicional", publicando `leerTodo()`, `hidratar()`, `guardarLibros()`, `guardarClientes()` y
      `guardarVentas()`. **El módulo no debe acceder al almacenamiento todavía**: bodies neutros. Verificar con
      `Select-String -Path js\storage.js -Pattern 'localStorage'` → sin coincidencias.
- [x] 3.4 Crear `js/validaciones.js` con la responsabilidad "funciones puras de validación", publicando
      `validarLibro()`, `validarCliente()`, `validarVenta()`, `normalizarIsbn()`, `normalizarEmail()`,
      `calcularSubtotal()` y `calcularTotal()`. `normalizarIsbn()` y `normalizarEmail()` quedan **explícitas y
      separadas** desde ya (DD-05, IN-04). Verificar que no hay una función de normalización compartida y que
      ningún cuerpo toca el DOM (sin `document`).
- [x] 3.5 Crear `js/ui.js` con la responsabilidad "helpers de DOM: creación de elementos, texto seguro, mensajes,
      foco y formato", publicando `crearElemento()`, `crearTabla()`, `mostrarMensaje()`, `mostrarErrores()`,
      `moverFoco()`, `enfocarPrimerError()`, `formatearMonto()`, `formatearFecha()`, `normalizarTitulo()` y
      `esVacio()`. Verificar que el módulo declara las diez funciones y que ninguna inserta contenido con
      `innerHTML` (RN-DAT-05): `Select-String -Path js\ui.js -Pattern 'innerHTML'` → sin coincidencias.
- [x] 3.6 Crear `js/vistas/catalogo.js`, `js/vistas/libros.js`, `js/vistas/clientes.js`, `js/vistas/ventas.js` y
      `js/vistas/historial.js`, cada uno con su responsabilidad declarada y publicando `render(contenedor)` con
      cuerpo neutro que devuelve un fragmento vacío. Verificar que los cinco archivos existen, exportan `render`
      y que ninguno contiene plantillas de contenido de negocio.
- [x] 3.7 Verificar la **regla de una responsabilidad por módulo** y el **límite de tamaño**: ningún módulo
      implementa dos de las responsabilidades declaradas y ninguno supera las 200 líneas. Verificar con
      `Get-ChildItem js -Recurse -Filter *.js | ForEach-Object { "{0}: {1} líneas" -f $_.Name, (Get-Content $_.FullName).Count }`.
- [x] 3.8 Verificar que **no hay lógica de negocio adelantada** en los módulos: nada de seed, entidades, render de
      catálogo, formularios, venta ni escritura en `localStorage`. Verificar con
      `Select-String -Path js\*.js,js\vistas\*.js -Pattern 'localStorage|fetch\(|innerHTML'` → sin coincidencias.

## 4. Hojas de estilo separadas por responsabilidad

- [x] 4.1 Crear `css/base.css` con: reset mínimo, `box-sizing: border-box` global, **tokens semánticos en
      `:root`** (fondo, superficie, texto, texto suave, acento, borde, foco; familia y escala tipográfica del
      sistema; escala de espaciado en base 0.25rem; radios; ancho máximo del contenedor), reglas base de
      tipografía y layout con Flexbox/Grid, `minmax(0, 1fr)` donde aplique y ancho máximo del contenedor
      ≤ 1280 px. Verificar con `Select-String -Path css\base.css -Pattern ':root'` y con
      `Select-String -Path css\base.css -Pattern 'var\(--'` en las dos hojas restantes.
- [x] 4.2 Crear `css/componentes.css` con las clases reutilizables de tarjeta, formulario (`input`, `select`,
      campo de error), botón (variantes primaria y secundaria), tabla, badge, mensaje de resultado, mensaje de
      error y badge «Sin clasificar», **todas consumiendo `var(--…)`**. Verificar con
      `Select-String -Path css\componentes.css -Pattern '#[0-9a-fA-F]{3,6}'` → sin coincidencias (no hay hex
      sueltos fuera de `:root`).
- [x] 4.3 Crear `css/vistas.css` con los contenedores de detalle por vista (grilla de catálogo, formularios y
      listados, panel de resumen, tabla de renglones e historial), listos para recibir los módulos de vista, con
      contenedores de tabla en `overflow-x: auto` (RN-ACC-04). Verificar con
      `Select-String -Path css\vistas.css -Pattern 'overflow-x'` y con la comprobación de hex de 4.2 sobre este
      archivo.
- [x] 4.4 Verificar las **reglas duras de layout**: sin `position: absolute` usado como mecanismo de maquetación,
      sin anchos fijos de layout en `px` (salvo el `max-width` del contenedor y medidas de control), sin
      `url(http…)` ni `@import` de recursos remotos en las tres hojas. Verificar con `Select-String` sobre
      `css\*.css` con los patrones `position:\s*absolute`, `url\(\s*['"]?http` e `@import`.

## 5. Verificación de apertura por doble clic sobre `file://` (Chrome y Firefox)

> Es la comprobación que confirma la variante de enlace ya adoptada: ver `design.md §D3`. Es obligatoria, no
> opcional: la entrega tiene que abrir con doble clic (RN-ENT-01).
>
> **La variante de scripts clásicos con IIFE ya está aplicada** en los archivos de `js/` y en `index.html`: la
> verificación en navegador se hace **contra los archivos reales de la entrega**, no contra una maqueta. Una
> verificación previa (ya registrada en `design.md`) mostró que Chrome bloquea los módulos ES bajo `file://` con
> un error de CORS, por eso el proyecto se entrega con scripts clásicos.

- [x] 5.1 Abrir `index.html` con doble clic en **Chrome**, abrir la consola (F12) y comprobar que el documento
      carga el script de entrada, que las cinco secciones y la barra de navegación están presentes y que **no
      hay error de CORS** (`Access to script … from origin 'null' has been blocked by CORS policy`). Anotar el
      resultado observado.
- [x] 5.2 Repetir la comprobación 5.1 en **Firefox**, con la consola de Web y el mismo criterio. **Si Firefox no
      está instalado en la máquina, NO lo declares verificado**: anotá la limitación explícitamente (navegador no
      disponible) y dejá el punto marcado como no verificado.

      > **VERIFICADO en Firefox 137.0.1** (navegador instalado para esta comprobación). Carga real sobre el
      > `file:///` de la entrega, en modo headless con Marionette (protocolo WebDriver). Resultado: el documento
      > **carga**, con las **5** secciones y los **5** enlaces de navegación presentes; **no hay ningún mensaje de
      > consola procedente de la entrega** — en particular, **no aparece** el error de CORS
      > (`Access to script … from origin 'null' has been blocked by CORS policy`); `window.Libreria` queda
      > publicado con los **6** módulos y las **5** vistas, con **0** variables globales filtradas; las **5**
      > secciones quedan ocultas por atributo `hidden` y por CSS; y el recorrido por teclado alcanza los cinco
      > enlaces con foco visible (`outline: solid 3px`).
      >
      > **Matiz observado (no bloquea este change):** en Firefox, cuando la secuencia de `Tab` sale del documento
      > (pasa por `body`), los enlaces siguientes dejan de coincidir con `:focus-visible` y pierden el anillo de
      > foco; en Chrome el indicador se mantiene durante todo el ciclo. La primera pasada por los cinco enlaces
      > —que es la comprobación de la tarea— muestra foco visible en ambos navegadores. Queda registrado como
      > hallazgo para C-02, que es el change dueño de la navegación y de la gestión de foco; **no se modifica el
      > CSS en C-01** (regla de no ampliar alcance).
      >
      > Se guardó además una captura de pantalla de la página, pero el agente no puede inspeccionar imágenes, así
      > que la evidencia de esta comprobación es la del DOM y los estilos calculados, no la captura.
- [x] 5.3 Confirmar que la variante entregada es la de **scripts clásicos con IIFE**: cada archivo de `js/` está
      envuelto en una IIFE, publica su contrato en el namespace único `window.Libreria` (`Libreria.datos`,
      `Libreria.storage`, `Libreria.validaciones`, `Libreria.ui`, `Libreria.vistas.catalogo`, …), **no existe
      ninguna otra variable global** y **no hay estado de negocio en el namespace**; `index.html` carga los
      `<script src>` clásicos en orden de dependencia (`storage` → `datos` → `validaciones` → `ui` → vistas →
      `app.js`). Verificar que los nombres y las firmas de las funciones publicadas **no cambian** y que el
      documento sigue cargando sin errores.
- [x] 5.4 Registrar el resultado observado en `design.md`, en una sección final "Resultado de la verificación en
      navegador", indicando qué variante quedó como implementativa, los navegadores y las versiones probados, y
      la evidencia (mensaje de consola o ausencia de él). No declarar como aprobada ninguna variante que no se
      haya ejecutado.

## 6. Verificación integral de alcance

- [x] 6.1 Confirmar la **ausencia total de recursos remotos**: `Select-String -Path index.html,css\*.css,js\*.js,js\vistas\*.js
      -Pattern 'https?://|//cdn|fonts\.'` → sin coincidencias (RN-ALC-01).
- [x] 6.2 Confirmar la **ausencia de dependencias y de paso de build** en la raíz de la entrega y la **ausencia de
      red en el código**: sin `package.json`, `package-lock.json`, `node_modules/`, `dist/` en la raíz; y sin
      `fetch(`/`XMLHttpRequest`/`import` de paquetes externos en `js/`. Verificar con `Get-ChildItem -Force` en la
      raíz y con `Select-String -Path js\*.js,js\vistas\*.js -Pattern 'fetch\(|XMLHttpRequest|https?://'`.
- [x] 6.3 Confirmar la **integridad del esqueleto en el navegador**: con el proyecto abierto por doble clic, el
      documento muestra el encabezado con la identidad, la barra de navegación con los cinco enlaces y el `<main>`
      con las cinco secciones (todas ocultas hasta que C-02 implemente el router); la consola está **limpia, sin
      errores ni advertencias**, y la navegación por teclado recorre los cinco enlaces con foco visible.
- [x] 6.4 Confirmar que `git status` muestra **únicamente** los archivos nuevos de este change
      (`index.html`, `README.md`, `css/`, `js/`, `assets/`) y que ninguno de los archivos de `docs/`,
      `knowledge-base/` u `openspec/` fue modificado por la implementación.

## Workflow follow-up

- Marcar `[x]` la entrada de C-01 en `CHANGES.md` una vez archivado el change.
- Archivar el change con `/opsx:archive estructura-base-spa`; el spec de `estructura-navegacion` se copia a
  `openspec/specs/estructura-navegacion/spec.md`.
- Recordar el paso siguiente del roadmap: **C-02 `navegacion-hash-vistas`** (depende de C-01) completa el
  Ejercicio 1 con el router por hash, `aria-current="page"`, gestión de foco y las regiones de mensajes.

---

## Registro de las verificaciones ejecutadas

> Resultado **observado** de cada punto marcado. Ningún punto se da por aprobado sin haber ejecutado la
> comprobación. El detalle de la verificación en navegador está en `design.md`, sección final "Resultado de la
> verificación en navegador".

### 5.1 - Carga real en Chrome sobre `file:///`

Chrome **155.0.8059.85**, en modo headless con el protocolo DevTools sobre el `index.html` real de la entrega
(equivalente observacional de abrir con doble clic y mirar la consola).

| Comprobación | Observado |
|---|---|
| Documento carga | Sí - `<title>` "Librería — Catálogo, clientes y ventas", `lang="es"` |
| Encabezado con identidad | Sí - `<header>` con la marca "Librería" y **sin** `<h1>` |
| Barra de navegación | Sí - `<nav>` con **5** enlaces: `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial` |
| Secciones | Sí - `<main>` con **5** `<section id="vista-*">`, **5** `<h1>` (uno por sección) |
| Errores de CORS | **Ninguno** - consola con **0 mensajes y 0 excepciones** |
| Scripts | **10** `<script>`, todos con `src`, ninguno en línea |

### 5.3 - Variante de scripts clásicos con IIFE

| Comprobación | Observado |
|---|---|
| `window.Libreria` | Existe (tipo `object`) y publica `storage`, `datos`, `validaciones`, `ui`, `vistas`, `app` |
| Vistas | `catalogo`, `libros`, `clientes`, `ventas`, `historial` |
| Firmas publicadas | Coinciden con las declaradas en `design.md` §D4 (verificado en ejecución) |
| Otras variables globales | **0** - filtradas `datos`, `storage`, `validaciones`, `ui`, `app`, `vistas`, `catalogo`, `libros`, `clientes`, `ventas`, `historial`: ninguna definida |
| Estado de negocio en el namespace | No - el namespace solo expone contratos de funciones |
| Orden de carga en `index.html` | `storage` → `datos` → `validaciones` → `ui` → vistas → `app.js` |

### 6.1 - Recursos remotos

`Select-String -Path index.html,css\*.css,js\*.js,js\vistas\*.js -Pattern 'https?://|//cdn|fonts\.'`
→ **0 coincidencias**.

### 6.2 - Dependencias, build y red

Raíz de la entrega: **sin** `package.json`, **sin** `package-lock.json`, **sin** `node_modules/`, **sin** `dist/`.
`Select-String -Path js\*.js,js\vistas\*.js -Pattern 'fetch\(|XMLHttpRequest|https?://'` → **0 coincidencias**.

### 6.3 - Integridad del esqueleto en el navegador

Las **5** secciones están ocultas por el atributo `hidden` **y** por el CSS aplicado (`display: none`).
Consola: **0 mensajes, 0 excepciones**.
Teclado: cinco pulsaciones de `Tab` recorren los cinco enlaces de navegación en orden; en cada uno
`:focus-visible` coincide y el indicador de foco es visible (`outline: solid 3px`). Al séptimo `Tab` el foco
vuelve al inicio del documento.

### 6.4 - Alcance de los cambios

`git status --porcelain` muestra los archivos nuevos de la entrega (`index.html`, `README.md`, `css/`, `js/`,
`assets/`) junto con los documentos de la fundación (`AGENTS.md`, `CLAUDE.md`, `CHANGES.md`, `knowledge-base/`,
`docs/`, `openspec/`, `.gitignore`, `.active-orchestrator-state.json`). El repositorio todavía **no tiene ningún
commit**, así que todo figura como no rastreado; para confirmar que la implementación no alteró la documentación
se compararon las marcas de tiempo: `docs/`, `knowledge-base/` y `openspec/` conservan las de la fase de
fundación (00:55-01:37) y la implementación corrió entre 03:26 y 04:05. Solo quedaron modificados los
**artefactos del propio change** (`spec.md`, `tasks.md`, `design.md`), que es lo esperado al actualizar la
especificación a la variante adoptada y al marcar las tareas.

### 5.2 - Firefox: VERIFICADO

Firefox **137.0.1**, instalado para esta comprobación. Carga real sobre el `file:///` de la entrega, en modo
headless con Marionette (protocolo WebDriver).

| Comprobación | Observado |
|---|---|
| Documento carga | Sí - `<title>` "Librería — Catálogo, clientes y ventas", `lang="es"` |
| Encabezado con identidad | Sí - `<header>` con la marca "Librería" y **sin** `<h1>` |
| Barra de navegación | Sí - `<nav>` con **5** enlaces: `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial` |
| Secciones | Sí - `<main>` con **5** `<section id="vista-*">`, **5** `<h1>` (uno por sección) |
| Errores de CORS | **Ninguno** - la consola del navegador **no contiene ningún mensaje procedente de la entrega** |
| `window.Libreria` | Publicado con los **6** módulos y las **5** vistas, firmas idénticas a las de Chrome |
| Otras variables globales | **0** |
| Secciones ocultas | **5** por atributo `hidden` y **5** por CSS |
| CSS aplicado | **3** hojas; los tokens de `:root` resuelven (`--color-fondo`, `--color-acento`, `--ancho-contenedor`) |
| Teclado | 5 `Tab` alcanzan los cinco enlaces con `:focus-visible` y `outline: solid 3px` |

**Matiz observado:** al completar el ciclo (cuando la secuencia de `Tab` sale del documento y pasa por `body`),
Firefox deja de hacer coincidir `:focus-visible` con los enlaces siguientes y pierden el anillo de foco; Chrome
mantiene el indicador durante todo el ciclo. Hallazgo **para C-02** (dueño de la navegación y del foco); en C-01
no se modifica el CSS.

**Sobre la consola:** esta versión de Marionette no expone `WebDriver:GetLog`, así que la consola se leyó desde el
contexto privilegiado del navegador (`Services.console.getMessageArray()`). Los únicos mensajes registrados son
internos de Firefox (carga de complementos, telemetría y la página interna de prueba gráfica); **ninguno** procede
de `index.html` ni de los scripts de la entrega.

**Captura de pantalla:** se generó una de la página, pero el agente no puede inspeccionar imágenes, de modo que la
evidencia de esta comprobación es la del DOM y de los estilos calculados, no la captura.

