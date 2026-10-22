# Arquitectura Propuesta

> **Fuente**: `docs/consigna-extraida.txt` — "Contexto y alcance", Ejercicios 1 a 6 y "Formato de entrega".
> Restricción que manda sobre todo lo demás: **sin librerías, sin frameworks, sin CDN, sin build, sin backend**. Todo lo que sigue es compatible con abrir `index.html` con doble clic.

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|--------|---------------|---------|
| **SPA con enrutado por hash** | `js/app.js` + `<nav>` con `href="#/vista"` | Permite las 5 vistas con un único `index.html`, que es lo que pide el formato de entrega, y funciona sobre `file://` donde `fetch` está bloqueado por CORS. |
| **Separación estructura / estilos / comportamiento** | `index.html` + `css/` + `js/` | Requisito explícito de la consigna ("separación entre estructura, estilos y comportamiento") y de la rúbrica ("se valoran … separación"). |
| **Módulos ES nativos** | `js/**/*.js` con `import` / `export` y `<script type="module">` | Aísla responsabilidades sin bundler. `type="module"` implica `defer`: el DOM ya existe cuando corre el código. |
| **Store en memoria + capa de persistencia** | `js/datos.js` (estado) + `js/storage.js` (`localStorage`) | Separa "qué hay en pantalla" de "cómo se guarda". Permite re-renderizar sin volver a leer el almacenamiento en cada módulo. |
| **Funciones de validación puras** | `js/validaciones.js` | Reciben datos y contexto, devuelven errores por campo, no tocan el DOM. Fáciles de razonar y de probar, y son el lugar natural donde viven las reglas `RN-LIB-03`, `RN-CLI-02` y `RN-VEN-05`. |
| **Render declarativo por vista** | `js/vistas/*.js`, una función `render()` por vista | Cada módulo es autónomo; el estado se lee siempre del store, nunca se duplica en memoria de vista. |
| **Creación de nodos + `textContent`** | `js/ui.js` → `crearElemento(etiqueta, props, hijos)` | Los datos del usuario se insertan **como texto** (RN-DAT-05); nunca con `innerHTML`. |
| **Snapshot de valores inmutables** | Renglón guarda `precioUnitario`, `titulo`, `isbn`, `autores`, `editorial`; la Venta guarda `clienteNombre` | Convierte la venta confirmada en un registro histórico autosuficiente: sobrevive a los cambios del catálogo (RN-VEN-07). |
| **Modelo Single Source of Truth** | El store es la única copia en memoria; las vistas siempre leen de ahí | Evita que el catálogo, el selector de Ventas y el historial se desincronicen. |
| **Zona de mensajes por vista** | Un `div` con `role="status"` / `aria-live="polite"` por vista | Comunica operaciones correctas y rechazadas en texto (RN-ACC-02, RN-ACC-05). |

## Estructura de directorios

```
libreria-parcial/
├── index.html                    # Entrada única: header, nav, 5 secciones de vista
├── README.md                     # Entrega: autores, cómo abrir, vistas, implementado/pendiente,
│                                 #   datos iniciales, límites de localStorage, casos manuales
├── css/
│   ├── base.css                  # Reset, tokens (colores/tipografía/espaciado), tipografía, layout
│   ├── componentes.css           # Tarjetas, formularios, botones, tablas, badges, mensajes
│   └── vistas.css                # Detalles por vista (catálogo, ventas, historial)
├── js/
│   ├── app.js                    # Bootstrap: siembra, hash router, montaje de la vista
│   ├── datos.js                  # Seed + estado en memoria (store) + operaciones de dominio
│   ├── storage.js                # Wrapper de localStorage: leer, guardar, sembrar si no existe
│   ├── validaciones.js           # Funciones puras: validarLibro, validarCliente, validarVenta
│   ├── ui.js                     # Helpers: crearElemento, texto seguro, mensajes, foco, formato
│   └── vistas/
│       ├── catalogo.js           # Catálogo + buscador por título
│       ├── libros.js             # Formulario de alta + listado de libros
│       ├── clientes.js           # Formulario de alta + listado de clientes
│       ├── ventas.js             # Composición de venta + resumen + confirmación
│       └── historial.js          # Listado de ventas + detalle de renglones
├── assets/
│   └── img/                      # Recursos locales (imágenes propias o SVG inline); vacío si no se usan
├── docs/                         # Consigna original y su texto extraído (fuente de la KB, no parte funcional)
├── knowledge-base/               # Esta base de conocimiento
└── openspec/                     # Andamiaje de especificación (generado por el orquestador)
```

**Reglas de la estructura**:

- `index.html` no contiene estilos inline significativos ni scripts inline: todo vive en `css/` y `js/`.
- No hay `package.json`, `node_modules`, `package-lock.json`, ni carpeta `dist/`.
- `assets/` contiene **solo** recursos locales. Si se usan imágenes de terceros, la procedencia se declara en el `README.md` (RN-ENT-02). **Default propuesto**: no usar imágenes externas; resolvers con CSS y SVG inline, para no tener nada que licenciar.
- `docs/` y `knowledge-base/` son material de trabajo del proyecto; la evaluación se centra en `index.html`, `css/`, `js/`, `assets/` y `README.md`.

