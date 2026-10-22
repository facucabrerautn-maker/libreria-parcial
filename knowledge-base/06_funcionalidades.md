# Funcionalidades

> **Fuente**: `docs/consigna-extraida.txt` — ejercicios 1 a 6 y rúbrica de evaluación.
> Cada historia se traza a su ejercicio, a los puntos de la rúbrica y a las reglas `RN-*` del [05](05_reglas_de_negocio.md). Los criterios de aceptación son verificables por inspection del código o por los casos manuales.

## Mapa de épicas

| Épica | Nombre | Ejercicio y bloque de rúbrica | Puntos | US |
|-------|--------|------------------------------|--------|----|
| E1 | Estructura, vistas y navegación HTML | 1 — vistas y navegación (10) + semántica, formularios y estados (10) | 20 | US-001 … US-004 |
| E2 | Presentación CSS, adaptabilidad y accesibilidad | 2 — coherencia y organización (8) + adaptación (8) + accesibilidad básica (4) | 20 | US-005 … US-008 |
| E3 | Datos locales, catálogo y filtro | 3 — modelo y ejemplos (5) + renderizado (5) + filtro y estados (5) | 15 | US-009 … US-012 |
| E4 | Alta de libros | 4 — libros y selectores (6) | 6 | US-013 … US-015 |
| E5 | Alta de clientes | 4 — clientes (4) | 4 | US-016 … US-018 |
| E6 | Venta simulada | 5 — composición y validaciones (8) + cálculos (5) | 13 | US-019 … US-023 |
| E7 | Historial e inmutabilidad | 5 — confirmación e historial inmutable (7) | 7 | US-024 … US-027 |
| E8 | Persistencia | 6 — persistencia (4) | 4 | US-028 … US-030 |
| E9 | Verificación y documentación de la entrega | 6 — pruebas manuales registradas (3) + documentación y entrega (3) | 6 | US-031 … US-034 |

> El bloque **"validación y actualización" (5 puntos)** del Ejercicio 4 es transversal a E4 y E5: se cubre en `RN-LIB-03`, `RN-LIB-05`, `RN-CLI-02` y `RN-CLI-03`. La suma de la columna "Puntos" da 95 y los 5 restantes son ese bloque compartido → **100 puntos**.

Total: **34 historias de usuario** mapeadas a los 100 puntos de la rúbrica.

---

## Épica 1: Estructura, vistas y navegación HTML (Ejercicio 1 — 20 pts)

### US-001 — Punto de entrada único
**Como** evaluador
**Quiero** abrir la aplicación con un único `index.html`
**Para** no depender de servidor, build ni herramientas de compilación.

**Criterios de aceptación**
- [ ] CA-1: existe `index.html` en la raíz de la carpeta entregada y funciona con doble clic.
- [ ] CA-2: el documento declara `lang="es"` y un `<title>` identificativo.
- [ ] CA-3: no hay `package.json`, `node_modules` ni paso de compilación.

**Reglas relacionadas**: RN-ALC-01, RN-ENT-01

### US-002 — Navegación clara entre las cinco vistas
**Como** evaluador
**Quiero** pasar de una vista a otra desde una barra de navegación
**Para** recorrer la aplicación sin ayuda externa.

**Criterios de aceptación**
- [ ] CA-1: existen las vistas **Catálogo, Libros, Clientes, Ventas e Historial**, todas alcanzables desde la navegación.
- [ ] CA-2: la vista activa se distingue visualmente **y** se marca en el DOM (`aria-current="page"`).
- [ ] CA-3: la navegación se opera completamente con teclado y con foco visible.

**Reglas relacionadas**: RN-ACC-01, RN-ACC-05

### US-003 — Estructura semántica y formularios accesibles
**Como** evaluador
**Quiero** que la interfaz use HTML semántico y etiquetas bien asociadas
**Para** navegar con lector de pantalla y entender la estructura de un vistazo.

