# Spec Delta

## MODIFIED Requirements

### Requirement: Barra de navegación con las cinco rutas
El `<nav>` SHALL contener cinco elementos `<a href>` —uno por vista— con los destinos `#/catalogo`, `#/libros`,
`#/clientes`, `#/ventas` y `#/historial`, con texto visible que describa la vista, y cada destino SHALL
corresponder al identificador de una de las cinco secciones de vista. El enlace de la vista activa SHALL llevar
`aria-current="page"` y una clase de estado activo, y los demás enlaces SHALL NOT llevar `aria-current="page"`.

#### Scenario: Enlaces de navegación presentes
- **WHEN** se listan los enlaces del `<nav>`
- **THEN** son cinco, con `href` iguales a `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas` y `#/historial`, y con texto visible

#### Scenario: Correspondencia entre enlace y sección
- **WHEN** se resuelve cada `href` de navegación contra los identificadores de las secciones
- **THEN** cada enlace apunta a una sección existente de la vista correspondiente

#### Scenario: Activación de un enlace
- **WHEN** el usuario activa un enlace de la barra de navegación con el teclado o con el puntero
- **THEN** el hash del documento pasa a ser el destino del enlace sin recargar la página

#### Scenario: Vista activa marcada en el DOM
- **WHEN** el router monta la vista Catálogo
- **THEN** el enlace `#/catalogo` lleva `aria-current="page"` y la clase de estado activo, y los otros cuatro enlaces no llevan `aria-current="page"`

#### Scenario: La marca se traslada al cambiar de vista
- **WHEN** el usuario navega de `#/catalogo` a `#/clientes`
- **THEN** el enlace `#/clientes` queda con `aria-current="page"` y con la clase de estado activo, y el enlace `#/catalogo` deja de tenerlos

#### Scenario: Estado activo distinguible sin depender del color
- **WHEN** se revisa el estilo de la clase de estado activo del enlace de navegación
- **THEN** la clase aporta una diferencia perceptible que no depende únicamente del color, como peso, fondo o subrayado

### Requirement: Estructura semántica del documento
`index.html` SHALL contener un `<header>` con la identidad de la librería, un `<nav>` con la navegación entre las
vistas y un `<main>` que contiene el contenido principal, usando etiquetas semánticas nativas y sin reconstruirlas
con ARIA. El `<nav>` SHALL llevar un `aria-label` que describa su función y el `<main>` SHALL llevar
`tabindex="-1"` para poder recibir el foco al cambiar de vista.

#### Scenario: Regiones semánticas presentes
- **WHEN** se inspecciona el árbol de `index.html`
- **THEN** existen exactamente un `<header>`, un `<nav>` y un `<main>`, y el `<main>` contiene las cinco secciones de vista

#### Scenario: Identidad de la librería en el encabezado
- **WHEN** se lee el contenido textual del `<header>`
- **THEN** en él figura el nombre de la librería como texto visible

#### Scenario: Navegación con nombre accesible
- **WHEN** se inspecciona el atributo `aria-label` del `<nav>`
- **THEN** tiene un valor no vacío que describe la función de la barra de navegación

#### Scenario: Región principal preparada para recibir el foco
- **WHEN** se inspecciona el atributo `tabindex` del `<main>`
- **THEN** vale `-1`, de modo que el elemento pueda recibir el foco desde el script sin entrar en el orden de tabulación

### Requirement: Separación entre estructura, estilos y comportamiento
`index.html` SHALL NOT contener hojas de estilos en línea ni lógica de negocio en línea; todos los estilos
SHALL residir en archivos externos de `css/` y todo el comportamiento SHALL residir en módulos de `js/`, cargados
desde el documento. La sección de la vista activa y su región de mensajes SHALL estar declaradas en el documento, y
el router SHALL limitarse a resolver el hash y a delegar el render en el módulo de la vista.

#### Scenario: Documento sin estilos en línea
- **WHEN** se inspecciona `index.html`
- **THEN** no hay elementos `<style>` ni atributos `style` con contenido de maquetación, y los tres archivos de `css/` están enlazados con `<link rel="stylesheet">`

