# Preguntas Abiertas

> **Modo ingestión (Mode A): no se hicieron preguntas.** Este documento es el canal donde quedan registradas todas las ambigüedades detectadas en la fuente, con un **default propuesto** para que la implementación pueda avanzar sin esperar respuestas.
> Prioridad: **Alta** = puede cambiar el resultado de un caso manual o de la evaluación · **Media** = afecta consistencia o experiencia de uso · **Baja** = cosmético o FUTURE-proofing.

## Inconsistencias detectadas

### IN-01 — Importes "con dos decimales" vs. importes esperados escritos sin decimales
**Documento A dice** (Ejercicio 5): *"los importes se presentan con dos decimales"*.
**Documento B dice** (caso manual nº 5): *"Subtotales 3000 y 2000; total 5000"*.
**Impacto**: se podría dudar entre mostrar `3000` o `3000.00`. Es un detalle de presentación, pero el docente compara contra lo que ve en pantalla.
**Resolución propuesta**: mostrar **siempre con dos decimales** (`3000.00`, `2000.00`, `5000.00`). Los valores "3000" y "3000.00" son el mismo número; el README registra el resultado del caso manual con el formato real mostrado (con decimales) y aclara la equivalencia.

### IN-02 — Persistencia obligatoria vs. precio de catálogo que el docente modifica a mano
**Documento A dice** (Ejercicio 6): *"En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales."*
**Documento B dice** (caso manual nº 6): el docente modifica *"únicamente el precio del libro dentro del catálogo guardado en localStorage"* y recarga; luego consulta el historial y los importes deben conservarse.
**Impacto**: si la aplicación **re-siembra** el catálogo en cada arranque, el precio modificado por el docente se pierde al recargar y la comprobación del caso nº 6 queda **sin conclusividad** (o directamente contradictoria). Es la inconsistencia más relevante de la consigna.
**Resolución propuesta**: la siembra es **condicional a que la clave de `localStorage` no exista** (DD-08). Con la clave presente, el contenido guardado es el que manda. Además, el `README.md` documenta las claves y la estructura para que el procedimiento sea reproducible (RN-ENT-03).

### IN-03 — Persistencia exigida solo para 3 de las 6 colecciones del modelo
**Documento A dice** (Ejercicio 3): el modelo tiene libros, editoriales, géneros, autores y clientes.
**Documento B dice** (Ejercicio 6): *"Se utiliza localStorage para conservar libros, clientes y ventas."*
**Impacto**: quedan 3 colecciones (editorial, género, autor) sin destino de persistencia definido. Si viven solo en el seed en memoria, se crea una segunda fuente de verdad para los selectores.
**Resolución propuesta**: persistir las 6 (DD-03). El requisito mínimo de la consigna se cumple íntegro y se documenta la tabla de claves. El procedimiento del docente sigue tocando solo el precio de un libro.

### IN-04 — "Sin espaciar exterior" en email vs. "sin espacios ni guiones" en ISBN
**Documento A dice** (clientes): el email se compara *"sin espacios exteriores y sin distinguir mayúsculas de minúsculas"*.
**Documento B dice** (ISBN): *"el ISBN se compara sin espacios ni guiones"*.
**Impacto**: una normalización única para ambos campos rompería uno de los dos criterios.
**Resolución propuesta**: dos funciones de normalización separadas y explícitas (DD-05): `normalizarIsbn()` quita espacios y guiones; `normalizarEmail()` quita solo espacios exteriores. Ambos pasan a minúsculas.

### IN-05 — Búsqueda vacía vs. búsqueda con solo espacios
**Documento A dice**: *"Una búsqueda vacía muestra todo el catálogo"* y *"elimina espacios sobrantes en los extremos de la búsqueda"*.
**Documento B dice**: el caso manual nº 1 prueba *"búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente"*.
**Impacto**: no queda claro si "   " (solo espacios) debe mostrar todo el catálogo o un mensaje de sin resultados.
**Resolución propuesta**: se aplica `trim()` primero; si el resultado es vacío, se muestra **todo el catálogo** (mismo criterio que la búsqueda vacía). Es la lectura más coherente con el texto.