**Criterios de aceptación**
- [ ] CA-1: existen `<header>`, `<nav>` y `<main>` con contenido significativo.
- [ ] CA-2: cada control de formulario tiene un `<label for>` asociado.
- [ ] CA-3: cada botón describe su acción en el texto visible (no solo un ícono).
- [ ] CA-4: cada tabla tiene `<thead>` con `<th>` y `<tbody>` con celdas `<td>`.

**Reglas relacionadas**: RN-ACC-02

### US-004 — Estados y mensajes
**Como** evaluador
**Quiero** ver mensajes claros en los estados sin datos y en los errores
**Para** saber si la aplicación falló o simplemente no hay información.

**Criterios de aceptación**
- [ ] CA-1: cada listado muestra un mensaje propio cuando está vacío.
- [ ] CA-2: la búsqueda sin resultados muestra un mensaje distinto del de "catálogo vacío".
- [ ] CA-3: las operaciones aceptadas y rechazadas emiten un mensaje de resultado visible.
- [ ] CA-4: los mensajes de error se expresan con texto, no solo con color.

**Reglas relacionadas**: RN-CAT-04, RN-ACC-02, RN-ACC-05, RN-EX-03

---

## Épica 2: Presentación CSS, adaptabilidad y accesibilidad (Ejercicio 2 — 20 pts)

### US-005 — Identidad visual propia
**Como** evaluador
**Quiero** una interfaz con apariencia propia y coherente
**Para** que el trabajo no parezca un ejercicio genérico.

**Criterios de aceptación**
- [ ] CA-1: existen variables o tokens de color, tipografía y espaciado definidos de forma centralizada.
- [ ] CA-2: tarjetas, formularios, botones y tablas comparten clases reutilizables.
- [ ] CA-3: el CSS vive en archivos externos bajo `css/`.

**Reglas relacionadas**: RN-ACC-03

### US-006 — Layout con Flexbox o Grid
**Como** evaluador
**Quiero** un layout construido con Flexbox o Grid
**Para** verificar el objetivo de la unidad de maquetación.

**Criterios de aceptación**
- [ ] CA-1: el layout principal usa `display: flex` o `display: grid`.
- [ ] CA-2: no hay posicionamiento absoluto como mecanismo de maquetación.
- [ ] CA-3: el CSS no depende de librerías ni de CDN.

**Reglas relacionadas**: RN-ACC-03, RN-ACC-04, RN-ALC-01

### US-007 — Adaptabilidad a 320 px y 1280 px
**Como** evaluador
**Quiero** usar la aplicación en un móvil angosto y en una pantalla ancha
**Para** comprobar que nada se desborda ni se vuelve ilegible.

**Criterios de aceptación**
- [ ] CA-1: a 320 px no hay desplazamiento horizontal de la página.
- [ ] CA-2: a 1280 px el contenido se limita a un ancho máximo cómodo y mantiene jerarquía visual.
- [ ] CA-3: los textos y controles siguen siendo legibles en ambos anchos.
- [ ] CA-4: las tablas anchas se desplazan **dentro de su propio contenedor**, no en la página.

**Reglas relacionadas**: RN-ACC-04

### US-008 — Accesibilidad básica
**Como** usuario de teclado o lector de pantalla
**Quiero** foco visible, recorrido por teclado e imágenes con texto alternativo
**Para** poder operar la aplicación sin ratón.

**Criterios de aceptación**
- [ ] CA-1: ningún control pierde el indicador de foco.
- [ ] CA-2: el orden de tabulación recorre la vista de forma lógica.
- [ ] CA-3: las imágenes informativas tienen `alt`; las decorativas tienen `alt=""`.
- [ ] CA-4: los errores se identifican por texto y, además, se asocian programáticamente al campo (por ejemplo `aria-describedby`).

**Reglas relacionadas**: RN-ACC-05, RN-EX-03

