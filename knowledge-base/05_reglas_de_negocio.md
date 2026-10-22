# Reglas de Negocio

> **Fuente**: `docs/consigna-extraida.txt` — todas las reglas son verificables contra el texto de la consigna. Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad hacia el ejercicio y el criterio de evaluación.
> Cuando la consigna **no** especifica un detalle (formato de identificador, moneda, orden de listados, esquema de claves), la regla no se inventa: se registra en [10](10_preguntas_abiertas.md) con un **default propuesto**, y el default se aplica en la implementación.

## Mapa de dominios

| Código de dominio | Ámbito | Reglas | Ejercicio de la consigna |
|-------------------|--------|--------|--------------------------|
| `RN-ALC` | Alcance técnico y restricciones | 4 | Contexto y alcance |
| `RN-DAT` | Modelo de datos y datos locales | 5 | Ejercicio 3 |
| `RN-CAT` | Catálogo, render y filtro | 4 | Ejercicio 1 y 3 |
| `RN-LIB` | Alta de libros | 5 | Ejercicio 4 |
| `RN-CLI` | Alta de clientes | 3 | Ejercicio 4 |
| `RN-VEN` | Composición y confirmación de venta | 7 | Ejercicio 5 |
| `RN-HIS` | Historial e inmutabilidad | 3 | Ejercicio 5 |
| `RN-PER` | Persistencia | 3 | Ejercicio 6 |
| `RN-ACC` | HTML semántico, CSS y accesibilidad | 5 | Ejercicios 1 y 2 |
| `RN-ENT` | Entrega, documentación y verificación | 3 | Ejercicio 6 y formato de entrega |

**Total: 42 reglas de dominio + 5 excepciones globales (`RN-EX-01…05`) = 47 reglas**, que cubren la totalidad de los enunciados verificables de la consigna.

---

## Dominio: Alcance técnico (RN-ALC)

- **RN-ALC-01**: El sistema se construye **únicamente con HTML, CSS y JavaScript nativos**. No se usan librerías, frameworks ni CDNs de CSS o JavaScript. — El incumplimiento del alcance técnico **se informa en la evaluación**; es una restricción dura.
- **RN-ALC-02**: No hay API, base de datos, servidor ni conexión con el backend. Los datos y las operaciones **se simulan en el navegador**. — La consigna deriva el frontend del TP backend del otro docente, pero el parcial 1 desarrolla exclusivamente el frontend.
- **RN-ALC-03**: No se requiere un inicio de sesión real. No hay autenticación, autorización ni gestión de sesiones. — Consigna explícita: *"Tampoco se requiere un inicio de sesión real"*.
- **RN-ALC-04**: Los datos son ficticios. Las validaciones y el almacenamiento del navegador **no representan seguridad ni integridad garantizada por un servidor**. — Debe quedar declarado en el `README.md` y, si aplica, en la interfaz.

## Dominio: Modelo de datos y datos locales (RN-DAT)

