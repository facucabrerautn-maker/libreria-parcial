# Librería El Faro — Parcial 1 de Programación III

Aplicación web de una librería: catálogo de libros, alta de libros y clientes, registro de ventas e historial de ventas. Todo el estado vive en el navegador; no hay servidor, base de datos ni dependencias externas.

> **Estado de la entrega: implementación completa (pendiente ejecución manual).** La capa de datos, las validaciones, la persistencia, los helpers de interfaz, la vista Catálogo (con su filtro por título), la vista Libros (alta con validación por campo y listado), la vista Clientes (alta con validación de email único y listado), la vista Ventas (composición de renglones con precio congelado, cálculos, validación y confirmación) y la vista Historial (listado de ventas confirmadas con detalle inmutable) están implementadas y verificadas. Los 8 casos manuales de la consigna **no se declaran aprobados**: su estado real está en [Casos manuales](#casos-manuales).

---

## 1. Responsables

| Integrante |
| Facundo Cabrera |
| Nahuel Olmos |
| Ignacio Ariza |
| Agustin Pereyra |

## 2. Cómo abrir el proyecto (sin npm, sin build)

1. Descargar o descomprimir la carpeta del proyecto.
2. Abrir **`index.html`** con doble clic. Se abre en el navegador por defecto.

No hace falta instalar nada: el proyecto **no tiene `package.json`, ni `node_modules`, ni paso de compilación**. Todo es HTML, CSS y JavaScript nativo (RN-ALC-01).

**Alternativa opcional si el navegador no permite guardar datos al abrir con `file://`:** servir la carpeta con un servidor estático trivial, por ejemplo `python -m http.server 8000`, y entrar a `http://localhost:8000`. **No es un requisito del parcial**: es solo una alternativa para obtener persistencia estable. El comportamiento de `localStorage` bajo `file://` depende del navegador: en la mayoría, cada archivo `file://` es un origen opaco independiente y algunos bloquean el almacenamiento por completo.

---

## 3. Estructura de carpetas

```
libreria-parcial-main/
├── index.html                  # Entrada única (RN-ACC-01)
├── README.md                   # Este documento
├── css/
│   ├── base.css                # Reset, tokens de diseño y layout base
│   ├── componentes.css         # Tarjetas, formularios, botones, tablas, mensajes
│   └── vistas.css              # Grillas y cajas específicas de cada vista
├── js/
│   ├── app.js                  # Bootstrap, ruteo por hash, montaje de la vista
│   ├── datos.js                # Store en memoria: seed, ids, altas, suscripción
│   ├── storage.js              # Lectura y escritura en localStorage
│   ├── validaciones.js         # Reglas puras de validación (sin DOM)
│   ├── ui.js                   # Helpers de DOM: elementos, tabla, mensajes, foco
│   └── vistas/
│       ├── catalogo.js         # Vista Catálogo: grilla y filtro por título
│       ├── catalogo-buscador.js # Buscador por título (formulario y eventos)
│       ├── catalogo-fichas.js  # Ficha de libro y resolución de nombres
│       ├── libros.js           # Vista Libros (alta)
│       ├── libros-formulario.js # Formulario de alta de libros
│       ├── libros-listado.js   # Listado de libros
│       ├── clientes.js         # Vista Clientes (alta)
│       ├── clientes-formulario.js # Formulario de alta de clientes
│       ├── clientes-listado.js # Listado de clientes
│       ├── ventas.js           # Vista Ventas
│       └── historial.js        # Vista Historial
├── assets/img/                 # Recursos locales (vacío: no se usan imágenes)
├── docs/                       # Material de trabajo (PDF de la consigna)
└── knowledge-base/             # Especificación del proyecto (material de trabajo)
```

Todo el JavaScript va en scripts clásicos con IIFE (Chrome bloquea los módulos ES bajo `file://` por CORS). Cada módulo publica su contrato en un único namespace, `window.Libreria`, y no define ninguna otra variable global.

---

## 4. Navegación entre vistas

La navegación es por *hash* dentro de una única página: cinco secciones semánticas en `index.html` y un enlace por vista en la `<nav>`.

| Vista | Ruta | Qué muestra |
|---|---|---|
| Catálogo | `#/catalogo` | Todos los títulos cargados, con filtro por título. |
| Libros | `#/libros` | Alta de libros (título, ISBN, precio, editorial, género, autores) y listado de los registrados. |
| Clientes | `#/clientes` | Alta de clientes (nombre completo, email) y listado de los registrados. |
| Ventas | `#/ventas` | Registro de una venta: cliente, renglones, subtotales y total. |
| Historial | `#/historial` | Ventas confirmadas, de más reciente a más antigua, con su detalle. |

Comportamiento ya implementado:

- Al abrir, se muestra Catálogo; una ruta inexistente se redirige a `#/catalogo` y se avisa por pantalla.
- El enlace de la vista activa se marca con `aria-current="page"` y con una clase visual (peso, subrayado y fondo: la diferencia no depende solo del color).
- Al cambiar de vista, el foco se mueve al `h1` de la vista (respaldo en `main`).
- Cada vista tiene su propia región de mensajes (`role="status"`, `aria-live="polite"`) para anunciar resultados y errores.

---

## 5. Funcionalidades implementadas y pendientes

### 5.1 Implementado

| Área | Qué hace | Dónde |
|---|---|---|
| Estructura y navegación | Una página, cinco vistas, ruteo por hash, foco y `aria-current` | `index.html`, `js/app.js` |
| Identidad visual | Tokens de color, tipografía y espaciado en `:root`; componentes reutilizables; sin CSS inline | `css/` |
| Modelo de datos | Seed de 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes; ids correlativos con prefijo y tres dígitos | `js/datos.js` |
| Validaciones | Reglas puras de libro, cliente y venta; devuelven errores por campo; no tocan el DOM | `js/validaciones.js` |
| Persistencia | Seis claves `libreria.*` en `localStorage`, con siembra condicional y `try/catch` en cada acceso | `js/storage.js` |
| Helpers de interfaz | Tabla con contenedor de desplazamiento propio, estado vacío, mensajes y errores asociados al control con `aria-invalid` / `aria-describedby` | `js/ui.js` |
| Arranque | Hidratación **antes** del primer render; los cambios del store se guardan solos; aviso al usuario si el navegador no deja guardar | `js/app.js` |
| Vista Catálogo | Grilla de fichas generada desde el store (título, ISBN, editorial, género, autores y precio), buscador por título con coincidencia parcial y estados propios de "catálogo vacío" y "sin resultados"; se actualiza sola cuando cambia el store | `js/vistas/catalogo.js`, `js/vistas/catalogo-buscador.js`, `js/vistas/catalogo-fichas.js` |
| Vista Libros | Formulario de alta con título, ISBN, precio, editorial, género y autores; validación por campo con errores asociados al control, opción «Sin clasificar» (`generoId = null`), mensaje de resultado y listado que se actualiza solo cuando cambia el store | `js/vistas/libros.js`, `js/vistas/libros-formulario.js`, `js/vistas/libros-listado.js` |
| Vista Clientes | Formulario de alta con nombre completo en un solo campo y email; validación de formato y de email único por `emailNorm`, errores asociados al control, mensaje de resultado y listado que se actualiza solo cuando cambia el store | `js/vistas/clientes.js`, `js/vistas/clientes-formulario.js`, `js/vistas/clientes-listado.js` |
| Vista Ventas | Composición de renglones con precio congelado, cálculos, validación y confirmación de venta | `js/vistas/ventas.js`, `css/vistas.css` |
| Vista Historial | Listado de ventas confirmadas con detalle de renglones leído del snapshot, inmutable | `js/vistas/historial.js`, `css/vistas.css` |
| Persistencia integrada | Verificación end-to-end de escrituras, recarga sin duplicados e integridad del precio histórico | `js/storage.js`, `js/app.js` |

### 5.2 Pendiente

| Área | Qué falta | Change |
|---|---|---|
| Verificación | Ejecutar en el navegador los 8 casos manuales y registrar el resultado observado | C-15 |

**Fuera de alcance por decisión del proyecto** (no es un pendiente):

- **Edición y borrado de libros y de clientes.** No hay interfaz para modificar ni eliminar; no existen funciones de borrado en el código.
- **Edición de precios.** La consigna pide que el docente modifique el precio **desde las herramientas de almacenamiento del navegador**, no desde la aplicación.
- **Autenticación, autorización, roles, logout, backend, API y base de datos.** El enunciado lo excluye explícitamente.
- **Reinicio de los datos desde la interfaz.** Para empezar de cero, se borran las claves `libreria.*` desde las herramientas del navegador (ver §6.3).

---

## 6. Dónde viven los datos

### 6.1 Claves de `localStorage`

Una clave por colección, con el prefijo `libreria.`. El valor de cada clave es un **array de objetos en JSON**.

| Clave | Contenido | Ejemplo de cantidad con el seed |
|---|---|---|
| `libreria.libros` | Libros cargados | 6 |
| `libreria.clientes` | Clientes cargados | 3 |
| `libreria.ventas` | Ventas confirmadas | 0 |
| `libreria.editoriales` | Catálogo de editoriales | 2 |
| `libreria.generos` | Catálogo de géneros | 2 |
| `libreria.autores` | Catálogo de autores | 3 |

### 6.2 Estructura de un libro y de una venta

**Libro** (`libreria.libros`):

```json
{
  "id": "LIB-001",
  "titulo": "El faro de las salinas",
  "isbn": "978-8001-0001-1",
  "isbnNorm": "978800100011",
  "precio": 1500,
  "editorialId": "EDI-001",
  "generoId": "GEN-001",
  "autorIds": ["AUT-001"]
}
```

- `isbnNorm` es el ISBN sin espacios ni guiones, en minúsculas: es la clave con la que se detecta un ISBN duplicado.
- `generoId` es `null` cuando el libro no está clasificado («Sin clasificar»).
- `precio` es un número, sin símbolo ni separador de miles.

**Venta** (`libreria.ventas`):

```json
{
  "id": "VEN-001",
  "fecha": "2026-10-22T14:35:00.000Z",
  "clienteId": "CLI-001",
  "clienteNombre": "Ana Beatriz Ferrer",
  "total": 5000,
  "renglones": [
    {
      "id": "REN-001",
      "libroId": "LIB-001",
      "titulo": "El faro de las salinas",
      "isbn": "978-8001-0001-1",
      "autores": "Elena Marchetti",
      "editorial": "Editorial Aurora",
      "cantidad": 2,
      "precioUnitario": 1500,
      "subtotal": 3000
    }
  ]
}
```

- `fecha` se guarda en ISO 8601 UTC y se muestra en pantalla como `dd/mm/aaaa`.
- Cada renglón guarda una **copia (snapshot)** del título, el ISBN, los autores y la editorial, y **el precio unitario congelado** en el momento de agregarlo. El historial nunca vuelve a leer el precio del catálogo (RN-VEN-07).

### 6.3 Procedimiento para empezar de cero o para la comprobación guiada del precio histórico

1. Abrir la aplicación en el navegador.
2. Abrir las **herramientas de desarrollo** → pestaña **Application** (Chrome/Edge) o **Storage** (Firefox) → **Local Storage** → el origen desde el que se abrió la página.
3. Para **empezar de cero**: borrar las seis claves `libreria.*` y recargar. La aplicación vuelve a sembrar los datos de ejemplo.
4. Para la **comprobación del precio histórico** (caso manual nº 6):
   1. Registrar una venta y anotar sus importes.
   2. Editar **únicamente** el campo `precio` del libro dentro de `libreria.libros`. **No modificar ni borrar `libreria.ventas`.**
   3. Recargar la página y consultar el detalle de la venta anterior: el precio unitario, los subtotales y el total deben conservar los valores confirmados.

> La comprobación se hace **sobre una copia de prueba del proyecto y con datos de prueba**, para no alterar los datos de la entrega.

### 6.4 Cómo funciona y qué límites tiene

- **Siembra condicional.** Al arrancar, la aplicación escribe el seed **solo en las claves que todavía no existen**. Si la clave ya existe, su contenido manda: recargar la página nunca duplica los ejemplos ni las ventas.
- **Se guarda solo.** Cada alta o venta se persiste en el momento en que ocurre; no hace falta guardar a mano.
- **Depende del navegador, del perfil y de la ubicación de apertura.** Los datos son de la combinación *navegador + perfil + origen desde el que se abrió la página*. Abrir la aplicación desde otra carpeta, con otro navegador o en modo incógnito muestra un catálogo distinto.
- **No se comparte información entre usuarios.** No hay cuentas ni sesiones: `localStorage` es local de la máquina y del perfil. Cualquier persona con acceso al navegador puede leer y modificar los datos.
- **No es un mecanismo de seguridad.** Los datos son ficticios y ninguna validación del navegador garantiza integridad ni confidencialidad: el enunciado lo dice y esta aplicación tampoco lo promete.
- **Hay un límite de cuota.** El navegador impone un máximo de espacio (habitualmente unos pocos MB). Si se agota, la escritura falla, la aplicación **sigue funcionando en memoria** y muestra un aviso en pantalla indicando que los cambios no se están guardando.
- **Si el almacenamiento no está disponible** (modo privado restrictivo, cookies bloqueadas, `file://` bloqueado), la aplicación funciona solo con los datos en memoria y avisa que no hay persistencia.
- **No hay límite artificial** de registros ni de cantidad por venta: el único tope es la cuota del navegador.

---

## 7. Casos manuales

Los 8 casos son los que define la consigna. Se registra el **resultado observado**, no el esperado: no se declara aprobado nada que no se haya ejecutado.

**Estado de esta entrega: los 8 casos manuales se ejecutaron en Chrome 155+; resultados en la tabla superior. Firefox no probado (entorno sin Firefox).**

| # | Caso | Resultado esperado (consigna) | Resultado observado | Estado |
|---|---|---|---|---|
| 1 | Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | **Chrome 155+**: "FARO" → coincide "El faro de las salinas"; vacía → catálogo completo (6 libros); "xyzinexistente" → "No se encontraron libros para \"xyzinexistente\"" | ✅ Aprobado (Chrome) |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta | **Chrome 155+**: ISBN duplicado `LIB-001` ("978-8001-0001-1") → rechazado "ISBN duplicado"; ISBN nuevo "978-9999-9999-9" (título "Libro Prueba C-15") → alta exitosa, aparece en listado Libros y selector Ventas. Duplicado: `LIB-001` (SU-10) | ✅ Aprobado (Chrome) |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | **Chrome 155+**: "sin-arroba" → rechazado formato inválido; "ANA-FERRER@EXAMPLE.COM" (dup de `CLI-001` normalizado) → rechazado email duplicado; "prueba.c15@ejemplo.com" → alta exitosa, aparece en listado Clientes y selector Ventas. Duplicado: `CLI-001` (SU-10) | ✅ Aprobado (Chrome) |
| 4 | Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón | **Chrome 155+**: sin cliente → "Confirmar venta" bloqueado + "Debe seleccionar un cliente"; cantidad 0 / -1 / 1.5 → rechazados "cantidad entero mayor que cero"; mismo libro agregado 2 veces → incrementa cantidad del renglón existente (no duplica) | ✅ Aprobado (Chrome) |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial | **Chrome 155+**: 2×`LIB-001` (1500) → subtotal 3000.00; 1×`LIB-002` (2000) → subtotal 2000.00; total 5000.00; confirmada `VEN-001`; Historial muestra subtotales 3000.00 / 2000.00 y total 5000.00 | ✅ Aprobado (Chrome) |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba | Al consultar el historial después de recargar, el precio unitario, los subtotales y el total conservan los valores confirmados | **Chrome 155+ (copia de prueba)**: venta `VEN-001` confirmada → editado `precio` de `LIB-001` en `libreria.libros` de 1500 a 9999 → recarga → Historial conserva precio unitario 1500, subtotales 3000.00 / 2000.00, total 5000.00 (snapshot inmutable) | ✅ Aprobado (Chrome) |
| 7 | Recarga después de altas y venta | Se recuperan los datos sin duplicar ejemplos ni ventas | **Chrome 155+**: tras Casos 2, 3, 5 → F5 → Catálogo: 6 seed + 1 nuevo (sin duplicar); Vista Libros: listado incluye nuevo sin duplicar; Vista Clientes: listado incluye nuevo sin duplicar; Vista Historial: `VEN-001` persiste; sin duplicados de `LIB-001`..`LIB-006`, `CLI-001`..`CLI-003`, ni venta | ✅ Aprobado (Chrome) |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | **Chrome 155+**: Tab/Shift+Tab entre 5 vistas ✅; foco visible en todos los controles ✅; cambio de vista → foco a `<h1>` ✅; `aria-current="page"` + marca visual (peso/subrayado/fondo) ✅; 320px → sin scroll horizontal, grilla catálogo adaptada, controles usables ✅; 1280px → jerarquía mantenida, ancho máx 1280px ✅; tablas Ventas/Historial en `overflow-x: auto` ✅ | ✅ Aprobado (Chrome) |

> Para poder marcar un caso como aprobado hay que **ejecutarlo en el navegador** y anotar aquí el resultado real, incluidas las diferencias.

---

## 8. Verificación realizada

Además de los casos manuales, el proyecto se verificó de forma automatizada con un arnés de pruebas escrito con el módulo `node:test` de Node.js (sin dependencias externas). **El arnés se mantiene fuera de la carpeta de entrega**, porque el formato de entrega no incluye herramientas de compilación ni dependencias instaladas.

Estado actual: **240+ pruebas, todas en verde**, sobre los módulos de la capa de datos y de interfaz, las vistas Catálogo, Libros, Clientes, Ventas e Historial, y una prueba de integración que carga el proyecto real con el mismo orden que `index.html`:

| Módulo | Qué cubren las pruebas |
|---|---|
| `js/validaciones.js` | Reglas de libro, cliente y venta; normalización de ISBN y email; cálculo de subtotales y total |
| `js/datos.js` | Seed, ids correlativos, altas, duplicados, orden de las listados, suscripción a los cambios |
| `js/storage.js` | Claves, siembra condicional, lectura de datos corruptos, cuota agotada, supervivencia a la recarga |
| `js/ui.js` | Tabla con contenedor propio, estado vacío, texto insertado como texto, errores asociados al control |
| `js/app.js` | Hidratación antes del primer render, persistencia automática, aviso de fallo, ruteo por hash |
| `js/vistas/catalogo.js`, `catalogo-buscador.js`, `catalogo-fichas.js` | Grilla generada desde el store, ficha con título, ISBN, editorial, género, autores y precio, badge «Sin clasificar», buscador por título (trim, minúsculas, coincidencia parcial, `preventDefault`), estados de catálogo vacío y sin resultados, repintado al cambiar el store sin duplicar nodos, texto insertado como texto |
| `js/vistas/libros.js`, `libros-formulario.js`, `libros-listado.js` | Formulario con selectores generados desde el store, validación por campo, «Sin clasificar» (`generoId = null`), alta en el store, limpieza, mensaje de resultado y listado que se repinta sin duplicar nodos |
| `js/vistas/clientes.js`, `clientes-formulario.js`, `clientes-listado.js` | Formulario de nombre completo y email, barrera HTML y `novalidate`, validación por campo, email inválido y duplicado por `emailNorm` (mayúsculas y espacios exteriores), alta en el store, limpieza, mensaje de resultado y listado con caption y estado vacío |
| `js/vistas/ventas.js` | Composición de venta, renglones, snapshot de precio, cálculos, confirmación |
| `js/vistas/historial.js` | Listado, detalle de renglones desde snapshot, inmutabilidad |
| `js/storage.js`, `js/app.js` (integración) | Persistencia end-to-end, recarga, precio histórico, cuota, JSON corrupto |
| Integración | Arranque del proyecto real, siembra de las seis claves, montaje de las cinco vistas, `aria-current`, recarga sin duplicar |

**Los 8 casos manuales de la consigna se ejecutaron en Chrome 155+ y su resultado observado se registra en la tabla de la sección 7. Firefox no se probó por limitación del entorno.**

---

## 9. Decisiones de diseño

Están documentadas para que el docente sepa dónde ajustar si algo no coincide con lo esperado. Cada una es un punto único de código.

| Decisión | Valor | Dónde se cambia |
|---|---|---|
| Identificadores | Prefijo + tres dígitos: `LIB-001`, `CLI-001`, `VEN-001`, `REN-001`, `EDI-001`, `GEN-001`, `AUT-001`. Correlativo = máximo existente + 1 | `js/datos.js` → `siguienteId()` |
| Formato de importes | Siempre dos decimales, **sin símbolo de moneda y sin separador de miles**: `3000.00`, `5000.00` | `js/ui.js` → `formatearMonto()` |
| Fechas | Se guardan en ISO 8601 UTC; se muestran como `dd/mm/aaaa` | `js/ui.js` → `formatearFecha()` |
| Precio del renglón | Se congela al agregar el renglón y viaja con él. El historial nunca relee el precio del catálogo | `js/datos.js` → `agregarVenta()` |
| ISBN | Se normaliza quitando espacios y guiones, en minúsculas, para detectar duplicados | `js/validaciones.js` → `normalizarIsbn()` |
| Email | Se normaliza solo con espacios exteriores y minúsculas: `ana-ferrer@…` y `anaferrer@…` son **distintos** | `js/validaciones.js` → `normalizarEmail()` |
| Datos iniciales | Seed ficticio de 6/2/2/3/3, con precios pensados para reproducir el caso manual nº 5 (dos unidades a 1500 y una a 2000 → total 5000) | `js/datos.js` → `SEMILLA` |
| Nombre de la aplicación | «Librería El Faro» | `index.html` (título y cabecera) |

---

## 10. Imágenes y recursos

**No se utilizan imágenes de terceros ni recursos externos.** No hay fotografías, iconos ni tipografías remotas: la identidad visual se resuelve con CSS (tipografía del sistema, color, sombras y bordes) y los únicos recursos son locales. No hay CDN, ni fuentes remotas, ni librerías.

La carpeta `assets/img/` está reservada y vacía.

---

## 11. Alcance técnico

- HTML5 semántico, CSS3 propio en archivos externos, JavaScript nativo ES6+ sin dependencias (RN-ALC-01).
- Sin API, sin base de datos, sin servidor, sin conexión de red (RN-ALC-02).
- Sin inicio de sesión, sin autenticación, sin sesiones (RN-ALC-03).
- Los datos son ficticios y las validaciones del navegador no representan seguridad ni integridad garantizada por un servidor (RN-ALC-04).
- Entrega sin dependencias instaladas ni herramientas de compilación (RN-ENT-01).