---

## Épica 3: Datos locales, catálogo y filtro (Ejercicio 3 — 15 pts)

### US-009 — Modelo de datos con identificadores estables
**Como** evaluador
**Quiero** que el dominio esté modelado con arrays y objetos con identificadores estables
**Para** poder seguir las relaciones entre entidades.

**Criterios de aceptación**
- [ ] CA-1: existen colecciones de libros, editoriales, géneros, autores y clientes.
- [ ] CA-2: cada registro tiene un `id` único y estable.
- [ ] CA-3: las relaciones entre libros y autores/editorial/género se resuelven por id.

**Reglas relacionadas**: RN-DAT-01, RN-DAT-03, RN-DAT-04

### US-010 — Conjunto inicial mínimo
**Como** evaluador
**Quiero** arrancar con datos de ejemplo suficientes
**Para** ver todas las vistas con contenido realista desde el primer momento.

**Criterios de aceptación**
- [ ] CA-1: hay al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.
- [ ] CA-2: al menos un libro no tiene género asignado.
- [ ] CA-3: al menos un libro tiene más de un autor.

**Reglas relacionadas**: RN-DAT-02

### US-011 — Renderizado del catálogo
**Como** operador
**Quiero** ver el catálogo generado por JavaScript
**Para** recorrer las obras disponibles.

**Criterios de aceptación**
- [ ] CA-1: cada libro muestra **título, ISBN, editorial, género, autores y precio**.
- [ ] CA-2: los libros sin género muestran «Sin clasificar».
- [ ] CA-3: el catálogo se construye a partir del array de libros, no desde HTML fijo.

**Reglas relacionadas**: RN-CAT-01, RN-CAT-04, RN-DAT-05

### US-012 — Filtro por título
**Como** operador
**Quiero** buscar por parte del título, sin importar mayúsculas ni espacios
**Para** encontrar rápido una obra.

**Criterios de aceptación**
- [ ] CA-1: la búsqueda ignora mayúsculas/minúsculas y encuentra coincidencias parciales.
- [ ] CA-2: los espacios sobrantes en los extremos de la búsqueda se eliminan.
- [ ] CA-3: una búsqueda vacía muestra todo el catálogo.
- [ ] CA-4: una búsqueda sin coincidencias muestra un mensaje claro.

**Reglas relacionadas**: RN-CAT-02, RN-CAT-03, RN-CAT-04

---

## Épica 4: Alta de libros (Ejercicio 4 — 6 pts dentro del bloque "Libros y selectores")

### US-013 — Formulario de alta de libros con selectores relacionados
**Como** operador
**Quiero** cargar un libro eligiendo editorial, género y autores desde listas
**Para** no escribir datos que no existen.

**Criterios de aceptación**
- [ ] CA-1: el formulario tiene título, ISBN, precio, editorial, género y autores.
- [ ] CA-2: editorial y género se eligen con `<select>`; autores con selector múltiple o controles equivalentes.
- [ ] CA-3: las opciones se generan desde los datos locales, no están fijas en el HTML.
- [ ] CA-4: el selector de género incluye «Sin clasificar».

**Reglas relacionadas**: RN-LIB-01, RN-LIB-02, RN-DAT-05

### US-014 — Validaciones del alta de libros
**Como** operador
**Quiero** que el formulario rechace datos inválidos con un mensaje claro
**Para** no cargar libros inconsistentes.

**Criterios de aceptación**
- [ ] CA-1: se rechazan título vacío, ISBN vacío, ISBN duplicado, precio no numérico y precio ≤ 0.
- [ ] CA-2: se rechaza la ausencia de autores y la selección de autores o editorial inexistentes.
- [ ] CA-3: un género asignado debe existir; sin género es válido.
- [ ] CA-4: el ISBN se compara sin espacios ni guiones.
- [ ] CA-5: ningún registro se agrega si alguna comprobación falla.

