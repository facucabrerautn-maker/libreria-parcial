# Visión y Objetivos

> **Fuente única**: `docs/consigna-extraida.txt` (texto extraído de *Consigna Primer Parcial* — Programación III, Tecnicatura Universitaria en Programación, Unidad "HTML, CSS y JavaScript").
> **Alcance versionado**: `v1.0` — Parcial 1 (Ejercicios 1 a 6, 100 puntos).
> **Modo de elaboración**: ingestión silenciosa de fuentes (Mode A). Nada de lo que sigue es inventado: lo que la consigna no dice está registrado como supuesto en [09](09_decisiones_y_supuestos.md) o como pregunta abierta en [10](10_preguntas_abiertas.md).

## Propósito del sistema

Construir el frontend de una librería que **presenta su catálogo y registra libros, clientes y ventas**, simulando en el navegador toda la lógica de datos y de negocio, sin depender de un backend real.

El proyecto es un ejercicio académico de la Unidad "HTML, CSS y JavaScript". La consigna parte del TP backend de Programación III del otro docente y desarrolla **exclusivamente el frontend**: los datos y las operaciones se simulan en el navegador. El propósito no es producción sino demostrar dominio de tres cosas concretas:

1. **HTML semántico y CSS propio** para una interfaz de sistema real (no una maqueta estática).
2. **Correspondencia entre formularios, listados, navegación y entidades** (Libro, Editorial, Género, Autor, Cliente, Venta, Renglón).
3. **JavaScript nativo** para representar datos locales, modificar el DOM y responder a eventos, con validaciones de entrada y comportamiento comprobable mediante casos manuales reproducibles.

El resultado esperado es una carpeta entregable que se abre con doble clic en `index.html` —sin npm, sin build, sin dependencias— y que un docente pueda auditar por sí mismo, incluida la prueba más delicada: que **una venta confirmada conserva sus importes históricos aunque el precio del catálogo cambie**.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|-------|--------------------|----------------------|
| **Equipo de desarrollo** (estudiantes de Programación III) | Entregar un frontend completo y evaluable del parcial 1 que cumpla el alcance técnico y la rúbrica de 100 puntos | Usar solo HTML, CSS y JavaScript nativos; mantener separación entre estructura, estilos y comportamiento; código legible, nombres comprensibles y funciones acotadas; documentar en el `README.md` los resultados **observados** de los 8 casos manuales |
| **Operador de mostrador** (usuario de la aplicación durante la demostración) | Consultar el catálogo, cargar libros y clientes, y registrar ventas de forma clara y sin fricción | Encontrar cualquier libro por título; recibir feedback inmediato de cada error de validación; ver el detalle de una venta con sus renglones e importes; no perder lo cargado al recargar la página |
| **Docente evaluador** (Prof. Matías Torres, revisor de la unidad) | Verificar que el sistema funciona y que la documentación permite reproducir las comprobaciones | Navegar entre las 5 vistas sin ayuda; ejecutar los 8 casos manuales; inspeccionar `localStorage` y comprobar por su cuenta que el precio unitario de una venta confirmada es un valor histórico; confirmar que no hay librerías, frameworks ni CDNs |

## Alcance v1.0

Lo que el sistema **sí** hace en esta versión, alineado a los 6 ejercicios de la consigna:

