# Design

## Context

C-01 dejó el esqueleto navegable pero inerte: `index.html` ya declara las cinco `<section hidden>` y los cinco
enlaces `#/…`, `js/app.js` expone `iniciar()` y `montarVista(nombreVista, contenedor)` que devuelven `null`, y
cada módulo de vista expone un `render(contenedor)` que devuelve un fragmento vacío. No hay router, no hay montaje,
no hay foco y no hay marca de vista activa.

Cuatro restricciones del repositorio moldean la solución y no son negociables:

- **El contrato público está congelado.** El requisito `Organización modular del comportamiento` del spec
  principal enumera exactamente cinco módulos en `js/` (`app.js`, `datos.js`, `storage.js`, `validaciones.js`,
  `ui.js`) y cinco en `js/vistas/`, y el requisito `Contrato público independiente del mecanismo de enlace` fija
  los nombres de función acordados (`iniciar`, `montarVista`, …, `render`). C-02 no puede agregar módulos ni
  nombres de función nuevos sin romper el spec principal.
- **La aplicación se abre con doble clic.** Chrome y Firefox bloquean los módulos ES bajo `file://` por CORS
  (verificado en C-01), así que el mecanismo de enlace sigue siendo scripts clásicos con IIFE sobre
  `window.Libreria`. Además, bajo `file://` el origen es opaco y algunas APIs que asumen un origen real fallan.
- **La identidad visual es de C-03.** C-02 solo puede tocar el CSS indispensable para el estado activo del nav y
  para el foco visible de sus enlaces; la paleta, la tipografía final y la adaptabilidad a 320 px / 1280 px no son
  de este change.
- **No hay lógica de negocio.** C-02 no siembra datos, no escribe ni lee `localStorage` y no valida ni persiste
  nada: eso es de C-04, C-06 y C-07.

La especificación de este change vive en `specs/estructura-navegacion/spec.md`; este documento explica **cómo** se
implementa, no **qué** se implementa.

## Goals / Non-Goals

**Goals:**

- Resolver la ruta activa desde `location.hash` y montar exactamente una vista, con un comportamiento
  determinista para hash vacío, raíz y hash desconocido.
- Dejar el ciclo de vida de la vista explícito: lo que se monta, lo que se desmonta y qué pasa con las escuchas.
- Mover el foco de forma predecible y visible al cambiar de vista, en Chrome y en Firefox.
- Marcar la vista activa en el DOM (`aria-current="page"`) y en la capa visual, sin depender solo del color.
- Declarar en el documento la estructura que los requisitos modificados exigen: `tabindex` del `<main>`,
  `aria-label` del `<nav>` y la región de mensajes de cada vista.
- Dejar los cinco módulos de vista listos para que C-04 a C-13 escriban contra el mismo contrato.

**Non-Goals:**

- Datos, seed, store, persistencia y validaciones (C-04, C-06, C-07).
- Contenido real de las vistas: el catálogo con su filtro, los formularios de alta, la venta y el historial
  (C-08 a C-12).
- Identidad visual, paleta, tipografía final y adaptabilidad (C-03).
- Un módulo de router nuevo, un contrato `destruir()` nuevo o cualquier otro nombre de función nuevo.
- Módulos ES, `export`/`import`, bundler, transpilador, framework, CDN, backend o red (RN-ALC-01 a RN-ALC-03).

## Decisions

### D1 — El router vive en `js/app.js`; no se crea `js/router.js`

`js/app.js` ya declara su responsabilidad como "bootstrap, resolución de ruta por hash y montaje de la vista
activa". Implementar ahí el router respeta la separación de responsabilidades sin agregar unidades de código.

- **Alternativa descartada — módulo `js/router.js`**: contradice el escenario `Módulos por responsabilidad` del
  spec principal, que enumera los cinco módulos de `js/`, y ampliaría el contrato público enumerado en
  `Contrato público independiente del mecanismo de enlace`. Un módulo nuevo obliga a tocar el spec principal en
  el mismo change, y eso es exactamente lo que C-02 no debe hacer.