**Reglas relacionadas**: RN-LIB-03, RN-LIB-04, RN-EX-01, RN-EX-04

### US-015 — Feedback y actualización sin recarga
**Como** operador
**Quiero** ver el error junto al formulario y ver el libro nuevo en las listas
**Para** confirmar la carga sin recargar la página.

**Criterios de aceptación**
- [ ] CA-1: los errores se muestran cerca del formulario.
- [ ] CA-2: el envío se controla con `preventDefault`.
- [ ] CA-3: tras el alta, el listado de Libros y el catálogo se actualizan.
- [ ] CA-4: tras el alta, el selector de libros de Ventas incluye el libro nuevo.
- [ ] CA-5: tras el alta se emite un mensaje de resultado.

**Reglas relacionadas**: RN-LIB-05, RN-CLI-03, RN-EX-03

---

## Épica 5: Alta de clientes (Ejercicio 4 — 4 pts dentro del bloque "Clientes")

### US-016 — Formulario de alta de clientes
**Como** operador
**Quiero** registrar un cliente con nombre completo y email
**Para** poder venderle.

**Criterios de aceptación**
- [ ] CA-1: el formulario tiene nombre completo y email, sin campo de apellido separado.
- [ ] CA-2: el campo de email usa `type="email"`.

**Reglas relacionadas**: RN-CLI-01

### US-017 — Validaciones del alta de clientes
**Como** operador
**Quiero** que no se repitan clientes ni se acepten emails inválidos
**Para** mantener el padroneo consistente.

**Criterios de aceptación**
- [ ] CA-1: se rechazan nombre vacío y email vacío.
- [ ] CA-2: se rechaza un email con formato inválido.
- [ ] CA-3: se rechaza un email duplicado, comparado sin espacios exteriores y sin distinguir mayúsculas/minúsculas.

**Reglas relacionadas**: RN-CLI-02, RN-EX-01

### US-018 — Actualización del padroneo
**Como** operador
**Quiero** ver el cliente nuevo en el listado y en el selector de Ventas
**Para** venderle sin recargar.

**Criterios de aceptación**
- [ ] CA-1: el listado de Clientes muestra el alta sin recargar.
- [ ] CA-2: el selector de cliente de Ventas incluye el alta sin recargar.
- [ ] CA-3: tras el alta se emite un mensaje de resultado.

**Reglas relacionadas**: RN-CLI-03, RN-LIB-05

---

## Épica 6: Venta simulada (Ejercicio 5 — 13 pts dentro de "Composición y validaciones" + "Cálculos")

### US-019 — Selección de cliente y de libros
**Como** operador
**Quiero** elegir un cliente y agregar libros con cantidad
**Para** armar una venta.

**Criterios de aceptación**
- [ ] CA-1: el cliente se elige de un selector alimentado con los clientes existentes.
- [ ] CA-2: el libro se elige de un selector alimentado con los libros existentes.
- [ ] CA-3: la cantidad es un entero mayor que cero.

**Reglas relacionadas**: RN-VEN-01, RN-CLI-03, RN-LIB-05

### US-020 — Control de duplicados en la misma venta
**Como** operador
**Quiero** saber que no puedo cargar dos veces el mismo libro
**Para** no duplicar renglones por error.

**Criterios de aceptación**
- [ ] CA-1: al agregar un libro ya presente, se modifica la cantidad del renglón existente **o** se informa el duplicado.
- [ ] CA-2: nunca existen dos renglones con el mismo `libroId` en una venta.

**Reglas relacionadas**: RN-VEN-02

### US-021 — Edición del borrador de venta
**Como** operador
**Quiero** cambiar cantidades y quitar renglones antes de confirmar
**Para** corregir la venta antes de registrarla.

**Criterios de aceptación**
- [ ] CA-1: la cantidad de un renglón es editable mientras la venta no está confirmada.
- [ ] CA-2: un renglón se puede quitar mientras la venta no está confirmada.

