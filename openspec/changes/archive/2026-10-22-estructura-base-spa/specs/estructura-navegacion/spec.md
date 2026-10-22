# Spec Delta

## Purpose

Capacidad que define el esqueleto de la aplicación de una sola página del parcial 1 de Programación III
(librería): punto de entrada único `index.html` con las cinco secciones de vista y su navegación por hash,
estructura de carpetas de la entrega, organización modular del JavaScript en módulos que exponen un contrato
público independiente del mecanismo de enlace y separación de responsabilidades en las hojas de estilo, todo sin
dependencias externas ni paso de compilación.

## ADDED Requirements

### Requirement: Punto de entrada único en la raíz de la entrega
La entrega SHALL tener exactamente un punto de entrada HTML, `index.html`, en la raíz de la carpeta, que se
pueda abrir con doble clic desde el sistema de archivos, sin `npm install`, sin servidor local y sin paso de
compilación.

#### Scenario: Apertura por doble clic
- **WHEN** el evaluador hace doble clic sobre `index.html` en el explorador de archivos
- **THEN** el navegador abre la aplicación y el documento se renderiza desde `file://` sin pedir instalación ni servidor

#### Scenario: Ausencia de artefactos de compilación
- **WHEN** se recorre la raíz de la carpeta entregada
- **THEN** no existen `package.json`, `package-lock.json`, `node_modules/` ni `dist/`

### Requirement: Identidad del documento
El documento SHALL declarar `lang="es"` y un `<title>` que identifique la aplicación como "Librería — Catálogo,
clientes y ventas", y SHALL declarar el charset UTF-8 y el viewport adaptable.

#### Scenario: Metadatos del documento
- **WHEN** se inspecciona el elemento `<html>` de `index.html`
- **THEN** su atributo `lang` vale `es` y el `<title>` del documento es "Librería — Catálogo, clientes y ventas"

### Requirement: Estructura semántica del documento
`index.html` SHALL contener un `<header>` con la identidad de la librería, un `<nav>` con la navegación entre las
vistas y un `<main>` que contiene el contenido principal, usando etiquetas semánticas nativas y sin reconstruirlas
con ARIA.

#### Scenario: Regiones semánticas presentes
- **WHEN** se inspecciona el árbol de `index.html`
- **THEN** existen exactamente un `<header>`, un `<nav>` y un `<main>`, y el `<main>` contiene las cinco secciones de vista

#### Scenario: Identidad de la librería en el encabezado
- **WHEN** se lee el contenido textual del `<header>`
- **THEN** en él figura el nombre de la librería como texto visible

### Requirement: Secciones de vista ocultas por defecto
El `<main>` SHALL contener cinco elementos `<section>`, uno por vista, con los identificadores `vista-catalogo`,
`vista-libros`, `vista-clientes`, `vista-ventas` y `vista-historial`, y cada uno SHALL llevar el atributo `hidden`
en el HTML entregado, de modo que solo una vista puede estar visible a la vez.

#### Scenario: Secciones identificables
- **WHEN** se consultan los `<section>` hijos de `<main>`
- **THEN** son exactamente cinco y sus identificadores son `vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas` y `vista-historial`

#### Scenario: Estado inicial oculto
- **WHEN** se inspecciona el atributo `hidden` de cada `<section>` en el HTML entregado
- **THEN** los cinco lo tienen presente, por lo que ninguna vista aparece visible al abrir la página

### Requirement: Un único encabezado de primer nivel por vista
Cada `<section>` de vista SHALL contener exactamente un `<h1>` propio que identifique la vista, y el documento
SHALL NOT contener ningún otro `<h1>` fuera de esas secciones, sin saltos en la jerarquía de encabezados.

#### Scenario: Encabezado por vista
- **WHEN** se cuentan los elementos `<h1>` de cada una de las cinco secciones
- **THEN** cada sección contiene exactamente un `<h1>` y el total del documento es cinco

### Requirement: Barra de navegación con las cinco rutas
El `<nav>` SHALL contener cinco elementos `<a href>` —uno por vista— con los destinos `#/catalogo`, `#/libros`,
`#/clientes`, `#/ventas` y `#/historial`, con texto visible que describa la vista, y cada destino SHALL
corresponder al identificador de una de las cinco secciones de vista.