- **Alternativa descartada — router en `index.html` con un `<script>` en línea**: viola la regla dura de no
  escribir lógica en línea y el requirement `Separación entre estructura, estilos y comportamiento`.

### D2 — Resolución del hash con una función pura sobre una tabla de rutas

`js/app.js` mantiene una tabla literal `RUTAS` que mapea nombre de ruta → identificador de `<section>`
(`catalogo → vista-catalogo`, …). Una función pura `resolverRuta(hash)` devuelve `{ nombre, seccion, desconocida }`
y no toca el DOM: se puede ejercitar mentalmente y no necesita estado global.

- **Alternativa descartada — `switch` con un `case` por ruta**: cinco ramas duplican la forma `{ nombre, seccion }`
  y cada ruta nueva obliga a tocar dos lugares.
- **Alternativa descartada — leer los `data-*` de los enlaces del DOM para reconstruir las rutas**: hace que el
  router dependa de la forma del marcado y del orden de los enlaces; la tabla literal es explícita y auditable.

### D3 — La URL se normaliza con `location.replace()`, no con `history.replaceState()`

Cuando la ruta resuelta no es la del hash actual (hash vacío, `#/` o ruta desconocida), el router llama
`location.replace('#/' + ruta)`. Es una navegación de fragmento: no recarga el documento y no agrega entradas al
historial, de modo que el botón "atrás" no acumula rutas inválidas.

- **Alternativa descartada — `history.replaceState()`**: bajo `file://` el origen es opaco y la llamada puede
  terminar en `SecurityError` según el navegador, lo que obligaría a envolverla en un `try/catch` y a mantener un
  camino de respaldo con dos mecanismos de navegación distintos.
- **Alternativa descartada — no normalizar la URL**: la barra de direcciones y la vista quedarían desincronizadas
  y "volver" dejaría de funcionar como espera el usuario.

### D4 — El router es idempotente: sólo monta si la ruta cambia

`js/app.js` conserva, en el cierre del IIFE, la ruta montada (`rutaActual`). Si la ruta solicitada es la misma que
la montada, `montarVista` no vuelve a renderizar. Esto resuelve el doble montaje que aparecería si `location.replace`
dispara `hashchange` después de una redirección, y evita que el foco salte dos veces.

- **Alternativa descartada — bandera `redirigiendo`**: es estado mutable adicional que hay que acertar en cada
  camino de salida; comparar la ruta actual es una sola regla y no admite estados imposibles.
- **Nota**: `rutaActual` es estado privado del módulo, no una variable global mutable: `window.Libreria` sigue
  siendo el único namespace y no expone estado de la aplicación.

### D5 — El desmontaje es el vaciado de la `<section>`; no hay contrato `destruir()`

`montarVista` vacía la sección de la vista anterior (elimina todos sus hijos), la oculta y monta la nueva. Como los
módulos de vista enganchan sus escuchas a elementos **dentro** de su propia sección, al eliminar esos nodos las
escuchas mueren con ellos: no hay escuchas duplicadas al navegar de ida y vuelta, sin necesidad de un método
`destruir()`.

- **Alternativa descartada — `destruir()` en el contrato de las vistas**: el spec principal enumera los nombres de
  función del contrato y `destruir` no está; agregarlo rompe el spec principal y obliga a que C-08 a C-13 lo
  implementen todos.
- **Consecuencia obligatoria**: un módulo de vista **no** puede enganchar escuchas a `window` ni a `document`
  (por ejemplo un `resize` global o un `keydown` de documento), porque esas escuchas sobreviven al vaciado. Los
  eventos que necesita la vista se escuchan sobre sus propios elementos.
- **Consecuencia obligatoria**: la única escucha global es `hashchange` sobre `window`, y se registra **una sola
  vez** en `iniciar()`, nunca en cada render.

### D6 — La región de mensajes se declara en `index.html`

Cada `<section>` de vista incluye en el documento `<div class="region-mensajes" role="status"
aria-live="polite"></div>`. El requirement modificado `Separación entre estructura, estilos y comportamiento`
exige que "la sección de la vista activa y su región de mensajes SHALL estar declaradas en el documento", y la
declaración estática evita que cada vista tenga que buscarla o crearla.

