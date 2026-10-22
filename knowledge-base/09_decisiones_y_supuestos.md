# Decisiones y Supuestos

> **Fuente de verdad**: `docs/consigna-extraida.txt`. Todo lo que la consigna **no** dice queda registrado acá como decisión (DD) con su justificación, o como supuesto (SU) con su riesgo. Nada de lo que sigue agrega requisitos nuevos al parcial: son definiciones de implementación para que la consigna sea ejecutable.
> Los códigos `DD-*` y `SU-*` se referencian desde [04](04_modelo_de_datos.md), [05](05_reglas_de_negocio.md) y [10](10_preguntas_abiertas.md).

## Decisiones documentadas

### DD-01 — Aplicación de una sola página con enrutado por hash
**Decisión**: un único `index.html` con cinco `<section>` de vista y navegación por `location.hash` (`#/catalogo`, `#/libros`, `#/clientes`, `#/ventas`, `#/historial`).
**Contexto**: la consigna permite "varias páginas o secciones de una misma página, siempre que exista navegación clara" y exige que el formato de entrega incluya `index.html` "los demás HTML si corresponden".
**Alternativas consideradas**: (a) cinco archivos HTML separados con links; (b) SPA con hash sobre `index.html`; (c) SPA con enrutado por `history.pushState`.
**Justificación**: (b) cumple el formato de entrega más simple, funciona con doble clic sobre `file://` (donde `pushState` y `fetch` están bloqueados por CORS) y evita duplicar el encabezado, la navegación y los estilos en cinco archivos.
**Trade-offs aceptados**: el `title` del documento y el botón "atrás" del navegador funcionan por hash; se pierde el "estado de formulario" al navegar entre vistas (aceptable: los borradores de venta no persisten entre sesiones de venta).

### DD-02 — Semilla de datos con precios que permiten reproducir el caso manual nº 5
**Decisión**: el seed incluye exactamente 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes (los mínimos de la consigna), con `LIB-001` a 1500.00 y `LIB-002` a 2000.00.
**Contexto**: la consigna fija los mínimos numéricos pero no los nombres ni los precios; el caso manual nº 5 exige una venta "dos unidades a 1500 y una a 2000" con total 5000.
**Alternativas consideradas**: (a) precios arbitrarios; (b) precios que reproduzcan exactamente los del caso manual; (c) precios "redondos" para las obras de ensayo.
**Justificación**: con (b) el caso manual se puede ejecutar **sin cargar datos extra**, lo que hace la comprobación reproducible por el docente tal como la pide la consigna ("procedimiento guiado… con datos de prueba").
**Trade-offs aceptados**: el seed no es "realista" en cuanto a precios de librerías; es un catálogo de precios de演练.

### DD-03 — Los tres catálogos auxiliares también se persisten
**Decisión**: `localStorage` guarda `libreria.libros`, `libreria.clientes`, `libreria.ventas` **y** `libreria.editoriales`, `libreria.generos`, `libreria.autores`.
**Contexto**: la consigna solo exige persistir libros, clientes y ventas, pero los selectores del formulario de libros y las fichas del catálogo necesitan los catálogos auxiliares.
**Alternativas consideradas**: (a) persistir solo lo obligatorio y mantener auxiliares en el seed en memoria; (b) persistir todo.
**Justificación**: (b) evita tener dos fuentes de verdad para las listas de los selectores y permite que el estado de la app sea reconstruible por completo desde `localStorage`.
**Trade-offs aceptados**: una clave más que explicar en el `README.md`. Se mitiga documentando la tabla de claves completa.
**Nota**: la consigna sigue satisfecha: el procedimiento del docente modifica **únicamente** el precio de un libro, sin tocar ventas.