## Estrategia de renderizado por vista

Cada vista es una `<section>` dentro de `<main>`:

```html
<main>
  <section id="vista-catalogo" hidden> … </section>
  <section id="vista-libros"   hidden> … </section>
  <section id="vista-clientes" hidden> … </section>
  <section id="vista-ventas"   hidden> … </section>
  <section id="vista-historial" hidden> … </section>
</main>
```

- Solo una sección está visible a la vez; el atributo `hidden` controla la visibilidad.
- `app.js` resuelve el hash → id de sección → llama al `render()` del módulo correspondiente.
- Cada vista expone, como mínimo, un elemento `h1` propio y una región de mensajes con `aria-live`.

## Seguridad

- **Autenticación**: ninguna. No hay login, sesiones, tokens ni usuarios (RN-ALC-03). La consigna lo excluye explícitamente.
- **Autorización**: ninguna. Todas las vistas son públicas (ver [03](03_actores_y_roles.md#rutas-públicas)). Lo que *no* existe en la interfaz —editar o borrar ventas confirmadas, administrar editoriales/géneros/autores— se implementa **omitiendo** esas acciones, no ocultándolas con CSS.
- **Validación de input**: **dos capas**.
  1. *En el cliente, con `type` y atributos HTML*: `type="email"`, `type="number"`, `min`, `step="1"`, `required` — como primera barrera, no como única.
  2. *En JavaScript, con funciones puras* (`js/validaciones.js`): todas las reglas `RN-LIB-03`, `RN-CLI-02` y `RN-VEN-05`, con mensajes por campo.
  El `preventDefault` garantiza que la validación propia se ejecute siempre.
- **Prevención de XSS**: los datos del usuario se insertan **solo** como texto (`textContent` / `value`), nunca con `innerHTML` ni con `insertAdjacentHTML` sobre contenido dinámico (RN-DAT-05).
- **Protección del estado**: ninguna validación del navegador garantiza integridad; la propia consigna lo dice ("no representan seguridad ni integridad garantizada por un servidor"). Esto debe estar escrito en el `README.md` (RN-ALC-04).
- **Datos sensibles**: no hay. No se manejan credenciales, tarjetas, datos personales reales ni secretos. Los emails del seed usan el dominio reservado `example.com`.
- **Secrets management**: no aplica — no hay backend, ni variables de entorno, ni claves.

## Variables de entorno

**No aplica.** El proyecto no tiene configuración por entorno: no hay build, no hay servidor, no hay despliegue. No se usan variables de entorno, archivos `.env`, ni configuración por ambiente.

| Variable | Descripción | Ejemplo | Sensible |
|----------|-------------|---------|----------|
| — | Ninguna. Todo el comportamiento es idéntico en cualquier entorno. | — | — |

Los únicos "ajustes" posibles son constantes internas del código, si hiciera falta (por ejemplo el prefijo de las claves de `localStorage` o el nombre visible de la librería), que en cualquier caso son constantes de código, no configuración de despliegue.

## Accesibilidad — resumen de compromisos técnicos

| Requisito de la consigna | Compromiso técnico |
|--------------------------|---------------------|
| Foco visible | No se elimina el `outline` por defecto; se personaliza con `:focus-visible` manteniéndolo claramente contrastado. |
| Recorrido con teclado | Todos los controles son elementos nativos (`button`, `a`, `input`, `select`, `textarea`); nada de `div` con `onclick`. |
| Errores con texto, no solo color | Cada mensaje de error es texto y se asocia al campo con `aria-describedby`; el campo invalidado recibe `aria-invalid="true"`. |
| Etiquetas asociadas | Todo control de formulario tiene `<label for="id">`; los grupos (autores) usan `<fieldset>` + `<legend>`. |
| Tablas con encabezados | `<thead>` con `<th scope="col">` y `<caption>` cuando aporta contexto. |
| Estados vacíos | Cada lista tiene un mensaje propio, y ese mensaje se anuncia en la región `aria-live`. |
| Sin scroll horizontal a 320 px | Layout con Flexbox/Grid, `box-sizing: border-box`, imágenes con `max-width: 100%`, y tablas dentro de un contenedor `overflow-x: auto`. |
| Imágenes | `alt` descriptivo en las informativas; `alt=""` en las decorativas; ninguna imagen externa. |

## Modelo de despliegue

No hay despliegue. La entrega es una **carpeta o archivo comprimido** que el docente abre localmente.

- Doble clic en `index.html` → se abre en el navegador por defecto.
- Sin `npm install`, sin `npm start`, sin servidor local.
- El `README.md` documenta exactamente esos pasos (RN-ENT-02).

> **Advertencia operativa**: el comportamiento de `localStorage` bajo el protocolo `file://` **depende del navegador**. En la mayoría de navegadores cada archivo `file://` se trata como un origen opaco independiente, y algunos bloquean el almacenamiento en `file://`. Si el almacenamiento no está disponible, la app sigue funcionando en memoria y el `README.md` debe indicar la alternativa de servir la carpeta con un servidor estático trivial (por ejemplo `python -m http.server`), aclarando que **no es un requisito del parcial** sino una alternativa para el docente que quiera persistencia estable.