#### Scenario: Enlaces de navegación presentes
- **WHEN** se listan los enlaces del `<nav>`
- **THEN** son cinco, con `href` iguales a `#/catalogo`, `#/libros`, `#/clientes`, `#/ventas` y `#/historial`, y con texto visible

#### Scenario: Correspondencia entre enlace y sección
- **WHEN** se resuelve cada `href` de navegación contra los identificadores de las secciones
- **THEN** cada enlace apunta a una sección existente de la vista correspondiente

#### Scenario: Activación de un enlace
- **WHEN** el usuario activa un enlace de la barra de navegación con el teclado o con el puntero
- **THEN** el hash del documento pasa a ser el destino del enlace sin recargar la página

### Requirement: Estructura de carpetas de la entrega
La carpeta entregada SHALL contener las carpetas `css/`, `js/`, `js/vistas/` y `assets/img/`, además de `docs/`,
`knowledge-base/` y `openspec/`, y SHALL NOT contener recursos ni carpetas ajenos al alcance del parcial.

#### Scenario: Carpetas presentes
- **WHEN** se listan las carpetas de primer nivel de la entrega
- **THEN** existen `css`, `js`, `js/vistas`, `assets/img`, `docs`, `knowledge-base` y `openspec`

### Requirement: Cero recursos remotos y cero dependencias
Ninguna regla, script, hoja de estilos, imagen o fuente de la entrega SHALL referenciar un recurso remoto, y el
proyecto SHALL NOT incluir framework, librería, CDN, fuente remota, backend, API, base de datos ni variables de
entorno.

#### Scenario: Ausencia de referencias remotas
- **WHEN** se buscan referencias a `http://`, `https://`, `//cdn` o `fonts.` en `index.html` y en los archivos de `css/` y `js/`
- **THEN** no se encuentra ninguna coincidencia

#### Scenario: Ausencia de dependencias de terceros
- **WHEN** se inspecciona el código de `js/` y `css/`
- **THEN** no hay `import` de paquetes externos, no hay `fetch` ni llamadas de red, y no hay scripts que apunten a un CDN

### Requirement: Separación entre estructura, estilos y comportamiento
`index.html` SHALL NOT contener hojas de estilos en línea ni lógica de negocio en línea; todos los estilos
SHALL residir en archivos externos de `css/` y todo el comportamiento SHALL residir en módulos de `js/`, cargados
desde el documento.

#### Scenario: Documento sin estilos en línea
- **WHEN** se inspecciona `index.html`
- **THEN** no hay elementos `<style>` ni atributos `style` con contenido de maquetación, y los tres archivos de `css/` están enlazados con `<link rel="stylesheet">`

#### Scenario: Comportamiento en scripts externos
- **WHEN** se inspecciona `index.html`
- **THEN** todos los elementos `<script>` llevan atributo `src` y referencian archivos de `js/` cargados en orden de dependencia, con `js/app.js` como última entrada, y ninguno contiene lógica de negocio en línea

### Requirement: Organización modular del comportamiento
El código de `js/` SHALL estar organizado en módulos, uno por responsabilidad declarada, y cada módulo SHALL
exponer su contrato público —los nombres de función acordados— a través de un namespace único, de modo que el
contrato no dependa del mecanismo de enlace.

#### Scenario: Módulos por responsabilidad
- **WHEN** se listan los archivos de `js/` y de `js/vistas/`
- **THEN** están los cinco módulos de `js/` (`app.js`, `datos.js`, `storage.js`, `validaciones.js`, `ui.js`) y los cinco módulos de vista (`catalogo.js`, `libros.js`, `clientes.js`, `ventas.js`, `historial.js`), cada uno con la responsabilidad declarada en su encabezado y su contrato público expuesto en el namespace