### DD-04 — El precio unitario se congela al **agregar** el renglón al borrador
**Decisión**: el renglón toma `precioUnitario` del catálogo en el momento en que se agrega a la venta en curso, y ese valor viaja con el renglón hasta la confirmación.
**Contexto**: la consigna dice "Al confirmar, se registra un identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial". También establece que en la vista de Ventas cada renglón muestra el precio unitario, lo que implica que el precio ya está definido mientras se compone la venta.
**Alternativas consideradas**: (a) leer el precio del catálogo recién al confirmar; (b) congelarlo al agregar el renglón; (c) releerlo en cada render de la venta en curso.
**Justificación**: (b) y (c) son equivalentes para el resultado final, pero (b) evita que el importe mostrado en pantalla cambie bajo los pies del usuario entre que arma la venta y la confirma, y es más simple de razonar.
**Trade-offs aceptados**: si el precio del catálogo cambia **durante** la composición de una venta, la venta refleja el precio de cuando se agregó el renglón, no el del momento de confirmar. Es coherente con la idea de "valor histórico" y no está en contradicción con la consigna (que solo exige que el historial no vuelva a leer el precio actual). Registrado como pregunta abierta P-04.

### DD-05 — Normalización asimétrica de ISBN y email
**Decisión**: el ISBN se normaliza quitando espacios **y guiones**; el email se normaliza quitando solo espacios exteriores, ambos en minúsculas.
**Contexto**: la consigna lo dice de forma literal y distinta para cada caso: para el ISBN "se compara sin espacios ni guiones"; para el email "comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas".
**Alternativas consideradas**: normalizar ambos igual; normalizar el email también quitando guiones.
**Justificación**: seguir el texto al pie de la letra evita casos borde discutibles (un email con guion es perfectamente válido).
**Trade-offs aceptados**: dos funciones de normalización distintas en el código. Se mitiga con nombres explícitos (`normalizarIsbn` / `normalizarEmail`).

### DD-06 — Identificadores con prefijo y número de 3 dígitos
**Decisión**: `LIB-001`, `EDI-001`, `GEN-001`, `AUT-001`, `CLI-001`, `VEN-001`, `REN-001`.
**Contexto**: la consigna exige "identificadores estables" pero no fija un formato.
**Alternativas consideradas**: (a) numéricos autoincrementales (`1`, `2`, `3`); (b) UUID; (c) prefijo + correlativo.
**Justificación**: (c) es legible en el `localStorage` durante la comprobación guiada del docente (se ve de inmediato que `libroId: "LIB-001"` apunta a un libro), es estable y no colisiona entre colecciones.
**Trade-offs aceptados**: en el `localStorage` el correlativo se calcula como `max(correlativo existente) + 1` sobre la colección, lo que exige tratar la corrupción de ids como caso excepcional. Registrado como pregunta abierta P-01.