- **Estructura y navegación (Ej. 1 — 20 pts)**: `index.html` como entrada; 5 vistas navegables (Catálogo, Libros, Clientes, Ventas, Historial); encabezado, navegación y contenido principal con etiquetas semánticas; etiqueta asociada a cada campo; botones con texto que describe la acción; tablas con encabezados; mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- **Presentación y adaptabilidad (Ej. 2 — 20 pts)**: identidad visual propia y coherente (colores, tipografía, espaciado, tarjetas, formularios, botones) en CSS externo; uso de Flexbox o Grid; legibilidad y ausencia de desplazamiento horizontal de página a 320 px y a 1280 px; tabla ancha con desplazamiento dentro de su propio contenedor; foco visible y recorrido por teclado; errores expresados con texto y no solo con color; texto alternativo en imágenes informativas.
- **Datos locales, catálogo y filtro (Ej. 3 — 15 pts)**: libros, editoriales, géneros, autores y clientes como arrays y objetos con identificadores estables; conjunto inicial mínimo (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes); catálogo generado por JavaScript desde el array de libros; filtro por título que ignora mayúsculas/minúsculas, busca coincidencias parciales y recorta espacios sobrantes; búsqueda vacía muestra todo el catálogo; búsqueda sin coincidencias muestra un mensaje claro; inserción de datos de usuario como texto en el DOM.
- **Altas de libros y clientes (Ej. 4 — 15 pts)**: formulario de alta de libros (título, ISBN, precio, editorial, género, autores) con selectores generados desde los datos locales y opción «Sin clasificar»; formulario de alta de clientes (nombre completo, email); conjunto completo de validaciones; control del envío con `preventDefault`; errores mostrados cerca del formulario; alta efectiva solo si todas las comprobaciones pasan; actualización del listado y de las opciones relacionadas sin recargar la página.
- **Venta simulada e historial (Ej. 5 — 20 pts)**: selección de cliente, composición de renglones, cambio de cantidades y eliminación de renglones antes de confirmar; cálculo de subtotales y total con dos decimales; bloqueo de ventas sin cliente, sin renglones o con cantidades inválidas; control de libros repetidos dentro de la misma venta; confirmación con identificador, fecha, cliente, renglones y total; historial consultable con detalle de renglones e inmutable desde la interfaz.
- **Persistencia, verificación y documentación (Ej. 6 — 10 pts)**: persistencia en `localStorage` de libros, clientes y ventas; carga inicial de ejemplos sin duplicarlos al reabrir; `README.md` con responsables, pasos para abrir sin npm, navegación, funcionalidades implementadas y pendientes, ubicación de los datos iniciales, funcionamiento y límites de `localStorage`, resultados observados de los 8 casos manuales y procedencia de imágenes ajenas.

## Fuera de alcance

Explícitamente **no** se construye en este parcial:

- **Backend, API, base de datos, servidor o conexión con el backend** del TP del otro docente.
- **Inicio de sesión real** ni cualquier esquema de autenticación/autorización.
- **Gestión de stock** (no hay control de existencias ni validación de quantities contra inventario).
- **Cobros ni facturación fiscal** (la venta produce un total simulado, sin pagos, sin comprobantes, sin impuestos).
- **Edición o eliminación de ventas confirmadas** desde la interfaz.
- **CRUD de editoriales, géneros o autores**: solo se consultan; no se dan de alta, no se editan, no se eliminan.
- **Edición o eliminación de libros ni de clientes**: solo se registran y se listan.
- **Librerías, frameworks, CDNs de CSS o JavaScript, dependencias instaladas o herramientas de compilación**. Su uso incumple el alcance técnico y se informa en la evaluación.
- **Multiusuario real, sincronización, backup o migración de datos**: los datos viven en el navegador y no se comparten entre usuarios.
- **Dígito de control de ISBN**, normalización de códigos de barras u otros estándares de la industria.

## Métricas de éxito

| Métrica | Objetivo | Cómo se verifica |
|---------|----------|------------------|
| Puntos de rúbrica | 100 / 100 | Rúbrica oficial: HTML 20, CSS 20, Datos y catálogo 15, Altas 15, Ventas 20, Cierre 10 |
| Casos manuales | 8 de 8 **ejecutados** y registrados con el resultado observado | Tabla de casos en el `README.md`; no se declara aprobado lo que no se ejecutó |
| Cumplimiento del alcance técnico | 0 librerías, 0 frameworks, 0 CDNs, 0 dependencias, 0 build | Revisión de la estructura de carpetas y del `README.md` |
| Apertura sin herramientas | Doble clic en `index.html` funciona sin npm ni servidor | Paso a paso documentado en el `README.md` |
| Adaptabilidad | Sin desplazamiento horizontal de página a 320 px ni a 1280 px | Verificación manual en ambos anchos |
| Accesibilidad | Foco visible, recorrido completo por teclado, errores con texto | Verificación manual con teclado |
| Integridad histórica | El precio unitario, los subtotales y el total de una venta confirmada no cambian al modificar el precio del catálogo | Caso manual nº 6, guiado por el docente sobre el `localStorage` |
| Consistencia documental | La ubicación y la estructura del catálogo guardado están documentadas para que el docente reproduzca la comprobación | Sección correspondiente del `README.md` |