### IN-06 — Requisito de "al menos un autor" vs. selector de múltiples autores
**Documento A dice**: *"autores mediante un selector múltiple o controles de selección equivalentes"* y *"Se selecciona al menos un autor"*.
**Documento B dice**: cada libro se relaciona con *"uno o más autores existentes"*.
**Impacto**: bajo. Solo exige que la interfaz permita elegir más de un autor y que no se permita confirmar con cero.
**Resolución propuesta**: `<select multiple>` con al menos una opción preseleccionada, más validación que rechaza la selección vacía.

### IN-07 — "No se exige editar ni eliminar" vs. "no se editan"
**Documento A dice** (libros y clientes): *"No se exige editar ni eliminar registros"*; (ventas): *"Las ventas confirmadas no se editan ni eliminan desde la interfaz"*.
**Documento B dice** (entregables): *"funcionalidades implementadas y pendientes"*.
**Impacto**: para libros y clientes, "no se exige" es una decisión de alcance (se puede omitir); para ventas, "no se editan" es una prohibición explícita que además se comprueba en el caso manual nº 6.
**Resolución propuesta**: en libros y clientes **no** se implementan edición ni borrado (se documentan como "pendientes / fuera de alcance"); en ventas, la ausencia de esas acciones es **obligatoria** y además se evita toda función de borrado en el código. El README lista explícitamente ambos casos en "funcionalidades implementadas y pendientes".

### IN-08 — "Cada libro se relaciona con una editorial existente" vs. el seed con exactamente 2 editoriales
**Documento A dice**: el seed tiene al menos 2 editoriales; cada libro se relaciona con una editorial existente.
**Documento B dice**: no se administra el CRUD de editoriales.
**Impacto**: bajo. Ninguna.
**Resolución propuesta**: el seed usa las 2 editoriales en los 6 libros, para que ambas sean visibles en el catálogo.

### IN-09 — El precio histórico se congela "al confirmar" (texto) vs. "al agregar el renglón" (implementación)
**Documento A dice**: *"Al confirmar, se registra un identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico"*.
**Documento B dice**: la vista de Ventas muestra, en cada renglón, *"libro, cantidad, precio unitario y subtotal"* mientras se compone la venta.
**Impacto**: define qué precio se congela si el catálogo cambia **durante** la composición de la venta. El texto solo fija el resultado final (que el historial no relea el precio actual).
**Resolución propuesta**: congelar el precio al **agregar el renglón** (DD-04). El resultado exigido por la consigna se cumple idénticamente; además, el importe que el usuario ve mientras arma la venta no cambia bajo sus ojos. Registrado también como P-04.

## Preguntas abiertas (priorizadas)