### DD-07 — Claves de `localStorage` con namespace `libreria.`
**Decisión**: prefijo `libreria.` + nombre de la colección en plural y minúsculas.
**Contexto**: la consigna no fija el esquema de claves, pero exige que el README documente "la ubicación y la estructura del catálogo guardado" para que el docente pueda reproducir la comprobación del precio histórico.
**Alternativas consideradas**: (a) claves planas (`libros`, `clientes`); (b) una única clave con todo (`libreria.datos`); (c) una clave por colección con prefijo.
**Justificación**: (c) es granular (editar el precio de un libro no obliga a tocar el resto), evita colisiones con otras apps del mismo origen y se documenta de forma trivial.
**Trade-offs aceptados**: seis claves que explicar. Se compensa con una tabla en el `README.md` y en [04](04_modelo_de_datos.md#estructura-persistida-en-localstorage).

### DD-08 — Seed condicional: solo se siembra si la clave no existe
**Decisión**: en cada arranque, por cada colección, si la clave **no existe** se escribe el seed; si existe, se respeta lo guardado y **no** se escribe nada. No hay fusión por `id` en cada arranque.
**Contexto**: la consigna pide "En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales". Y el caso manual nº 6 exige que el precio modificado por el docente **sobreviva a la recarga**.
**Alternativas consideradas**: (a) re-sembrar siempre y fusionar por `id`; (b) sembrar solo si la clave no existe; (c) guardar un flag `seed.version`.
**Justificación**: (a) **rompería** la comprobación del precio histórico (el precio modificado se perdería al recargar y el caso no sería concluyente) y además obligaría a resolver conflictos de merge. (b) cumple las dos cosas a la vez.
**Trade-offs aceptados**: si el docente borra una clave desde DevTools, esa colección vuelve al seed en la próxima carga. Aceptable y además conveniente para "empezar de cero".

### DD-09 — Snapshot descriptivo en el renglón y en la venta
**Decisión**: el renglón guarda `titulo`, `isbn`, `autores` (texto) y `editorial` (texto); la venta guarda `clienteNombre`.
**Contexto**: la consigna dice "Se conservan también los datos descriptivos necesarios para leer esa venta".
**Alternativas consideradas**: (a) guardar solo ids y resolver los textos al mostrar; (b) guardar los textos además de los ids.
**Justificación**: (b) hace que el historial sea legible **por sí mismo**, tal como el enunciado pide, y blinda al docente ante la observación de que el detalle debería sobrevivir a cualquier cambio del catálogo.
**Trade-offs aceptados**: duplicación de datos en disco (irrelevante a esta escala) y el riesgo de que el snapshot quede desactualizado respecto del catálogo (aceptable: es justamente el comportamiento "histórico" buscado).

### DD-10 — Formato de importes y de fecha
**Decisión**: los importes se formatean con **dos decimales** mediante `toFixed(2)` (sin símbolo de moneda) y la fecha se guarda como **ISO 8601 en UTC** (`new Date().toISOString()`), mostrada al usuario en formato local legible.
**Contexto**: la consigna exige "los importes se presentan con dos decimales" pero no define moneda ni formato de fecha.
**Alternativas consideradas**: (a) símbolo de moneda (`$ 1.500,00`); (b) número con dos decimales sin símbolo; (c) fecha legible en texto.
**Justificación**: (b) evita imponer una moneda que el enunciado no define, y coincide con la forma en que la consigna escribe los importes esperados ("Subtotales 3000 y 2000; total 5000"). Para la fecha, el ISO 8601 permite ordenar el historial de forma determinista; el formato local es solo de presentación.
**Trade-offs aceptados**: la separación de miles/punto decimal sigue la convención del navegador (`toLocaleString`), que puede diferir del español rioplatense. Registrado como pregunta abierta P-03.

### DD-11 — Sin imágenes externas; recursos locales o SVG inline
**Decisión**: no se usan fotografías de terceros. La identidad visual se resuelve con CSS (tipografía del sistema, color, sombras, bordes) y, si hace falta, SVG inline decorativo con `aria-hidden="true"`.
**Contexto**: el `README.md` debe incluir "procedencia de imágenes ajenas, si existen"; además, cualquier recurso externo sería una dependencia de red prohibida por el alcance.
**Alternativas consideradas**: (a) fotos de portada reales de libros; (b) imágenes generadas/free-license con atribución; (c) sin imágenes.
**Justificación**: (c) elimina de raíz el problema de licencias y de red, y la consigna no exige imágenes en ningún punto: solo define cómo deben tratarse *si* existen (texto alternativo). Es la opción más segura frente a la evaluación.
**Trade-offs aceptados**: las fichas de libro se ven más sobrias que con portadas. Se compensa con una ficha de catálogo cuidada (tipografía, metadata, precio destacado).
**Nota**: la consigna exige que la entrega incluya una carpeta de "recursos locales" — la carpeta `assets/` se crea y queda documentada aunque se use solo para el SVG del logo.

### DD-12 — Separación de módulos por entidad y por responsabilidad
**Decisión**: `js/datos.js` (store + seed), `js/storage.js` (persistencia), `js/validaciones.js` (reglas puras), `js/ui.js` (helpers DOM), `js/vistas/*.js` (una por vista), `js/app.js` (bootstrap y router).
**Contexto**: la rúbrica valora "código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento".
**Alternativas consideradas**: (a) un único `app.js` monolítico; (b) un archivo por función; (c) un módulo por responsabilidad y un módulo por vista.
**Justificación**: (c) da archivos cortos y con una responsabilidad evidente, sin fragmentar en exceso.
**Trade-offs aceptados**: un archivo más que mantener (`ui.js` y `datos.js` podrían fusionarse); el beneficio en claridad compensa.

### DD-13 — Nombre propio de la librería, escrito en un solo lugar
**Decisión**: la librería se llama **"Librería El Faro"**. El nombre aparece en el `<title>` del documento, en el `<header>` y en el encabezado de la vista Catálogo. No se usa ninguna otra marca en el código.
**Contexto**: el Ejercicio 1 pide que la vista Catálogo muestre "el título de la librería". La consigna no fija un nombre, y una palabra genérica ("Librería") no distingue el proyecto de cualquier otro.
**Alternativas consideradas**: (a) dejar solo la palabra "Librería"; (b) un nombre inventado; (c) un nombre temático tomado del seed.
**Justificación**: (b) con (c) cumple "título de la librería" con un nombre propio y coherente con la primera obra del catálogo ("El faro de las salinas"), que le da identidad al seed. El nombre es ficticio (SU-07, P-13).
**Trade-offs aceptados**: es un detalle de presentación que el docente puede pedir cambiar. Por eso está **centralizado**: cambiarlo es editar dos lugares de `index.html` y una línea del README.
**Nota**: el nombre no aparece en `localStorage` ni forma parte de ninguna clave, así que cambiarlo no invalida los datos guardados.

### DD-14 — Las preguntas de prioridad Alta quedan cerradas con los defaults propuestos
**Decisión**: P-01 (formato de ids), P-02 (claves de `localStorage`), P-03 (formato de importes) y P-04 (momento de congelamiento del precio) se resuelven **adoptando el default propuesto** en [10](10_preguntas_abiertas.md), que es lo que ya definían DD-06, DD-07, DD-10 y DD-04.
**Contexto**: las cuatro inicialmente estaban dirigidas al docente. Adoptar los defaults permite cerrar la Fase 0 sin bloquear la implementación, y deja todo lo decidido en un único lugar auditable.
**Justificación**: ninguno de los defaults contradice la consigna; los cuatro son decisiones de implementación sobre puntos que el enunciado deja abiertos. Cada una queda documentada en el README de entrega para que el docente la encuentre sin consultar la KB.
**Trade-offs aceptados**: si el docente quería otra cosa (por ejemplo, un símbolo de moneda), el ajuste es de un solo punto (`ui.formatearMonto`) más la línea del README. Se deja anotado en el README como decisión de diseño, no como requisito del enunciado.
**Estado**: las cuatro siguen abiertas *para confirmación del docente* en el sentido de que se pueden cambiar; pero **no bloquean** la implementación.

## Supuestos inferidos

### SU-01 — La moneda no se define
**Supuesto**: los importes se muestran como número con dos decimales, sin símbolo de moneda.
**Origen**: la consigna menciona "precio", "total" y "Subtotales 3000 y 2000; total 5000", pero nunca nombra una moneda ni un país.
**Riesgo si es falso**: el docente podría esperar un formato con símbolo (`$ 5.000,00`), que es un detalle de presentación menor.
**Cómo validar**: ajustar `ui.formatearMonto()` y el README en un momento; es un cambio aislado.

### SU-02 — El catálogo se ordena por título ascendente
**Supuesto**: los listados de libros (catálogo y vista Libros) se ordenan alfabéticamente por título, con criterio de desempate por `id`.
**Origen**: la consigna no fija ningún orden.
**Riesgo si es falso**: el orden esperado podría ser por orden de alta o por precio. Es puramente cosmético.
**Cómo validar**: si el docente lo señala, se cambia la función `ordenarLibros()` en un solo lugar.

### SU-03 — El historial se ordena de más reciente a más antiguo
**Supuesto**: el historial ordena por fecha descendente, con desempate por `id` descendente.
**Origen**: no especificado en la consigna.
**Riesgo si es falso**: también cosmético.
**Cómo validar**: igual que SU-02.

### SU-04 — La fecha de la venta es la de confirmación, en UTC
**Supuesto**: `fecha` se genera con `new Date().toISOString()` en el momento de confirmar y se muestra en formato local legible.
**Origen**: la consigna exige registrar "fecha" pero no define zona horaria ni formato.
**Riesgo si es falso**: irrelevante para la evaluación; afecta solo la presentación.
**Cómo validar**: `ui.formatearFecha()` es el único punto de cambio.

### SU-05 — Los identificadores de venta son correlativos
**Supuesto**: `VEN-001`, `VEN-002`, … numeración correlativa sin reinicio.
**Origen**: la consigna exige "un identificador" sin fijar formato.
**Riesgo si es falso**: ninguno funcional; el docente solo necesita ver un id.
**Cómo validar**: cambiar `store.generarIdVenta()`.

### SU-06 — No se registran datos de venta "borrador"
**Supuesto**: una venta existe en el store **solo después** de confirmarse; el borrador vive en el estado local del módulo de Ventas.
**Origen**: la consigna pide persistir "libros, clientes y ventas" y no menciona borradores; además, guardar borradores podría confundirse con ventas en el historial.
**Riesgo si es falso**: si el docente espera que un borrador sobreviva a una recarga, no lo hará. Es el comportamiento más seguro: en el historial solo hay ventas confirmadas.
**Cómo validar**: si se pide, agregar una clave `libreria.borradorVenta` — pero eso agregaría un caso no previsto al alcance de persistencia.

### SU-07 — Los datos del seed son ficticios y recognizibles como tales
**Supuesto**: nombres de personas, editoriales y títulos inventados; emails en el dominio reservado `example.com`.
**Origen**: la consigna exige "tres clientes ficticios" y "datos ficticios".
**Riesgo si es falso**: ninguno; es el comportamiento correcto.
**Cómo validar**: no requiere validación.

### SU-08 — `localStorage` es el único mecanismo de persistencia
**Supuesto**: no se usa IndexedDB, Cache Storage, cookies ni `sessionStorage`.
**Origen**: la consigna nombra exclusivamente `localStorage`.
**Riesgo si es falso**: ninguno; sería una ampliación innecesaria del alcance.
**Cómo validar**: no requiere validación.

### SU-09 — Los errores de validación se muestran en español
**Supuesto**: todos los textos de la interfaz y de los mensajes de validación están en español rioplatense neutro, con la terminología de la consigna («Sin clasificar», «renglón»).
**Origen**: el enunciado y el material de la cátedra están en español y fijan dos rótulos literales.
**Riesgo si es falso**: desalineación con el material evaluado.
**Cómo validar**: comparación directa con los textos de la consigna.

### SU-10 — La carga de clientes/libros extra del seed no es obligatoria
**Supuesto**: para los casos manuales nº 2 y nº 3 (ISBN duplicado, email duplicado en mayúsculas) se usan los registros del propio seed (`LIB-001` / `CLI-001`) como duplicados.
**Origen**: la consigna pide "ISBN existente" y "email existente en mayúsculas" pero no garantiza que existan; el seed los garantiza.
**Riesgo si es falso**: bajo; los casos también se pueden preparar dando de alta un registro extra.
**Cómo validar**: los casos manuales documentados en el `README.md` deben indicar qué registro se usó como duplicado.