- **RN-DAT-01**: Libros, editoriales, géneros, autores y clientes se representan mediante **arrays y objetos con identificadores estables**. — "Identificadores estables" implica que el id no se recalcula ni se reutiliza al borrar o agregar registros.
- **RN-DAT-02**: El conjunto inicial incluye **al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios**. — Mínimo numérico explícito de la consigna; la propuesta concreta está en [04](04_modelo_de_datos.md#seed-data-inicial).
- **RN-DAT-03**: Cada libro se relaciona con **una editorial existente** y con **uno o más autores existentes**. — Relational integrity: los ids referenciados deben resolver contra las colecciones locales.
- **RN-DAT-04**: El género es **opcional**; si se asigna, corresponde a un género existente. — La ausencia de género es un estado válido, no un error.
- **RN-DAT-05**: Los datos escritos por los usuarios se insertan **como texto en el DOM**. — Prohíbe `innerHTML` con contenido de usuario; se usa `textContent` / `createElement` + `value`.

## Dominio: Catálogo, render y filtro (RN-CAT)

- **RN-CAT-01**: JavaScript genera el catálogo **a partir del array de libros**. — No hay contenido hardcodeado en el HTML.
- **RN-CAT-02**: El filtro por título **ignora las diferencias entre mayúsculas y minúsculas**, busca **coincidencias parciales** y **elimina los espacios sobrantes en los extremos de la búsqueda**. — Cubre el caso manual nº 1.
- **RN-CAT-03**: Una búsqueda **vacía muestra todo el catálogo**. — Una búsqueda con solo espacios se trata como vacía (mismo criterio de `trim`).
- **RN-CAT-04**: Una búsqueda **sin coincidencias muestra un mensaje claro**, y todo libro sin género asignado se muestra con la etiqueta **«Sin clasificar»**. — Estados de vacío explícitos del Ejercicio 1.

## Dominio: Alta de libros (RN-LIB)

- **RN-LIB-01**: El formulario de libros registra **título, ISBN, precio y las relaciones con editorial, género y autores**. Las opciones se generan a partir de los datos locales: **editorial y género mediante selectores**, y **autores mediante un selector múltiple o controles de selección equivalentes**.
- **RN-LIB-02**: El selector de género incluye la opción **«Sin clasificar»**, que representa la ausencia de género. — El valor de esa opción debe mapear a `generoId = null`, no a un id de genre real.
- **RN-LIB-03**: El alta de un libro se rechaza si: el **título o el ISBN están vacíos**; el **ISBN ya existe** en el conjunto local; el **precio no es numérico o no es mayor que cero**; la **editorial no existe** en los datos locales; **no se selecciona al menos un autor**; algún **autor seleccionado no existe**; o el **género asignado no existe**. — Cada condición es un mensaje de error individual cerca del formulario.
- **RN-LIB-04**: El ISBN se compara **sin espacios ni guiones**. **No se requiere implementar su dígito de control.** — Normalización asimétrica frente al email: el ISBN también ignora guiones.
- **RN-LIB-05**: El envío del formulario se controla con **`preventDefault`**; los errores se muestran **cerca del formulario**; el registro **solo se agrega si todas las comprobaciones pasan**; y tras un alta correcta el **listado y las opciones relacionadas se actualizan sin recargar la página**. — "Opciones relacionadas" = selectores de libros de Ventas, listados de Clientes, catálogo.

## Dominio: Alta de clientes (RN-CLI)

- **RN-CLI-01**: El formulario de clientes registra **nombre completo y email**. **No se requiere un campo de apellido separado.** — Modelo de una sola entidad, sin `nombre`/`apellido` desagregados.
- **RN-CLI-02**: El alta de un cliente se rechaza si: el **nombre completo o el email están vacíos**; el **email no tiene un formato válido**; o **existe otro cliente con el mismo email**, comparado **sin espacios exteriores y sin distinguir mayúsculas de minúsculas**. — Normalización asimétrica frente al ISBN: el email **no** ignora guiones.
- **RN-CLI-03**: Tras un alta correcta, el **listado de clientes y el selector de cliente de la vista Ventas se actualizan sin recargar la página**. **No se exige editar ni eliminar clientes.** — "No se exige" ≠ "no se puede": la ausencia de edición/eliminación es la decisión de alcance, no una prohibición técnica.

## Dominio: Composición y confirmación de venta (RN-VEN)

- **RN-VEN-01**: Una venta requiere **un cliente existente** y **al menos un renglón** con **un libro existente** y una **cantidad entera mayor que cero**.
- **RN-VEN-02**: **No se admiten libros repetidos dentro de la misma venta**: al agregar un libro ya presente, se **modifica la cantidad del renglón existente** o se **informa el duplicado**. — Cubre el caso manual nº 4 (*el duplicado no crea otro renglón*).
- **RN-VEN-03**: **Antes de confirmar** se permite **cambiar cantidades** y **quitar renglones**. — Irreversibilidad recién después de la confirmación.
- **RN-VEN-04**: **Subtotal = cantidad × precio unitario**; **total = suma de subtotales**; los importes se presentan **con dos decimales**. — Redondeo a 2 decimales en cada subtotal y en el total.
- **RN-VEN-05**: **Se impide confirmar** una venta **sin cliente**, **sin renglones** o **con cantidades inválidas**. — La acción de confirmar debe estar deshabilitada o producir un error explicito.
- **RN-VEN-06**: Al confirmar se registra un **identificador, fecha, cliente, renglones y total**. — Se agrega una venta a la colección `libreria.ventas`.
- **RN-VEN-07**: El **precio unitario se copia al renglón como valor histórico**: el historial **no vuelve a obtenerlo del precio actual del catálogo**. — Regla nuclear del proyecto y núcleo del caso manual nº 6.

## Dominio: Historial e inmutabilidad (RN-HIS)

- **RN-HIS-01**: El historial muestra **identificador, fecha, cliente y total**, y **permite consultar los renglones**. — El detalle expone el desglose de la venta.
- **RN-HIS-02**: **Las ventas confirmadas no se editan ni se eliminan desde la interfaz.** — Inmutabilidad de la venta confirmada.
- **RN-HIS-03**: La confirmación **limpia el formulario** para una nueva venta y **muestra un mensaje de resultado**. — Mensaje de éxito con texto (no solo color).

## Dominio: Persistencia (RN-PER)

- **RN-PER-01**: Se utiliza **`localStorage`** para conservar **libros, clientes y ventas**. — Obligatorio por la consigna.
- **RN-PER-02**: En el **primer inicio** se cargan los ejemplos; al **volver a abrir** se recuperan los registros guardados **sin duplicar los datos iniciales**. — La siembra es condicional a que la clave no exista todavía; nunca se fusiona por id en cada arranque.
- **RN-PER-03**: El `README.md` explica que el almacenamiento **depende del navegador, del perfil y de la ubicación de apertura**, y que **no comparte información entre usuarios**. — Es una sección obligatoria del README.

## Dominio: HTML semántico, CSS y accesibilidad (RN-ACC)

- **RN-ACC-01**: El proyecto se organiza con **`index.html` como entrada** y existe **navegación clara** entre las vistas **Catálogo, Libros, Clientes, Ventas e Historial**. — Se permite una sola página con secciones o varias páginas; la navegación debe ser inequívoca.
- **RN-ACC-02**: La estructura incluye **encabezado, navegación y contenido principal con etiquetas semánticas**; **cada campo posee etiqueta asociada**; **los botones tienen textos que describen su acción**; **las tablas incluyen encabezados**; y existen **mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas**.
- **RN-ACC-03**: Se define una **identidad visual propia y coherente** (colores, tipografía, espaciado, tarjetas, formularios, botones); el CSS **se mantiene en archivos externos** y **se reutilizan clases** para elementos equivalentes. — Sin CSS inline relevante ni estilos dispersos.
- **RN-ACC-04**: El contenido se organiza con **Flexbox o Grid**; la interfaz es **legible a 320 px y a 1280 px** y **no provoca desplazamiento horizontal de toda la página**; si una tabla necesita más espacio, **se desplaza dentro de su propio contenedor**. — Cubre el caso manual nº 8.
- **RN-ACC-05**: Los controles **conservan un foco visible** y **se recorren con el teclado**; los **mensajes de error se expresan con texto y no dependen únicamente de un color**; las **imágenes informativas tienen texto alternativo** y las **decorativas no repiten información innecesaria**.

## Dominio: Entrega, documentación y verificación (RN-ENT)

- **RN-ENT-01**: La entrega es una **carpeta o archivo comprimido** con `index.html`, los demás HTML si corresponden, **carpetas de CSS, JavaScript y recursos locales**, y un **`README.md`**. **No se incluyen dependencias instaladas ni herramientas de compilación.**
- **RN-ENT-02**: El `README.md` identifica a **quienes realizan el trabajo** y contiene: **pasos para abrir `index.html` en el navegador sin npm**; **navegación entre vistas**; **funcionalidades implementadas y pendientes**; **ubicación de los datos iniciales**; **funcionamiento y límites de `localStorage`**; y **procedencia de imágenes ajenas, si existen**.
- **RN-ENT-03**: El `README.md` registra el **resultado observado** de los **8 casos manuales**. Si un caso falla o una funcionalidad queda pendiente, **se registra el comportamiento real**. **No se indica una prueba como aprobada sin ejecutarla.** — Y además: la **ubicación y la estructura del catálogo guardado** se identifican en el `README.md` para reproducir la comprobación del precio histórico.

## Dominio: Excepciones globales

- **RN-EX-01**: **El diseño no reemplaza a las validaciones.** Una interfaz cuidada sigue sin ser válida si no implementa las comprobaciones de `RN-LIB-03`, `RN-CLI-02` y `RN-VEN-05`. — Criterio explícito de evaluación.
- **RN-EX-02**: **Toda la información de negocio proviene de los datos locales.** Ninguna vista puede depender de red, de un servicio externo o de datos embebidos en el HTML que contradigan el store.
- **RN-EX-03**: **Toda validación debe ser reproducible por el usuario.** Los mensajes de error se muestran cerca del control que falló, en texto, y son comprensibles sin leer el código.
- **RN-EX-04**: **Ninguna acción de la interfaz puede dejar el estado en un estado incoherente.** Un alta fallida no escribe nada; una venta fallida no crea registros; una venta confirmada queda completa e inmutable.
- **RN-EX-05**: **Los datos ficticios se pueden leer como tales.** Ningún texto de la interfaz debe sugerir datos reales de clientes, stock o facturación.
