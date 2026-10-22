# Tasks

## 1. Estructura del documento (`index.html`)

- [x] 1.1 Añadir `tabindex="-1"` al `<main>` y a cada uno de los cinco `<h1>` de vista en `index.html`, de modo que el `<h1>` pueda recibir el foco y el `<main>` sirva de respaldo. Verificar: `(Select-String -Path index.html -Pattern '<main tabindex="-1">','<h1 tabindex="-1">' | Measure-Object).Count` devuelve `6` (un `<main>` y cinco `<h1>`).
  - **Salida observada:** `6`.
- [x] 1.2 Declarar dentro de cada `<section>` la región de mensajes `<div class="region-mensajes" role="status" aria-live="polite"></div>`, antes del contenido de la vista. Verificar: `(Select-String -Path index.html -Pattern 'role="status" aria-live="polite"' | Measure-Object).Count` devuelve `5`.
  - **Salida observada:** `5`. Harness Chrome/Firefox: `regionesMensajes: 5`, `regionesPorSeccion: [1,1,1,1,1]`.
- [x] 1.3 Confirmar que el documento conserva el `aria-label` del `<nav>` y que sigue sin estilos ni scripts en línea. Verificar: `Select-String -Path index.html -Pattern '<nav aria-label="Vistas principales">'` devuelve `1` coincidencia, `(Select-String -Path index.html -Pattern '<style|style=' | Measure-Object).Count` devuelve `0` y `(Select-String -Path index.html -Pattern '<script(?![^>]*\ssrc)' | Measure-Object).Count` devuelve `0`.
  - **Salida observada:** `1` / `0` / `0`. Harness: `scripts: 10`, `scriptsSinSrc: 0`, `styleInline: 0`, `styles: 3`.

## 2. Router por hash, ciclo de vida y foco (`js/app.js`)

- [x] 2.1 Implementar en `js/app.js` la tabla literal `RUTAS` (nombre de ruta → identificador de `<section>`) y la función pura `resolverRuta(hash)` que devuelve `{ nombre, seccion, desconocida }` sin leer `location` ni el DOM. Verificar: `(Get-Content js/app.js | Measure-Object -Line).Count` devuelve un valor menor o igual que `200` y `Select-String -Path js/app.js -Pattern 'localStorage|fetch\(|innerHTML'` no devuelve ninguna coincidencia.
  - **Salida observada:** `(Get-Content js/app.js).Count` = `195` (≤ 200) y prohibidos = `0`.
  - **Nota sobre el comando de la task:** `(Get-Content js/app.js | Measure-Object -Line).Count` devuelve `1` siempre (`.Count` cuenta objetos de medición, no líneas); la medida real es `.Lines` o `(Get-Content ...).Count` = `195`.
- [x] 2.2 Implementar `iniciar()`: resolver la ruta del hash actual, normalizar la URL con `location.replace('#/' + ruta)` cuando no coincida, montar la ruta resuelta y registrar la escucha `hashchange` sobre `window` una sola vez. Verificar: `(Select-String -Path js/app.js -Pattern 'addEventListener' | Measure-Object).Count` devuelve `1`, y el arranque se dispara al final del IIFE del módulo (última instrucción del archivo) sin script en línea en `index.html`.
  - **Salida observada:** `addEventListener` = `1`; última instrucción del archivo (línea 195): `window.Libreria.app.iniciar();`; `scriptsSinSrc: 0` en el harness.
- [x] 2.3 Implementar `montarVista(nombreVista, contenedor)`: vaciar la sección de la vista anterior y ocultarla, delegar el render en `Libreria.vistas.<vista>.render(contenedor)`, poner `aria-current="page"` y la clase `enlace-nav--activo` en el enlace de la vista activa y quitárselos a los otros cuatro, y mover el foco al `<h1>` de la vista con `Libreria.ui.moverFoco`, con respaldo en `<main>`. Verificar: `(Get-Content js/app.js | Measure-Object -Line).Count` sigue siendo `<= 200` y `Select-String -Path js/app.js -Pattern 'innerHTML|onclick='` no devuelve coincidencias.
  - **Salida observada:** `195` líneas (≤ 200) y `innerHTML|onclick=` = `0`.