#### Scenario: Comportamiento en scripts externos
- **WHEN** se inspecciona `index.html`
- **THEN** todos los elementos `<script>` llevan atributo `src` y referencian archivos de `js/` cargados en orden de dependencia, con `js/app.js` como última entrada, y ninguno contiene lógica de negocio en línea

#### Scenario: Región de mensajes declarada en el documento
- **WHEN** se inspecciona cada `<section>` de vista de `index.html`
- **THEN** contiene exactamente un `<div role="status" aria-live="polite">` declarado en el documento, y el router no escribe el contenido de las vistas dentro del HTML

## ADDED Requirements

### Requirement: Resolución de la ruta por hash
El router SHALL resolver `location.hash` contra las cinco rutas públicas `#/catalogo`, `#/libros`, `#/clientes`,
`#/ventas` y `#/historial`, y montar la sección de vista correspondiente. Un hash vacío, la raíz `#/` o un hash
desconocido SHALL redirigir a `#/catalogo` y mostrar un aviso visible, y el documento SHALL NOT quedar en blanco
(RN-ACC-01).

#### Scenario: Arranque sin hash en la URL
- **WHEN** se abre `index.html` sin hash en la URL
- **THEN** el router redirige a `#/catalogo`, monta la vista Catálogo y no deja ninguna vista sin mostrar

#### Scenario: Redirección desde la raíz
- **WHEN** el usuario navega a `#/`
- **THEN** el router redirige a `#/catalogo` y monta la vista Catálogo

#### Scenario: Hash desconocido
- **WHEN** el usuario navega a `#/inexistente`
- **THEN** el router redirige a `#/catalogo`, monta la vista Catálogo y muestra un aviso visible que informa que la ruta solicitada no existe

#### Scenario: Navegación entre rutas válidas
- **WHEN** el usuario navega de `#/catalogo` a `#/ventas`
- **THEN** el router monta la sección `vista-ventas` y desmonta la sección `vista-catalogo`

#### Scenario: Aviso visible ante ruta desconocida
- **WHEN** el router redirige desde una ruta desconocida
- **THEN** el aviso aparece como texto dentro de la aplicación y no solo en la consola del navegador

### Requirement: Ciclo de vida de la vista activa
El router SHALL desmontar la vista anterior vaciando su `<section>` antes de montar la siguiente, y el módulo de
vista SHALL registrar sus escuchas de evento en cada render, de modo que la vista activa no conserve contenido ni
escuchas de la vista anterior.

#### Scenario: Desmontaje de la vista anterior
- **WHEN** el usuario navega de la vista Catálogo a la vista Libros
- **THEN** la sección `vista-catalogo` queda vacía y solo la sección `vista-libros` contiene contenido

#### Scenario: Una sola vista visible
- **WHEN** se completa el montaje de cualquier vista
- **THEN** exactamente una de las cinco secciones de vista está visible y las otras cuatro siguen ocultas

#### Scenario: Escuchas registradas en cada render
- **WHEN** la misma vista se monta dos veces por una navegación de ida y vuelta
- **THEN** sus escuchas de evento quedan registradas una sola vez y la vista responde una vez por interacción

#### Scenario: Sin acumulación de contenido
- **WHEN** el usuario recorre las cinco vistas en un mismo recorrido de navegación
- **THEN** cada sección contiene el contenido de una sola vista y ninguna acumula elementos de otras

### Requirement: Gestión de foco al cambiar de vista
Al cambiar de vista, la aplicación SHALL mover el foco al `<h1>` de la vista activa o, cuando ese encabezado no
pueda recibirlo, a la región `<main tabindex="-1">`, de modo que el teclado y el lector de pantalla
sigan la vista nueva (RN-ACC-05).

#### Scenario: Foco en el encabezado de la vista
- **WHEN** el usuario activa el enlace `#/clientes`
- **THEN** el elemento que tiene el foco es el `<h1>` de la sección `vista-clientes`

#### Scenario: Foco alternativo en la región principal
- **WHEN** la vista activa no expone un `<h1>` que pueda recibir el foco
- **THEN** el foco se mueve a la región `<main>` y el orden de tabulación del documento no se rompe