- **Alternativa descartada — crearla desde JS al renderizar**: contradice el requirement modificado y duplica el
  trabajo en los cinco módulos de vista.
- **Nota de a11y**: el texto se escribe con `textContent` dentro de un nodo ya presente en el DOM. Si el nodo
  apareciera en el mismo tick que su texto, el lector de pantalla no lo anunciaría; por eso la región se declara
  siempre y sólo cambia su contenido.

### D7 — El foco va al `<h1>` de la vista, con `tabindex="-1"` estático y respaldo en `<main>`

Un `<h1>` no es enfocable por defecto. Cada `<h1>` de las cinco secciones lleva `tabindex="-1"` **en el documento**
—no lo agrega el script—, de modo que sirve como destino de salto sin entrar en el orden de tabulación. Al cambiar
de vista el router enfoca ese `<h1>` con `Libreria.ui.moverFoco`, que ya existe; si la vista no expone un `<h1>`
enfocable, el foco cae en `<main tabindex="-1">`, que el requirement modificado `Estructura semántica del documento`
obliga a declarar.

- **Alternativa descartada — `tabindex="-1"` agregado por JS al renderizar**: el atributo es parte de la
  estructura semántica del documento; si el router lo agrega, la estructura deja de ser verificable leyendo
  `index.html`.
- **Consecuencia aceptada**: con navegación por teclado, el `<h1>` enfocado puede mostrar el anillo de
  `:focus-visible`. Es intencional: le indica al usuario dónde está y no altera el orden de tabulación.

### D8 — La vista activa se marca en el DOM y en la capa visual, sin depender sólo del color

El enlace de la vista activa recibe `aria-current="page"` y la clase `enlace-nav--activo`; los otros cuatro no
reciben ninguna de las dos cosas. El estilo de la clase combina fondo `--color-acento-suave`,
`font-weight: var(--peso-fuerte)` y subrayado, de modo que la diferencia es perceptible sin depender del color
(RN-ACC-05). Los colores salen de tokens de `:root`: en `css/` no se escribe ningún hexadecimal fuera de
`css/base.css`.

- **Alternativa descartada — sólo color de fondo para marcar la vista activa**: no cumple RN-ACC-05 y no sobrevive
  a la revisión de accesibilidad.
- **Alternativa descartada — `aria-current` sin clase visual**: el estado real de la vista quedaría invisible para
  quien no usa lector de pantalla.

### D9 - El foco de los enlaces del nav se queda en `:focus-visible`

La verificación de C-01 con **Firefox 137.0.1** mostró que, cuando la secuencia de tabulación sale del documento, los
enlaces de la barra de navegación dejan de coincidir con `:focus-visible` y quedan sin anillo de foco. La hipótesis de
trabajo fue que un respaldo `nav a:focus` en `css/base.css` devolvería el anillo a esos enlaces.

**La hipótesis se probó y se refutó.** Se implementó la regla y se midió en Firefox 137.0.1 con ventana de escritorio
real (no sólo headless), leyendo `document.activeElement`, `document.hasFocus()`, `matches(':focus')`,
`matches(':focus-visible')` y el `outline` computado en cada pulsación de `Tab`:

| Estado medido | `document.hasFocus()` | `:focus` | `:focus-visible` | `outline` |
|---------------|-----------------------|----------|------------------|-----------|
| `Tab` 1 a 5 (enlaces del nav) | `true` | `true` | `true` | `solid 3px` |
| `Tab` 6 (sale del contenido, `activeElement` = `BODY`) | `false` | `false` | `false` | `none` |
| `Tab` 7 y 8 (vuelve a los enlaces) | `false` | `false` | `false` | `none` |
| Minimizar y restaurar la ventana con un enlace enfocado | `true` | `true` | `true` | `solid 3px` |