- [x] 2.4 Comprobar en Chrome real el comportamiento del router: extender el harness externo `C:\Users\USUARIO\AppData\Local\Temp\opencode\verificar_navegador.js` (fuera del repo, no se copia a la entrega) para navegar a `#/ventas`, `#/` y `#/inexistente`, y comprobar en cada caso que queda visible una sola `<section>`, que es la del hash (o `vista-catalogo` en las dos redirecciones), que el enlace de la vista visible tiene `aria-current="page"` y la clase `enlace-nav--activo`, que `document.activeElement` es el `<h1>` de la vista y que no hay excepciones ni errores en la consola. Ejecutar `node "C:\Users\USUARIO\AppData\Local\Temp\opencode\verificar_navegador.js"` desde la raíz del repo y registrar la salida observada.
  - **Salida observada (Chrome, `node` exit 0):**
    - `#/ventas` → `secciones visibles: ["vista-ventas"] (total 1)`, foco `H1 "Ventas"`, `aria-current: ["#/ventas"]`, clase `["#/ventas"]`, 1 mensaje en la región ⇒ `OK`.
    - `#/` → hash final `#/catalogo`, `secciones visibles: ["vista-catalogo"] (total 1)`, foco `H1 "Catálogo"`, 2 mensajes (estado vacío + «No se indicó ninguna ruta: se muestra la vista Catálogo.») ⇒ `OK`.
    - `#/inexistente` → hash final `#/catalogo`, `secciones visibles: ["vista-catalogo"] (total 1)`, foco `H1 "Catálogo"`, 2 mensajes (estado vacío + «La ruta solicitada «#/inexistente» no existe: se muestra la vista Catálogo.») ⇒ `OK`.
    - Las 7 rutas del recorrido (`#/ventas`, `#/`, `#/inexistente`, `#/catalogo`, `#/libros`, `#/clientes`, `#/historial`) devuelven `sinErroresDeConsola:true`, `sinExcepciones:true`, `sinNulos:true`.
  - **Salida observada (Firefox, mismo recorrido):** las 7 rutas ⇒ `OK`, con `foco: tag=H1 ... esH1DeLaVista=true` y `hashNormalizado:true`.

## 3. Estado vacío por vista (`js/vistas/*.js`)

- [x] 3.1 Implementar en los cinco módulos `js/vistas/catalogo.js`, `libros.js`, `clientes.js`, `ventas.js` e `historial.js` el `render(contenedor)` que escribe el mensaje de estado inicial **propio** de cada vista en la región `.region-mensajes` de su sección, con `Libreria.ui.mostrarMensaje` y sin insertar markup como texto. Verificar: `Select-String -Path js/vistas/*.js -Pattern 'innerHTML|localStorage|fetch\('` no devuelve coincidencias, cada módulo sigue exponiendo únicamente `render` y `(Get-Content js/vistas/*.js | Measure-Object -Line).Count` no supera las 200 líneas por archivo.
  - **Salida observada:** prohibidos = `0`; cada archivo tiene `41` líneas (≤ 200); la única clave del objeto exportado en los cinco es `render` (`js/vistas/*.js:28`) y el harness confirma `vistaCatalogo: ["render"]`.
- [x] 3.2 Comprobar que los cinco mensajes de estado inicial son distintos entre sí y distintos del mensaje de error: en el harness externo de Chrome, recorrer las cinco rutas y leer el texto de `.region-mensajes` de cada vista, confirmando que los cinco textos son diferentes entre sí. Registrar la salida observada.
  - **Salida observada (Chrome):** `mensajes de estado inicial distintos entre si: true (5 vistas)`; `mensaje de ruta desconocida distinto del estado inicial del catalogo: true`; `mensaje de ruta desconocida distinto del estado inicial de las otras vistas: true`.
  - Textos: Catálogo «El catálogo todavía no tiene libros cargados…», Libros «Todavía no hay libros registrados…», Clientes «Todavía no hay clientes registrados…», Ventas «Todavía no hay ventas registradas…», Historial «El historial todavía no tiene ventas registradas…».

## 4. Estilo del estado activo y del foco (`css/`)

- [x] 4.1 Definir en `css/componentes.css` la clase `.enlace-nav--activo` con fondo `var(--color-acento-suave)`, `font-weight: var(--peso-fuerte)` y subrayado, de modo que la vista activa se distinga sin depender sólo del color. Verificar: `Select-String -Path css/componentes.css,css/vistas.css -Pattern '#[0-9a-fA-F]{3,8}'` no devuelve coincidencias (los hexadecimales sólo pueden existir en `css/base.css`).
  - **Salida observada:** `0` coincidencias.
- [x] 4.2 Confirmar que `css/base.css` conserva **sólo** la regla global de foco `:focus-visible` y que no queda ningún
  respaldo `:focus` (la hipótesis de D9 se probó y se refutó: en el estado en que la página pierde el foco ningún
  elemento coincide con `:focus` ni con `:focus-visible`). Verificar: `Select-String -Path css/base.css -Pattern 'nav a:focus'`
  no devuelve coincidencias y `Select-String -Path css/base.css -Pattern ':focus-visible'` devuelve `1` coincidencia.
  - **Salida observada:** `nav a:focus` → `0` coincidencias; `:focus-visible` → `1` coincidencia (L303). La regla de
    respaldo se llegó a implementar, se midió en Firefox 137.0.1 con ventana real y se retiró: no restablecía el anillo
    y sólo agregaba el efecto de pintarlo al hacer clic con mouse. Detalle y tabla de medición en `design.md` (D9).

- [x] 4.3 Comprobar en el navegador que el estado activo se marca en el DOM y en la capa visual: con el harness externo de Chrome, verificar que el enlace de la vista visible tiene la clase `enlace-nav--activo` y que su `font-weight` computado difiere del de los otros cuatro enlaces (distinción que no depende del color). Registrar la salida observada.
  - **Salida observada (Chrome):** el enlace activo tiene `aria-current: "page"` y `activoClase: true`; `fontWeight` activo `700` vs. `["400","400","400","400"]` ⇒ `pesoDifiere: true`; además `background` `rgb(240, 228, 214)` vs. `rgba(0, 0, 0, 0)` ⇒ `fondoDifiere: true`, y `textDecorationLine: underline`.

## 5. Verificación en navegador y registro de resultados

- [x] 5.1 Ejecutar el recorrido completo en Chrome: `node "C:\Users\USUARIO\AppData\Local\Temp\opencode\verificar_navegador.js"` desde la raíz del repo, y comprobar que no hay excepciones ni entradas de error en la consola, que tras cada navegación queda visible una sola `<section>` y que el foco llega al `<h1>` de la vista activa. Registrar la salida observada.
  - **Salida observada:** `node` exit `0`; `[harness] fallos de comprobacion: 0`; `errores de consola: 0`; `excepciones: 0`; las 7 rutas con `unaSolaSeccionVisible:true` y `focoEnElH1DeLaVista:true`; recorrido de Tab: `Tab 1..5` enlaces del nav con `focusVisible:true, outlineStyle:"solid", outlineWidth:"3px"`, `Tab 6` BODY, `Tab 7` vuelve al enlace «Catálogo» con `outlineStyle:"solid", outlineWidth:"3px"`.
  - Estructura observada: `navLinks: 5`, `sections: 5`, `h1PorSeccion: [1,1,1,1,1]`, `seccionesOcultas: 4`, `mainTabindex: "-1"`, `h1Tabindex: ["-1"×5]`, `regionesMensajes: 5`, `scripts: 10`, `scriptsSinSrc: 0`, `styleInline: 0`, namespace `Libreria` = `[storage,datos,validaciones,ui,vistas,app]`, `app: ["iniciar","montarVista"]`, globales filtradas: `[]`.
- [x] 5.2 Ejecutar el recorrido en Firefox y registrar el estado real del foco en cada pulsación de `Tab`, en lugar de
  exigir un anillo que la plataforma no puede pintar: `node "C:\Users\USUARIO\AppData\Local\Temp\opencode\verificar_firefox.js"`
  (headless) y `node "C:\Users\USUARIO\AppData\Local\Temp\opencode\verificar_firefox_escritorio.js"` (ventana real).
  Verificar que `Tab` 1 a 5 den `:focus-visible:true` con `outline:"solid 3px"` y que la consola no tenga errores de la
  app.
  - **Salida observada (ventana de escritorio real, Firefox 137.0.1):** `Tab 1..5` → `tag=A`, `docConFoco=true`,
    `:focus=true`, `:focus-visible=true`, `outline=solid 3px`; `Tab 6` → `tag=BODY, docConFoco=false`; `Tab 7` y
    `Tab 8` → `tag=A` pero `docConFoco=false`, `:focus=false`, `:focus-visible=false`, `outline=none 0px`.
  - **Conclusión:** con el documento sin foco no coincide ninguna pseudo-clase de foco, así que el respaldo
    `nav a:focus` no podía pintar el anillo. Se retiró la regla (task 4.2) y la limitación quedó documentada en
    `design.md` (D9). El requisito de foco visible se cumple en todos los estados en que la página tiene el foco.
  - **Recuperación de foco de ventana:** con un enlace enfocado, minimizar y restaurar la ventana devuelve
    `docConFoco=true`, `:focus=true`, `:focus-visible=true`, `outline=solid 3px` (`verificar_firefox_foco_ventana.js`).
  - **Consola:** `entradas de error de la app (index.html del repo): 0`, en headless y en escritorio.

- [x] 5.3 Recorrido en el navegador de escritorio: recorrer las cinco rutas con el teclado y con el puntero, comprobar
  que el aviso de ruta desconocida es visible en la vista Catálogo, que el foco no queda atrapado y que el estado vacío
  de cada vista se lee como propio y distinto del de las demás. Registrar el resultado observado.
  - **Ejecución:** ventana real de Firefox 137.0.1 en el escritorio (no headless), conducida por Marionette con clics y
    pulsaciones reales sobre la ventana (`verificar_firefox_recorrido.js`, fuera del repositorio).
  - **Salida observada:** `fallos de comprobacion: 0`. Con puntero, los cinco enlaces del nav (`#/libros`,
    `#/clientes`, `#/ventas`, `#/historial`, `#/catalogo`) dan `visibles=1`, `hash` y `seccion` coherentes,
    `aria-current=1` con `enlace-nav--activo` en el mismo enlace y `foco=H1` de la vista. Con teclado: `Tab` hasta
    `Clientes` + `Enter` → `hash=#/clientes`, `seccion=vista-clientes`, `foco=H1("Clientes")`.
  - **Foco no atrapado:** la secuencia de `Tab` vuelve a entrar en el nav y sale del documento en la 6.ª pulsación.
  - **Ruta desconocida:** `#/inexistente` → `hash=#/catalogo`, `seccion=vista-catalogo`, con dos mensajes visibles como
    nodos `<p>` separados (el estado vacío propio y `La ruta solicitada «#/inexistente» no existe: se muestra la vista
    Catálogo.`), separados por `row-gap` de `12px`.
  - **Estado vacío propio:** los cinco textos son distintos entre sí y cada uno nombra su vista (Catálogo, Libros,
    Clientes, Ventas, Historial).
  - **Recursos remotos:** `enlacesRemotos: 0`, `recursosRemotos: 0`.
  - **Desviación corregida durante la ejecución:** la región `.region-mensajes` no tenía regla CSS, así que dos
    mensajes consecutivos quedaban con sus bordes pegados. Se agregó en `css/componentes.css` la regla
    `.region-mensajes { display: grid; gap: var(--espacio-3); }` (sin hexadecimales: la verificación de la task 4.1
    sigue dando `0`). La apariencia final de los mensajes queda para C-03, dueño de la identidad visual.

- [x] 5.4 Revisar el diff antes de dar el change por implementado: `git status --short` y `git diff --stat` deben mostrar únicamente cambios en `index.html`, `js/app.js`, `js/vistas/*.js`, `css/base.css` y `css/componentes.css`, sin archivos nuevos y sin `package.json`, `node_modules/`, `package-lock.json` ni `dist/`. Verificar: `Test-Path package.json, node_modules, package-lock.json, dist` devuelve `False` en los cuatro casos.
  - **Salida observada:** `Test-Path` → `False` ×4.
  - **Particularidad del repo:** no tiene commits (`git diff --stat` sale vacío y `git status --short` lista todo el árbol como `??`). El diff real se midió contra el snapshot previo al change con `git diff --no-index --numstat`: `index.html (+11/-6)`, `js/app.js (+179/-20)`, `css/base.css (+13/-2)`, `css/componentes.css (+14/-1)`, `js/vistas/{catalogo,libros,clientes,ventas,historial}.js (+19/-5)` c/u; `js/datos.js`, `js/storage.js`, `js/ui.js`, `js/validaciones.js` y `css/vistas.css` **sin cambios**. Ningún archivo nuevo ni borrado: sólo los 9 archivos del alcance.

## Workflow follow-up

- Archivar el change con `/opsx:archive navegacion-hash-vistas` una vez marcadas todas las tareas de verificación, y comprobar que `openspec validate --strict` sigue pasando sobre el spec principal resultante.
- Marcar `[x]` en `CHANGES.md` la entrada de C-02.