#### Scenario: Contrato público independiente del mecanismo de enlace
- **WHEN** se inspecciona el contrato público de cada módulo
- **THEN** los nombres de función coinciden con los acordados (`iniciar`, `montarVista`, `listarLibros`, `listarClientes`, `listarVentas`, `obtenerLibro`, `obtenerCliente`, `agregarLibro`, `agregarCliente`, `agregarVenta`, `suscribir`, `leerTodo`, `hidratar`, `guardarLibros`, `guardarClientes`, `guardarVentas`, `validarLibro`, `validarCliente`, `validarVenta`, `normalizarIsbn`, `normalizarEmail`, `calcularSubtotal`, `calcularTotal`, `crearElemento`, `crearTabla`, `mostrarMensaje`, `mostrarErrores`, `moverFoco`, `enfocarPrimerError`, `formatearMonto`, `formatearFecha`, `normalizarTitulo`, `esVacio`, `render`) y son los mismos con independencia del mecanismo de enlace

#### Scenario: Aislamiento de responsabilidades
- **WHEN** se inspecciona el contenido de cada módulo
- **THEN** ningún módulo contiene dos de las responsabilidades declaradas y ninguno excede un tamaño razonable para una responsabilidad única

### Requirement: Separación de responsabilidades de las hojas de estilo
La entrega SHALL distribuir los estilos en tres hojas externas: `css/base.css` con el reset, los tokens de
diseño, la tipografía y el layout; `css/componentes.css` con las tarjetas, formularios, botones, tablas, badges
y mensajes; y `css/vistas.css` con los detalles específicos de cada vista.

#### Scenario: Tres hojas de estilo
- **WHEN** se listan los archivos de `css/`
- **THEN** son `base.css`, `componentes.css` y `vistas.css`, y los tres están enlazados desde `index.html`

#### Scenario: Reparto de contenidos
- **WHEN** se revisa el contenido de cada hoja
- **THEN** las reglas de cada hoja corresponden a su responsabilidad declarada, sin duplicar reglas de otra

### Requirement: Tokens de diseño centralizados
`css/base.css` SHALL definir en `:root` los tokens semánticos de color, tipografía y espaciado, y las hojas de
componentes y de vistas SHALL referenciarlos mediante `var(--...)` sin escribir valores hexadecimales sueltos en
los selectores de componentes.

#### Scenario: Tokens definidos y referenciados
- **WHEN** se busca la declaración de tokens en `css/base.css` y las referencias `var(--` en `css/componentes.css` y `css/vistas.css`
- **THEN** los tokens están declarados en `:root` y los componentes los consumen a través de `var(--...)`

### Requirement: Apertura por doble clic sin bloqueo por CORS
La aplicación SHALL cargar su punto de entrada y mostrar la estructura de vistas al abrirse con doble clic sobre
`file://` en Chrome y Firefox, sin errores de CORS en la consola. La variante de enlace SHALL ser la que la
verificación en navegador determine; si el navegador bloqueara los módulos ES bajo `file://`, el proyecto SHALL
usar la alternativa de scripts clásicos con IIFE contemplada en `knowledge-base/02_descripcion_general.md §Stack
tecnológico`.

#### Scenario: Carga en navegador de escritorio
- **WHEN** se abre `index.html` con doble clic en Chrome y en Firefox
- **THEN** el documento carga su script de entrada, las cinco secciones y la barra de navegación están presentes y no hay error de CORS en la consola

#### Scenario: Navegador que bloquea los módulos ES bajo file://
- **WHEN** el navegador usado bloquea la carga de módulos ES bajo `file://`
- **THEN** el proyecto usa la alternativa de scripts clásicos con IIFE, cada módulo publica su contrato en un namespace único, y la aplicación sigue cargando sin errores en consola

### Requirement: README de entrega presente en la raíz
La carpeta entregada SHALL incluir un `README.md` en la raíz con la información obligatoria de la entrega
(RN-ENT-02): responsables, pasos para abrir sin npm, navegación entre vistas, funcionalidades implementadas y
pendientes, ubicación de los datos iniciales, funcionamiento y límites de `localStorage` y procedencia de
imágenes ajenas.

#### Scenario: Archivo presente
- **WHEN** se abre la raíz de la carpeta entregada
- **THEN** existe `README.md` en la raíz de la carpeta entregada