| # | Prioridad | Pregunta | Bloquea | Decisor | Default propuesto (para poder avanzar) |
|---|-----------|---------|---------|---------|------------------------------------------|
| P-01 | Alta | ¿Qué formato de identificador espera el docente para libros, clientes y ventas? | Roadmap de modelo de datos | Docente | `LIB-001`, `CLI-001`, `VEN-001` (prefijo + correlativo de 3 dígitos, DD-06). Documentado en el README. |
| P-02 | Alta | ¿Qué claves de `localStorage` y qué estructura de JSON espera el docente para poder reproducir la comprobación del precio histórico? | Cierre del parcial | Docente | Una clave por colección con prefijo `libreria.` (`libreria.libros`, `libreria.clientes`, `libreria.ventas`, …) y arrays de objetos; la tabla de claves y la estructura de un libro y de una venta se documentan textualmente en el README (DD-07). |
| P-03 | Alta | ¿En qué formato exacto se muestran los importes (símbolo de moneda, separador de miles, posición del símbolo)? | Cierre del parcial | Docente | Número con dos decimales, sin símbolo: `3000.00`. La consigna no define moneda (SU-01, DD-10). |
| P-04 | Alta | ¿El precio unitario de un renglón se congela al agregar el renglón o al confirmar la venta? | Implementación de Ventas | Docente | Al **agregar el renglón** (DD-04). No contradice el texto y evita que el importe cambie en pantalla durante la composición. |
| P-05 | Media | ¿Cómo debe representarse la fecha de una venta (formato, zona horaria, orden del historial)? | Implementación de Ventas e Historial | Docente | Se guarda ISO 8601 UTC (`2026-10-22T14:35:00.000Z`) y se muestra en formato local legible; el historial ordena de más reciente a más antiguo (SU-04, DD-10). |
| P-06 | Media | ¿En qué orden deben mostrarse el catálogo y el listado de libros? | Implementación de catálogo | Docente | Por título ascendente, con desempate por `id` (SU-02). |
| P-07 | Media | ¿El cliente se identifica con un solo campo de nombre completo o con nombre y apellido separados? | Modelo de datos | Docente | Un solo campo "Nombre y apellido", porque la consigna dice que no se requiere campo de apellido separado (RN-CLI-01). |
| P-08 | Media | ¿Debe haber una pantalla o acción para editar el precio de un libro? | Alcance | Docente | **No.** La consigna dice explícitamente "No se exige una pantalla para editar precios". El precio se cambia a mano desde las herramientas de almacenamiento (DD-08). |
| P-09 | Media | ¿Qué ocurre con los registros "huérfanos" (por ejemplo, una venta cuyo cliente o libro fue borrado del store)? | Robustez del historial | Equipo técnico | No se borra nada desde la interfaz, así que no puede haber huérfanos. Aun así, el historial se renderiza desde el **snapshot** de la venta (DD-09), de modo que sigue siendo legible aunque falte el origen. |
| P-10 | Media | ¿Se permite limpiar los datos guardados (reiniciar el catálogo)? | Cierre | Docente | No hay botón de "reiniciar" en la interfaz. Para empezar de cero, el docente borra las claves `libreria.*` desde las herramientas del navegador; el README documenta ese procedimiento. |
| P-11 | Media | ¿Hay límite de cantidad para las ventas o para el número de registros? | Alcance | Docente | No hay límite artificial. `localStorage` tiene un límite de cuota del navegador; el README advierte que si se supera, la escritura falla y la app lo informa (RN-PER-01). |
| P-12 | Baja | ¿El formato de email de la validación debe ser "formato" estricto o con expresión regular laxa? | Implementación de validaciones | Equipo técnico | Expresión regular laxa pero con dominio y TLD: `^[^\s@]+@[^\s@]+\.[^\s@]+$`. El `type="email"` del navegador es la primera barrera; el mensaje de error es textual. |
| P-13 | Baja | ¿El título de la librería y el nombre de los autores pueden ser nombres reales de obras o autores existentes? | Contenido del seed | Docente | **No**: todo es ficticio (títulos, autores, editoriales inventados) y los emails usan `example.com`, dominio reservado (SU-07, DD-02). |
| P-14 | Baja | ¿Se requieren imágenes de portada en el catálogo? | Implementación de catálogo | Docente | No. Se resuelven con CSS y SVG inline local; así no hay imágenes ajenas que licenciar (DD-11). |
| P-15 | Baja | ¿Dónde se documenta la procedencia de imágenes ajenas si el docente igual pide usarlas? | Cierre | Docente | Sección "Imágenes y recursos" del README, con autor, licencia y URL de origen; con el default propuesto, la sección queda en "no se utilizan imágenes de terceros". |

## Notas sobre los campos de discovery

Los seis campos de `kb.discovery` del archivo `.active-orchestrator-state.json` (**problem**, **system_type**, **domain**, **scale**, **stack**, **needs_infra**) se inferieron **con confianza alta** a partir del texto de la consigna, sin necesidad del bloque de baja confianza del contrato de estado:

| Campo | Valor inferido | Evidencia en la consigna |
|-------|----------------|--------------------------|
| `problem` | Presentar el catálogo de una librería y registrar libros, clientes y ventas en el navegador, sin backend | "El proyecto representa una librería que presenta su catálogo y registra libros, clientes y ventas… los datos y las operaciones se simulan en el navegador" |
| `system_type` | `web_app` | Interfaz web en HTML/CSS/JS, abierta en el navegador, sin API ni servidor |
| `domain` | `library_retail` | Catálogo de libros, clientes y ventas; sin pagos ni facturación fiscal |
| `scale` | `single_user` | "no comparte información entre usuarios"; sin login; datos por perfil de navegador |
| `stack` | HTML5 + CSS3 + JavaScript nativo + `localStorage` | "Se utilizan únicamente HTML, CSS y JavaScript nativos" |
| `needs_infra` | `false` | Sin Docker, base de datos, Redis, colas, cron ni despliegue |

No hay ninguna entrada `[DISCOVERY]` pendiente. La sección `discovery` de nivel superior del archivo de estado contiene `{"skipped": true}` (no se ejecutó la fase de discovery de mercado), por lo que no aportó ningún valor a inferir.