**Reglas relacionadas**: RN-VEN-03

### US-022 — Cálculo de subtotales y total
**Como** operador
**Quiero** ver el subtotal de cada renglón y el total de la venta
**Para** saber cuánto suma.

**Criterios de aceptación**
- [ ] CA-1: cada renglón muestra libro, cantidad, precio unitario y subtotal.
- [ ] CA-2: subtotal = cantidad × precio unitario.
- [ ] CA-3: total = suma de subtotales.
- [ ] CA-4: todos los importes se presentan con dos decimales.

**Reglas relacionadas**: RN-VEN-04

### US-023 — Bloqueo de confirmaciones inválidas
**Como** operador
**Quiero** que no se confirme una venta incompleta
**Para** no ensuciar el historial con ventas sin sentido.

**Criterios de aceptación**
- [ ] CA-1: no se puede confirmar sin cliente.
- [ ] CA-2: no se puede confirmar sin renglones.
- [ ] CA-3: no se puede confirmar con cantidades cero, negativas o decimales.
- [ ] CA-4: el motivo del bloqueo se comunica de forma explícita.

**Reglas relacionadas**: RN-VEN-05, RN-EX-01

---

## Épica 7: Historial e inmutabilidad (Ejercicio 5 — 7 pts de "Confirmación e historial inmutable")

### US-024 — Confirmación y registro de la venta
**Como** operador
**Quiero** confirmar la venta y verla registrada
**Para** tener un historial consultable.

**Criterios de aceptación**
- [ ] CA-1: la venta guardada tiene identificador, fecha, cliente, renglones y total.
- [ ] CA-2: la confirmación limpia el formulario para una nueva venta.
- [ ] CA-3: la confirmación muestra un mensaje de resultado.

**Reglas relacionadas**: RN-VEN-06, RN-HIS-03

### US-025 — Consulta del historial y su detalle
**Como** evaluador
**Quiero** listar las ventas y abrir el detalle de cada una
**Para** auditar lo que se registró.

**Criterios de aceptación**
- [ ] CA-1: el historial muestra identificador, fecha, cliente y total.
- [ ] CA-2: desde el historial se pueden consultar los renglones de cada venta.
- [ ] CA-3: el historial se alimenta de los datos locales, no de un array paralelo en memoria.

**Reglas relacionadas**: RN-HIS-01, RN-PER-01

### US-026 — Precio unitario histórico
**Como** evaluador
**Quiero** que el detalle de una venta muestre el precio que se confirmó, no el precio actual del catálogo
**Para** comprobar que la venta confirmada es un registro inmutable.

**Criterios de aceptación**
- [ ] CA-1: el renglón guarda una copia del precio unitario en el momento de la confirmación.
- [ ] CA-2: el historial no vuelve a leer el precio del catálogo para calcular ni mostrar importes.
- [ ] CA-3: al modificar el precio del libro guardado y recargar, la venta mantiene precio unitario, subtotales y total.
- [ ] CA-4: la venta conserva también los datos descriptivos necesarios para leerla (título, ISBN, autores, editorial).

**Reglas relacionadas**: RN-VEN-07, RN-HIS-02

### US-027 — Ventas confirmadas inmutables
**Como** evaluador
**Quiero** que las ventas confirmadas no se puedan modificar ni borrar desde la interfaz
**Para** garantizar la integridad del historial.

**Criterios de aceptación**
- [ ] CA-1: el historial no ofrece acciones de edición ni de borrado.
- [ ] CA-2: ninguna función de la interfaz elimina registros de `libreria.ventas`.

**Reglas relacionadas**: RN-HIS-02, RN-EX-04

---

## Épica 8: Persistencia (Ejercicio 6 — 4 pts)

### US-028 — Guardado en `localStorage`
**Como** operador
**Quiero** que los datos sobrevivan a la recarga
**Para** no perder lo cargado.

