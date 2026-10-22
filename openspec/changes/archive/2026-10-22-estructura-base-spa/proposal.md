# Proposal

## Why

El proyecto todavía no tiene **ningún** archivo de aplicación: la carpeta de entrega está vacía salvo la
documentación (`docs/`, `knowledge-base/`, `openspec/`, `CHANGES.md`). La consigna exige que el parcial se
entregue como una carpeta que se abre con doble clic sobre `index.html`, sin `npm install`, sin servidor y sin
paso de compilación (RN-ALC-01, RN-ENT-01), y el Ejercicio 1 (20 pts) se evalúa sobre la existencia de un punto
de entrada único con las cinco vistas navegables (US-001, US-002).

Este change es **C-01**, el único change del roadmap sin dependencias: fija el alcance técnico (cero
dependencias, cero build) y es el cimiento de los cuatro changes paralelos del GATE 1 (C-02, C-03, C-04, C-05).
Sin él, ningún otro change puede arrancar.

## What Changes

- Se crea la **entrada única** `index.html` en la raíz: doctype estándar, `lang="es"`, `<title>` "Librería —
  Catálogo, clientes y ventas", `<header>` con la identidad de la librería, `<nav>` con los cinco enlaces
  `href="#/catalogo"`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`, y `<main>` con cinco
  `<section id="vista-catalogo|libros|clientes|ventas|historial" hidden>` más el punto de anclaje
  `<script type="module" src="js/app.js">` (RN-ACC-01, RN-ACC-02).
- Se crea el **esqueleto de directorios** de la entrega: `css/`, `js/`, `js/vistas/`, `assets/img/`, `docs/`,
  `knowledge-base/`, `openspec/` (los tres últimos ya existen y se conservan), más `README.md` de entrega
  **vacío**, que se completa en C-14.
- Se crean los **módulos ES** con la responsabilidad declarada en
  `knowledge-base/07_flujos_principales.md §Componentes implicados`: `js/app.js`, `js/datos.js`, `js/storage.js`,
  `js/validaciones.js`, `js/ui.js` y `js/vistas/{catalogo,libros,clientes,ventas,historial}.js`. Los módulos
  quedan **sin lógica de negocio**: cada uno declara su contrato (exports) y su responsabilidad, y los changes
  posteriores (C-04 a C-12) los completan.
- Se crean los **tres archivos CSS** con separación de responsabilidades: `css/base.css` (reset, tokens en
  `:root`, tipografía, layout), `css/componentes.css` (tarjetas, formularios, botones, tablas, badges, mensajes) y
  `css/vistas.css` (detalles por vista). La identidad visual definitivo y la adaptabilidad a 320 px / 1280 px
  las completa C-03; C-01 deja la estructura de archivos y los tokens base.
- Se verifica la **apertura por doble clic sobre `file://`** en Chrome y Firefox. Si el navegador bloquea los
  módulos ES por CORS, se aplica la alternativa de scripts clásicos con IIFE contemplada en
  `knowledge-base/02_descripcion_general.md §Stack tecnológico`, y esa decisión queda registrada en el artefacto
  de diseño.
- **No** se implementa lógica de negocio en este change: no hay seed, ni store, ni validaciones, ni render de
  catálogo, ni formularios, ni venta, ni persistencia. Todo eso vive en C-04 a C-13.

### Fuera de alcance (explícito)

- Enrutado por hash efectivo, `aria-current`, gestión de foco y regiones de mensajes → **C-02**.
- Identidad visual completa, tokens finales y adaptabilidad verificada → **C-03**.
- Seed y store en memoria → **C-04**. Helpers de DOM → **C-05**. Validaciones → **C-06**.
  Persistencia en `localStorage` → **C-07**. Catálogo y filtro → **C-08**. Altas → **C-09 / C-10**.
  Venta → **C-11**. Historial → **C-12**. Verificación end-to-end → **C-13**. Contenido del `README.md` →
  **C-14**. Ejecución de los 8 casos manuales → **C-15**.
- Lo que exceda el scope de C-01 se registra en el `README.md` de entrega como "pendiente", no se implementa.

## Capabilities

### New Capabilities

- `estructura-navegacion`: esqueleto de la aplicación de una sola página —punto de entrada único `index.html`,
  las cinco secciones de vista con sus hashes de navegación, la estructura de módulos ES con un módulo por
  responsabilidad y la separación de CSS en tres archivos— sin dependencias externas, sin build y con apertura
  por doble clic sobre `file://`.

### Modified Capabilities

Ninguna. `openspec/specs/` está vacío: no existen capacidades previas que este change modifique.

## Impact

- **Archivos nuevos**: `index.html`, `README.md` (vacío), `css/base.css`, `css/componentes.css`,
  `css/vistas.css`, `js/app.js`, `js/datos.js`, `js/storage.js`, `js/validaciones.js`, `js/ui.js`,
  `js/vistas/catalogo.js`, `js/vistas/libros.js`, `js/vistas/clientes.js`, `js/vistas/ventas.js`,
  `js/vistas/historial.js`.
- **Carpetas nuevas**: `css/`, `js/`, `js/vistas/`, `assets/img/`.
- **Sin dependencias**: no se agregan `package.json`, `node_modules`, `package-lock.json`, `dist/`, bundler,
  transpilador, framework, librería, CDN ni fuente remota (RN-ALC-01, RN-ENT-01).
- **Sin red ni backend**: no hay API, base de datos, servidor, login ni variables de entorno (RN-ALC-02,
  RN-ALC-03). No se usa `fetch` ni ninguna API de red.
- **Sin cambios de contrato de datos**: este change no define entidades ni claves de `localStorage`; el modelo
  de datos y el esquema de claves son de C-04 y C-07 (P-01, P-02 siguen abiertos hasta esos changes).
- **Riesgo asumido**: el comportamiento de `localStorage` bajo `file://` depende del navegador; queda
  documentado en `knowledge-base/08_arquitectura_propuesta.md §Modelo de despliegue` y se registra en el
  `README.md` de entrega (C-14).