En los estados de `Tab` 6 a 8 **ningún** elemento coincide con `:focus` ni con `:focus-visible`, porque el documento no
tiene el foco (`document.hasFocus()` es `false`): el foco está en el chrome del navegador, no en la página. Ninguna
regla CSS puede pintar el anillo en ese estado, así que el respaldo `nav a:focus` no aportaba nada donde se lo
necesitaba, y sí aportaba un efecto no deseado: el anillo aparecía también al hacer clic con el mouse, que es
justamente lo que `:focus-visible` evita.

- **Decisión**: no se agrega el respaldo. `css/base.css` conserva únicamente la regla global `:focus-visible`, que ya
  cubre todos los estados en los que la página tiene el foco (tabulación, restauración de la ventana y foco
  programático del router sobre el `<h1>`).
- **Alternativa descartada - `:focus` acotado a `nav a`**: refutada por la medición de la tabla; el único efecto
  observable es el anillo en el clic con mouse.
- **Alternativa descartada - aplicar `:focus` a toda la aplicación**: ruido visual en todos los controles y sin el
  beneficio buscado.
- **Limitación conocida y documentada**: con el foco en el chrome del navegador (después de tabular fuera de la
  página) la página no muestra anillo, que es el comportamiento correcto de la plataforma: el indicador visible de
  foco en ese momento es el del propio chrome.

Evidencia: `verificar_firefox_escritorio.js` y `verificar_firefox_foco_ventana.js` (harnesses fuera del repositorio);
la salida observada queda registrada en `tasks.md` (tasks 4.2 y 5.2).

### D10 — Cada vista renderiza su propio estado vacío; el router no escribe contenido de vista

Los cinco módulos de vista escriben, en el `render(contenedor)` que ya expone, su mensaje de estado inicial en la
región de mensajes de su sección y devuelven el fragmento que corresponde. No hay seed ni datos: hasta que C-04 y
C-07 carguen el store, ese mensaje es el contenido real de la vista.

- **Consecuencia**: el router no conoce los textos de las vistas ni escribe dentro de sus secciones más allá de
  vaciarlas y de delegar el render; el contenido de cada vista es responsabilidad de su módulo.
- **Consecuencia**: los textos de los estados vacíos son propios de cada vista y se pueden ajustar sin tocar el
  router ni el spec (el spec exige que sean distintos entre sí y distintos del mensaje de error y del de búsqueda
  sin resultados, no una redacción concreta).

### D11 — Se mantiene el enlace con scripts clásicos con IIFE

No hay cambio de mecanismo: `index.html` sigue enlazando los scripts en orden de dependencia con `js/app.js` al
último, y cada módulo publica su contrato en `window.Libreria`. El contrato no depende del mecanismo, así que
C-04 a C-13 se escriben contra esta misma base.

- **Alternativa descartada — migrar a módulos ES**: Chrome y Firefox bloquean los módulos ES bajo `file://` por
  CORS, y el requisito `Apertura por doble clic sin bloqueo por CORS` del spec principal obliga a que la variante
  elegida cargue sin errores en ambos navegadores.

### D12 — La tabla de rutas y los selectores del router quedan declarados en un solo lugar

`js/app.js` concentra la tabla `RUTAS` y los selectores que usa (`nav a[href]`, `#vista-…`, `.region-mensajes`).
Ninguna otra parte de la entrega depende de esos selectores, y los módulos de vista no necesitan conocer la tabla:
reciben su contenedor y trabajan dentro de él.

### D13 — El arranque lo dispara el propio `js/app.js` al final de su IIFE

Los scripts ya están enlazados al final del `<body>`, así que el DOM está parseado cuando `js/app.js` se ejecuta.
Al cerrar su IIFE, el módulo llama `window.Libreria.app.iniciar()`, que resuelve la ruta inicial, monta la vista
correspondiente y registra la única escucha global de `hashchange`.

- **Alternativa descartada — `window.onload` o `onload="…"` en el `<body>`**: es lógica en línea y lo prohíben la
  regla dura del proyecto y el requirement `Separación entre estructura, estilos y comportamiento`.
