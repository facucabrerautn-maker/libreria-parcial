# Actores y Roles

> **Fuente**: `docs/consigna-extraida.txt` — el documento **no define roles de negocio ni un modelo de autenticación**: dice explícitamente *"Tampoco se requiere un inicio de sesión real"*. Este documento traduce esa ausencia a un modelo coherente: un único rol operativo sin autenticación, más los actores de proceso (equipo de desarrollo y docente evaluador) que no interactúan con la app como usuarios differentiated.

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|-------|-------------|-----------------|
| **Operador de mostrador** | Única persona que usa la aplicación. Registra libros y clientes, arma ventas y consulta el historial. Es el "usuario" del sistema en el sentido funcional. | Navega entre Catálogo, Libros, Clientes, Ventas e Historial; carga datos con formularios; confirma ventas. **No se identifica ni se autentica**: el navegador no distingue quién opera. |
| **Equipo de desarrollo** | Estudiantes de Programación III que construyen y entregan el parcial. | Construyen la interfaz, ejecutan los 8 casos manuales y registran en el `README.md` los resultados **observados**. No son usuarios de la app en tiempo de ejecución. |
| **Docente evaluador** (Prof. Matías Torres, revisor de la unidad) | Quién evalúa el parcial: revisa la entrega, ejecuta los casos manuales y guía la comprobación del precio histórico. | Usa la app como un usuario más, pero además inspecciona `localStorage` con las herramientas del navegador y edita **únicamente el precio de un libro** del catálogo guardado para verificar la inmutabilidad histórica de una venta confirmada. |
| **Lector del `README.md`** | Quien recibe la entrega sin necesidad de ejecutarla (corrección, parcial posterior, revisión). | Encuentra la estructura de carpetas, los pasos para abrir sin npm, el mapa de vistas, el detalle de qué está implementado y qué quedó pendiente, la ubicación de los datos iniciales, los límites de `localStorage`, los resultados de los casos manuales y la procedencia de imágenes ajenas. |

### Actors no consideration

- **No hay actor "administrador" ni "vendedor" vs. "cliente"**: el cliente es una **entidad registrada** dentro del sistema (Cliente), no un actor con permisos.
- **No hay actor anónimo vs. autenticado**: no existe el concepto de sesión, token ni credencial.
- **No hay actor "sistema externo"**: no hay integraciones.

## RBAC — Matriz de permisos

La consigna no pide un sistema de roles. Sin embargo, la matriz de permisos es útil como **mapa de capacidades exigidas por la consigna** para el único rol operativo. Se documenta una sola columna de rol.

**Rol `operador`** (único rol, sin autenticación, aplica a todas las vistas):

| Recurso | Crear | Leer | Actualizar | Eliminar | Restricciones de la consigna |
|---------|-------|------|-----------|----------|--------------------------------|
| **Libro** | ✅ Alta por formulario (Ej. 4) | ✅ Catálogo + listado de Libros | ❌ No se exige editar | ❌ No se exige eliminar | ISBN único (comparado sin espacios ni guiones); precio numérico > 0; ≥1 autor; editorial y género (si se asigna) existentes |
| **Cliente** | ✅ Alta por formulario (Ej. 4) | ✅ Listado de Clientes + selector en Ventas | ❌ No se exige editar | ❌ No se exige eliminar | Email único (sin espacios exteriores, sin distinguir mayúsculas/minúsculas) y con formato válido |
| **Venta** | ✅ Composición y confirmación (Ej. 5) | ✅ Historial + detalle de renglones | ❌ **Prohibido**: las ventas confirmadas no se editan | ❌ **Prohibido**: las ventas confirmadas no se eliminan | Requiere cliente existente, ≥1 renglón, cantidad entera > 0, sin libros repetidos |
| **Renglón** | ✅ Se agrega dentro de una venta en curso | ✅ Visible en el resumen y en el detalle del historial | ✅ Cantidad modificable **solo antes de confirmar** | ✅ Se puede quitar **solo antes de confirmar** | El precio unitario queda congelado como valor histórico al confirmar |
| **Editorial** | ❌ No se administran | ✅ Solo lectura (selector + ficha del libro) | ❌ | ❌ | *"No se requiere administrar altas, bajas y modificaciones de editoriales, géneros o autores"* |
| **Género** | ❌ No se administran | ✅ Solo lectura (selector + ficha del libro) | ❌ | ❌ | Ídem |
| **Autor** | ❌ No se administran | ✅ Solo lectura (selector múltiple + ficha del libro) | ❌ | ❌ | Ídem |
| **Datos crudos del navegador** | ❌ No aplica | ✅ El docente los inspecciona y edita manualmente con las herramientas de almacenamiento | ⚠️ Solo como parte del procedimiento guiado de comprobación (modificar el precio de catálogo de un libro) | ⚠️ La propia consigna pide "sin modificar ni borrar las ventas guardadas" | Procedimiento documentado en el `README.md` |

**Permisos que la consigna prohíbe explícitamente** (y que el `README.md` debe reportar como no implementado):

- No hay alta, baja ni modificación de **editorial, género ni autor**.
- No hay edición ni eliminación de **libros ni clientes**.
- No hay edición ni eliminación de **ventas confirmadas**.

## Rutas públicas

**Todas las vistas son públicas.** No existe autenticación ni autorización, por lo que no hay rutas restringidas, redirecciones a login ni estados desautorizados.

| Ruta (hash) | Vista | Contenido | Acceso |
|--------------|-------|-----------|--------|
| `#/catalogo` | Catálogo | Título de la librería, buscador por título, listado de libros | Público |
| `#/libros` | Libros | Formulario de alta de libros + listado de libros registrados | Público |
| `#/clientes` | Clientes | Formulario de alta de clientes + listado de clientes registrados | Público |
| `#/ventas` | Ventas | Selección de cliente, composición de renglones, resumen de la venta | Público |
| `#/historial` | Historial | Listado de ventas + acceso al detalle de cada venta | Público |
| `#/` (raíz) | Redirección a `#/catalogo` | Vista inicial por defecto | Público |

### Consideraciones de accesibilidad sobre la navegación

- La navegación entre vistas debe poder recorrerse **solo con teclado** y debe mostrar **foco visible** en todo momento (requisito explícito del Ejercicio 2).
- Cada enlace de la vista activa debe exponerse como "página actual" (`aria-current="page"`) para que la posición se comunique sin depender del color.
- Los cambios de vista deben ser anunciables: se recomienda mover el foco al `h1`/título de la vista o a la región `main` al navegar, y usar un área `aria-live` para los mensajes de resultado y de error.
