# Librería — Parcial 1 — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnologías | Versión mínima / nota |
|------|-------------|----------------------|
| Estructura | **HTML5** semántico (`header`, `nav`, `main`, `section`, `table`, `form`, etiquetas `label`/`for`) | HTML5 con doctype estándar; un único `index.html` como entrada |
| Presentación | **CSS3** propio en archivos externos (`css/`) | Flexbox o Grid; sin preprocesadores (Sass/Less), sin framework, sin CDN |
| Comportamiento | **JavaScript nativo (ES6+)** sin dependencias | Módulos ES (`type="module"`) o scripts clásicos con IIFE; sin bundler, sin transpilador |
| Persistencia | **Web Storage API — `localStorage`** | Clave por colección, namespace de proyecto; JSON con `JSON.parse` / `JSON.stringify` |
| Assets | **Recursos locales** en `assets/` (imágenes locales o SVG inline) | Sin fuentes remotas, sin Google Fonts, sin CDN de imágenes |
| Build / tooling | **Ninguno** | Entrega sin dependencias instaladas ni herramientas de compilación, tal como exige el formato de entrega |
| Backend / API / BD | **Ninguno** | El estado vive exclusivamente en el navegador |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito y alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura general, integraciones |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores, permisos, rutas de las 5 vistas |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, seed 6/2/2/3/3, estructura en `localStorage` |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX) — **47 reglas** |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica (US-001…US-034) |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E (venta, precio histórico, recarga) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de directorios, render, seguridad |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones DD-01…DD-12 y supuestos SU-01…SU-10 |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias a resolver ANTES de codear |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` (P-01 a P-04: formato de IDs, claves de `localStorage`, formato de importes, momento de congelamiento del precio) antes de arrancar el primer change. Cada una trae un default propuesto para no bloquear la implementación.

---

## Skills Disponibles

Fuente de verdad: `.atl/skill-registry.md` (generado por `skill-registry`).

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **UI / Estructura** | HTML semántico, CSS, identidad visual, vistas | `semantic-html-first`, `frontend-ui-engineering`, `responsive-design`, `web-design-guidelines` |
| **Datos** | Modelo, seed, validaciones puras, persistencia | `vanilla-web` |
| **Interacción** | Formularios, ventas, historial | `forms`, `accessibility`, `vanilla-web` |
| **Revisión / Entrega** | WCAG 2.2 y revisión final pre-entrega | `accessibility`, `web-design-guidelines` |
| **Orquestación** | OPSX/SDD, KB, roadmap, reglas del repo | `kb-creator`, `roadmap-generator`, `agents-md-generator` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

> ⚠️ `frontend-ui-engineering` trae sus ejemplos en **React/TSX/Tailwind**: traducí los patrones, **no copies el stack**. Lo mismo con `web-design-guidelines`, que descarga sus reglas de una URL en cada revisión y tiene fallback embebido.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 15 changes en 7 fases (10 gates).
- **Camino crítico** (9): `C-01 → C-04 → C-06 → C-09 → C-11 → C-12 → C-13 → C-14 → C-15`.
- **Primer change**: `C-01` `estructura-base-spa` — el único sin dependencias; fija el alcance técnico y desbloquea los 4 changes paralelos del GATE 1.
- **Plan de 3 agentes**: A (HTML/CSS) = C-01, C-02, C-03, C-08 · B (Datos/persistencia) = C-04, C-06, C-07, C-13, C-14 · C (Interacción/verificación) = C-05, C-09, C-10, C-11, C-12, C-15.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> Reglas **globales** ya definidas en la configuración global del stack (agente `sdd-orchestrator`: orquestación OPSX, governance por dominio, Strict TDD, Engram): el proyecto las **hereda**, no se repiten acá.

Acá van: (a) las reglas específicas de este proyecto, derivadas de su stack (HTML5 + CSS3 + JavaScript nativo + `localStorage`) y **confirmadas con el usuario**; y (b) las reglas universales que el global NO cubre todavía (commit/build/co-autoría). Son contrato; romperlas es un defecto. Formato `NUNCA X → hacer Y`:

### Alcance técnico

- NUNCA agregar framework, librería, CDN ni fuente remota → CSS y JS 100% locales (RN-ALC-01).
- NUNCA crear `package.json`, `node_modules`, `package-lock.json`, `dist/` ni paso de build (RN-ALC-01, RN-ENT-01).
- NUNCA agregar backend, API, base de datos, servidor, login ni variables de entorno (RN-ALC-02, RN-ALC-03).
- NUNCA usar `fetch` ni ninguna API de red → toda la lógica es local y síncrona.

### HTML y CSS

- NUNCA usar `<div>`/`<span>` con `onclick` → `<button>`, `<a href>`, `<details>`/`<summary>`, `<dialog>`.
- NUNCA dejar un control sin `<label for>` → un solo `<h1>` por vista, `<th scope="col">` en toda tabla, sin saltar niveles de encabezado.
- NUNCA escribir hex sueltos en componentes → tokens semánticos en `:root`.
- NUNCA usar anchos fijos de layout ni `position:absolute` para maquetar → Flexbox/Grid, `minmax(0,1fr)`, `clamp()`.

### JavaScript

- NUNCA insertar datos de usuario con `innerHTML` → siempre `textContent` + `createElement`.
- NUNCA dejar estado global mutable → un store con única fuente de verdad + un `render()` por vista.
- NUNCA meter dos responsabilidades en un módulo → un módulo = una cosa; archivos de ≤ 200 líneas.
- NUNCA acceder a `localStorage` sin `try/catch` → la cuota puede agotarse y la app informa el error.
- NUNCA normalizar ISBN y email con la misma función → `normalizarIsbn()` (quita espacios y guiones) vs `normalizarEmail()` (solo espacios exteriores).

### Verificación y dominio

- NUNCA declarar un caso manual como aprobado sin ejecutarlo → el README registra el resultado **observado**.
- NUNCA re-siembra `localStorage` en cada arranque → siembra condicional a que la clave no exista.
- NUNCA releer el precio del catálogo al mostrar el historial → el renglón guarda el snapshot.
- NUNCA empezar a codear sin leer `05_reglas_de_negocio.md` (las RN) y `10_preguntas_abiertas.md`.
- NUNCA ampliar el alcance de un change → lo excedente va al README como "pendiente", no se implementa.

### Universales no cubiertas por el global

- NUNCA commitear ni pushear sin pedido explícito → mensajes en Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- NUNCA agregar `Co-Authored-By` ni atribución de IA en los commits.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.

> La verificación de este proyecto es **manual**: los 8 casos manuales de la consigna se ejecutan en el navegador y su resultado observado se registra en el `README.md` de entrega (change `C-15`). No hay test runner ni dependencias instaladas, y no debe haberlos.