- **Alternativa descartada — un módulo `js/boot.js` de arranque**: agregaría un sexto módulo en `js/` y rompería el
  escenario `Módulos por responsabilidad` del spec principal.
- **Alternativa descartada — `defer` en los scripts y llamada explícita desde otro punto**: `defer` no aporta nada
  cuando los scripts ya están al final del `<body>`, y la llamada tendría que salir de algún lado igual.

## Risks / Trade-offs

- **[El estado vacío de las vistas puede leerse como "la aplicación está rota"]** → Cada vista muestra un mensaje
  propio que explica qué información se verá en ella; C-13 y C-14 documentan este estado intermedio del roadmap
  como esperado, y no como un fallo.
- **[`location.replace()` puede no disparar `hashchange` si el hash ya es el destino]** → El montaje inicial no
  depende del evento: `iniciar()` resuelve y monta la ruta una vez, y las navegaciones posteriores llegan por
  `hashchange`. La redirección se apoya en la idempotencia de D4, que impide un segundo montaje.
- **[La página no muestra anillo de foco mientras el foco está en el chrome del navegador]** → Ocurre sólo después de
  tabular fuera del documento; en ese momento el indicador visible es el del propio chrome. `:focus-visible` cubre
  todos los estados en los que la página tiene el foco, verificado en Chrome y Firefox (D9).
- **[El foco en el `<h1>` puede desplazar el desplazamiento vertical]** → Es el comportamiento deseado: la vista
  nueva queda encuadrada desde su propio encabezado. Al desmontar la vista anterior el documento queda en la misma
  posición vertical, porque el contenido bajo el foco es el de la vista nueva.
- **[Acoplamiento del router con la forma del documento (`#vista-…`, `nav a`, `.region-mensajes`)]** → La tabla
  `RUTAS` y los selectores viven en un único archivo; C-04 a C-13 no dependen de ellos, porque hablan con las vistas
  a través del contrato `render(contenedor)`.
- **[Los mensajes de `role="status"` se anuncian de forma asíncrona y en cola]** → Es el comportamiento correcto de
  una región `aria-live="polite"`: el aviso de ruta desconocida se anuncia sin cortar la navegación. El texto se
  escribe en un nodo ya presente, condición necesaria para que el lector de pantalla lo anuncie.
- **[Las escuchas de los módulos de vista dependen de nodos internos de la sección]** → Es una restricción
  explícita del diseño (D5) y queda cubierta por el escenario `Escuchas registradas en cada render` del delta.

## Migration Plan

No hay migración de datos ni despliegue: la entrega es estática y se abre con doble clic. C-02 no escribe nada en
`localStorage`, así que no hay estado que migrar ni que revertir.

Orden de implementación (cada paso deja la aplicación en un estado coherente):

1. `index.html`: `tabindex="-1"` en `<main>` y en los cinco `<h1>`, y la región de mensajes en cada `<section>`.
2. `js/app.js`: tabla de rutas, `resolverRuta`, `montarVista`, marcado de la vista activa, foco y escucha de
   `hashchange`.
3. `js/vistas/*.js`: estado vacío propio de cada vista.
4. `css/`: clase `enlace-nav--activo`; el foco sigue en la regla global `:focus-visible` (el respaldo `nav a:focus` se
   probó y se retiró, ver D9).
5. Verificación en navegador (Chrome y Firefox) con los harnesses externos y recorrido manual.

**Rollback**: revertir `index.html`, `js/app.js`, `js/vistas/*.js` y la regla de CSS. No hay estado que
restaurar. La reversión devuelve la aplicación al esqueleto inerte de C-01, que sigue siendo una entrega válida
(abre, muestra la navegación y las cinco secciones ocultas, sin errores de consola).

## Open Questions

- **Redacción exacta de los mensajes de estado inicial por vista.** El delta exige que sean distintos entre sí y
  distintos del mensaje de error y del de búsqueda sin resultados, pero no fija un texto literal. Se puede ajustar
  en C-04 o C-08 cuando exista el contenido real de cada vista, sin cambiar el spec, el enfoque ni el desglose de
  tareas de este change.
