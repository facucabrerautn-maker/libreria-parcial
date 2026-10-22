# Descripción General

> **Fuente**: `docs/consigna-extraida.txt` — secciones "Contexto y alcance", "Alcance de la evaluación" y ejercicios 1 a 6.
> La consigna es taxativa con el stack: *"Se utilizan únicamente HTML, CSS y JavaScript nativos. Los estilos, scripts, imágenes y demás recursos se incluyen en el proyecto. No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript."*

## Stack tecnológico

| Capa | Tecnologías | Versión mínima / nota |
|------|-------------|----------------------|
| Estructura | **HTML5** semántico (`header`, `nav`, `main`, `section`, `table`, `form`, etiquetas `label`/`for`) | HTML5 con doctype estándar; un único `index.html` como entrada |
| Presentación | **CSS3** propio en archivos externos (`css/`) | Flexbox o Grid; sin preprocesadores (Sass/Less), sin framework, sin CDN |
| Comportamiento | **JavaScript nativo (ES6+)** sin dependencias | Módulos ES (`type="module"`) o scripts clásicos con IIFE; sin bundler, sin transpilador |
| Persistencia | **Web Storage API — `localStorage`** | Clave por colección, namespace de proyecto; JSON con `JSON.parse` / `JSON.stringify` |
| Assets | **Recursos locales** en `assets/` (imágenes locales o SVG inline) | Sin fuentes remotas, sin Google Fonts, sin CDN de imágenes |
| Build / tooling | **Ninguno** | Entrega sin dependencias instaladas ni herramientas de compilación, tal como exige el formato de entrega |
| Backend / API / BD | **Ninguno** | El estado vive exclusivamente en el navegador |

### Restricciones duras del stack

1. **Cero dependencias de terceros.** Ni librerías, ni frameworks, ni CDNs de CSS o JavaScript. El uso de cualquiera de ellos incumple el alcance técnico y **se informa en la evaluación** (la consigna aclara que no fija penalizaciones adicionales, pero sí lo reporta).
2. **Cero infraestructura.** Sin API, base de datos, servidor ni conexión con el backend del TP del otro docente.
3. **Cero build.** No hay `package.json`, ni `node_modules`, ni paso de compilación. La entrega se abre tal cual.
4. **Cero login real.** No hay autenticación ni autorización; el sistema no distingue usuarios.
5. **Todo el HTML/CSS/JS es local.** Los recursos se incluyen en la carpeta del proyecto.

## Arquitectura general

Aplicación web **de una sola página (SPA) con enrutado por hash**, servida directamente desde el sistema de archivos (`file://`) mediante doble clic en `index.html`. Todo el estado es cliente; no existe capa de red.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        index.html (entrada única)                     │
│  <header> identidad de la librería · <nav> 5 vistas · <main> vistas  │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌──────────────────────────────────────────────┐
        │                js/app.js (bootstrap)          │
        │  · monta el seed en el primer inicio         │
        │  · resuelve la ruta del hash → vista activa   │
        │  · delega la renderización en cada módulo     │
        └──────────────────────────────────────────────┘
                                  │
     ┌───────────────┬───────────────┬────────────────┬────────────────┐
     ▼               ▼               ▼                ▼                ▼
┌─────────┐   ┌───────────┐   ┌─────────────┐   ┌────────────┐   ┌───────────┐
│catálogo │   │  libros   │   │  clientes   │   │   ventas   │   │ historial │
│ js/     │   │  js/      │   │  js/        │   │  js/       │   │ js/       │
│ vistas/ │   │  vistas/  │   │  vistas/    │   │  vistas/   │   │ vistas/   │
└────┬────┘   └─────┬─────┘   └──────┬──────┘   └─────┬──────┘   └─────┬─────┘
     │              │                │                │                │
     └──────────────┴────────────────┴────────────────┴────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
      ┌────────────────────────┐      ┌────────────────────────────┐
      │  js/validaciones.js    │      │  js/storage.js             │
      │  funciones puras de    │      │  lectura/escritura en      │
      │  validación (RN)       │      │  localStorage + seed       │
      └────────────────────────┘      └───────────┬────────────────┘
                                                   │
                                    ┌──────────────▼──────────────┐
                                    │  localStorage (origen del    │
                                    │  navegador, por perfil)     │
                                    │  libros · clientes · ventas │
                                    │  + editoriales · géneros ·  │
                                    │    autores                   │
                                    └─────────────────────────────┘
```

**Justificación de las decisiones de alto nivel:**

- **SPA con enrutado por hash sobre `file://`**: la consigna permite "varias páginas o secciones de una misma página, siempre que exista navegación clara". El enrutado por hash evita `fetch` (que el protocolo `file://` bloquea por CORS) y mantiene el proyecto en un único `index.html`, que es exactamente lo que pide el formato de entrega.
- **Estado en memoria + espejo en `localStorage`**: la consigna pide que "los listados y el historial se conecten con los datos locales" y que los datos "se conservan en `localStorage`". El store en memoria evita re-lecturas en cada render; `localStorage` es la persistencia entre sesiones.
- **Módulos de vista separados por entidad**: la consigna valora "separación entre estructura, estilos y comportamiento" y "funciones acotadas". Un módulo por vista mantiene el alcance de cada archivo pequeño y legible.
- **Render por templates del DOM (creación de elementos y `textContent`)**: la consigna exige que "los datos escritos por los usuarios se insertan como texto en el DOM", lo que descarta `innerHTML` con datos de usuario.
- **Sin capa de red ni async**: no hay `fetch`, no hay estados de carga, no hay caché de API. La única "API" es la Web Storage API.

## Integraciones externas

**Ninguna.** El proyecto no consume servicios de terceros, no realiza llamadas de red y no depende de ningún recurso remoto.

| Servicio | Propósito | Tipo |
|----------|-----------|------|
| — | — | — |

Excepciones que conviene dejar registradas porque son "integraciones" en sentido amplio, aunque no sean remotas:

| Servicio | Propósito | Tipo |
|----------|-----------|------|
| `localStorage` (Web Storage API) | Persistencia de libros, clientes, ventas y catálogos auxiliares | API del navegador, local, síncrona |
| Sistema de archivos del navegador (`file://`) | Origen de `index.html`, CSS, JS y assets | Local, sin servidor |
| Herramientas de almacenamiento del navegador (DevTools → Application/Storage) | Procedimiento guiado por el docente para la comprobación del precio histórico | Herramienta manual del evaluador |

## API REST

**No aplica.** El sistema no expone ni consume una API REST: no hay servidor, no hay endpoints, no hay `fetch`.

La única interfaz de persistencia es la Web Storage API, con esta forma de uso (detalle en [04](04_modelo_de_datos.md)):

| Recurso | Clave propuesta en `localStorage` | Contenido |
|----------|----------------------------------|-----------|
| Libros | `libreria.libros` | Array de objetos Libro |
| Clientes | `libreria.clientes` | Array de objetos Cliente |
| Ventas | `libreria.ventas` | Array de objetos Venta |
| Editoriales | `libreria.editoriales` | Array de objetos Editorial |
| Géneros | `libreria.generos` | Array de objetos Género |
| Autores | `libreria.autores` | Array de objetos Autor |

> **Nota**: la consigna solo exige persistir libros, clientes y ventas. La persistencia de editoriales, géneros y autores es una decisión de diseño nuestra (ver DD-06 en [09](09_decisiones_y_supuestos.md)) que evita tener dos fuentes de verdad para las listas de los selectores.