**Criterios de aceptación**
- [ ] CA-1: libros, clientes y ventas se guardan en `localStorage`.
- [ ] CA-2: cada colección tiene una clave propia y documentada.

**Reglas relacionadas**: RN-PER-01

### US-029 — Carga inicial sin duplicar ejemplos
**Como** evaluador
**Quiero** que los ejemplos aparezcan solo en el primer inicio
**Para** que recargar no genere registros repetidos.

**Criterios de aceptación**
- [ ] CA-1: en el primer inicio se cargan los ejemplos.
- [ ] CA-2: al reabrir, se recuperan los registros guardados sin duplicar los ejemplos.
- [ ] CA-3: recargar después de altas y de una venta no duplica ni ejemplos ni ventas.

**Reglas relacionadas**: RN-PER-02

### US-030 — Límites del almacenamiento documentados
**Como** lector del `README.md`
**Quiero** entender hasta dónde llega el alcance de `localStorage`
**Para** no esperar sincronización, portabilidad ni garías de integridad.

**Criterios de aceptación**
- [ ] CA-1: el README explica que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura.
- [ ] CA-2: el README explica que no se comparte información entre usuarios.

**Reglas relacionadas**: RN-PER-03, RN-ALC-04

---

## Épica 9: Verificación y documentación de la entrega (Ejercicio 6 — 6 pts)

### US-031 — Casos manuales ejecutados y registrados
**Como** docente
**Quiero** leer el resultado observado de los 8 casos manuales
**Para** verificar el comportamiento sin repetir cada prueba desde cero.

**Criterios de aceptación**
- [ ] CA-1: el README contiene una tabla con los 8 casos y su resultado.
- [ ] CA-2: si un caso falla o queda pendiente, se registra el comportamiento real.
- [ ] CA-3: no se declara aprobada ninguna prueba que no se haya ejecutado.

**Reglas relacionadas**: RN-ENT-03

### US-032 — Ubicación y estructura del catálogo guardado
**Como** docente
**Quiero** saber dónde está el catálogo guardado y cómo está estructurado
**Para** reproducir la comprobación del precio histórico.

**Criterios de aceptación**
- [ ] CA-1: el README nombra la clave (o las claves) de `localStorage` donde vive el catálogo.
- [ ] CA-2: el README describe la estructura del registro de libro y de la venta.
- [ ] CA-3: el README describe el procedimiento para modificar únicamente el precio del libro y recargar.

**Reglas relacionadas**: RN-ENT-03, RN-VEN-07

### US-033 — README completo de entrega
**Como** docente
**Quiero** un README con toda la información obligatoria
**Para** evaluar la entrega sin pedir aclaraciones.

**Criterios de aceptación**
- [ ] CA-1: identifica a quienes realizan el trabajo.
- [ ] CA-2: pasos para abrir `index.html` sin npm.
- [ ] CA-3: navegación entre vistas.
- [ ] CA-4: funcionalidades implementadas y pendientes.
- [ ] CA-5: ubicación de los datos iniciales.
- [ ] CA-6: funcionamiento y límites de `localStorage`.
- [ ] CA-7: procedencia de imágenes ajenas, si existen.

**Reglas relacionadas**: RN-ENT-01, RN-ENT-02

### US-034 — Separación de estructura, estilos y comportamiento
**Como** docente
**Quiero** una entrega legible y ordenada
**Para** valorar la calidad del código.

**Criterios de aceptación**
- [ ] CA-1: HTML, CSS y JavaScript están en archivos separados.
- [ ] CA-2: los nombres de funciones y variables son comprensibles.
- [ ] CA-3: las funciones tienen responsabilidades acotadas.
- [ ] CA-4: la carpeta se puede abrir y usar sin instalar nada.

**Reglas relacionadas**: RN-ACC-03, RN-ENT-01, RN-ALC-01