#### Scenario: El foco no queda atrapado
- **WHEN** el usuario navega entre vistas con el teclado
- **THEN** puede seguir recorriendo con `Tab` los controles de la vista activa sin quedar atrapado en ella

#### Scenario: Foco visible en el enlace navegado
- **WHEN** el usuario recorre la barra de navegación con el teclado
- **THEN** el enlace que tiene el foco muestra un indicador de foco visible, también en el navegador Firefox

### Requirement: Región de mensajes por vista
Cada `<section>` de vista SHALL contener una región `<div role="status" aria-live="polite">` donde la aplicación
escriba, en texto, los resultados y los errores de esa vista. Los mensajes de error SHALL expresarse con un texto
explicativo y SHALL NOT depender únicamente del color (RN-ACC-02, RN-ACC-05).

#### Scenario: Mensaje de resultado
- **WHEN** una operación de la vista activa termina correctamente
- **THEN** su región de mensajes muestra el texto del resultado y el lector de pantalla lo anuncia por ser una región con `role="status"`

#### Scenario: Mensaje de error expresado en texto
- **WHEN** una operación de la vista activa es rechazada
- **THEN** su región de mensajes muestra un texto que explica qué ocurrió y no solo un color o un ícono

#### Scenario: Región propia de cada vista
- **WHEN** se inspecciona el documento
- **THEN** cada una de las cinco secciones de vista tiene su propia región de mensajes y ninguna la comparte con otra

#### Scenario: Aviso de ruta desconocida visible
- **WHEN** el router redirige a `#/catalogo` desde una ruta desconocida
- **THEN** el aviso aparece en la región de mensajes de la vista Catálogo y no desaparece por sí solo

### Requirement: Estructura semántica de controles y tablas
Todo control de formulario de la interfaz SHALL tener un `<label for>` asociado a su `id`, todo botón SHALL ser un
`<button>` nativo cuyo texto visible describa la acción, y toda tabla SHALL usar `<thead>` con `<th scope="col">`
y `<tbody>` con celdas `<td>` (RN-ACC-02, US-003).

#### Scenario: Etiqueta asociada a cada control
- **WHEN** se inspecciona cada control de formulario de la interfaz
- **THEN** tiene un `<label for>` cuyo `for` coincide con el `id` del control

#### Scenario: Botón nativo con texto que describe la acción
- **WHEN** se inspecciona cada botón
- **THEN** es un elemento `<button>` con texto visible que nombra la acción, y no un `<div>` ni un `<span>` con manejador

#### Scenario: Tabla con encabezados de columna
- **WHEN** se inspecciona una tabla de listado
- **THEN** su `<thead>` contiene un `<th scope="col">` por columna y su `<tbody>` contiene las celdas `<td>`

#### Scenario: Accionamiento con el teclado
- **WHEN** el usuario alcanza un botón con el teclado y lo activa
- **THEN** la acción se ejecuta, sin necesidad de un manejador `onclick` en línea

### Requirement: Estado vacío propio por vista
Cada vista SHALL mostrar un mensaje de estado inicial propio que explique qué información se verá en ella y por
qué todavía no hay datos. Ese mensaje SHALL ser distinto del mensaje de búsqueda sin resultados y del mensaje de
error, y SHALL NOT dejar un área de contenido vacía sin explicación (RN-ACC-02, US-004).

#### Scenario: Mensaje de estado inicial por vista
- **WHEN** se renderiza la vista Catálogo sin libros cargados
- **THEN** su región de mensajes muestra el texto de estado inicial del catálogo y no queda un área de contenido sin explicación

#### Scenario: Mensajes distintos entre vistas
- **WHEN** se comparan los mensajes de estado inicial de Catálogo, Libros, Clientes, Ventas e Historial
- **THEN** cada vista muestra un texto propio y ninguno se repite literalmente de otra vista

#### Scenario: Distinto del mensaje de búsqueda sin resultados
- **WHEN** una búsqueda no arroja coincidencias
- **THEN** el mensaje que se muestra es el de búsqueda sin resultados y no el del estado inicial de la vista

#### Scenario: Distinto del mensaje de error
- **WHEN** una operación de la vista es rechazada
- **THEN** el mensaje que se muestra es el de error y no el del estado inicial de la vista
