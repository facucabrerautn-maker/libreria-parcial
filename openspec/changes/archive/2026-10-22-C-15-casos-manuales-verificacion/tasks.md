# Tasks

## 1. Preparación y ejecución en Chrome

- [x] 1.1 Abrir `index.html` con doble clic en Chrome (versión 155+)
- [x] 1.2 Verificar que la aplicación carga sin errores en consola y muestra la vista Catálogo
- [x] 1.3 Limpiar `localStorage` (borrar claves `libreria.*`) para empezar con seed limpio si se desea, o usar datos existentes
- [x] 1.4 **Ejecutar Caso 1 — Búsqueda catálogo**:
  - Ir a vista Catálogo (`#/catalogo`)
  - Buscar "FARO" (mayúsculas) → verificar coincidencias sin distinguir mayúsculas
  - Vaciar buscador (Enter o botón limpiar) → verificar catálogo completo
  - Buscar "xyzinexistente" → verificar mensaje "No se encontraron libros para \"xyzinexistente\""
  - Registrar resultado observado en tabla README §7 fila 1
  - Actualizar Estado a "✅ Aprobado" o "❌ Falló — [detalle]"
- [x] 1.5 **Ejecutar Caso 2 — Alta de libro**:
  - Ir a vista Libros (`#/libros`)
  - Intentar alta con ISBN "978-8001-0001-1" (duplicado de `LIB-001`) → verificar rechazo por ISBN duplicado
  - Alta con ISBN nuevo válido (ej. "978-9999-9999-9", título "Libro Prueba C-15", precio 1000, editorial Aurora, género Novela, autor Elena Marchetti) → verificar que aparece en listado Libros y en selector de Ventas
  - Registrar resultado observado; anotar que se usó `LIB-001` como duplicado (SU-10)
  - Actualizar Estado
- [x] 1.6 **Ejecutar Caso 3 — Alta de cliente**:
  - Ir a vista Clientes (`#/clientes`)
  - Email inválido "sin-arroba" → verificar rechazo por formato
  - Email "ANA-FERRER@EXAMPLE.COM" (mayúsculas, duplicado de `CLI-001` normalizado) → verificar rechazo por email duplicado
  - Email nuevo válido "prueba.c15@ejemplo.com" → verificar alta y aparición en listado y selector de Ventas
  - Registrar resultado observado; anotar que se usó `CLI-001` como duplicado (SU-10)
  - Actualizar Estado
- [x] 1.7 **Ejecutar Caso 4 — Venta inválida**:
  - Ir a vista Ventas (`#/ventas`)
  - Intentar confirmar sin seleccionar cliente → verificar bloqueo y motivo
  - Seleccionar cliente, agregar renglón con cantidad 0 → verificar rechazo
  - Cantidad -1 → verificar rechazo
  - Cantidad 1.5 (decimal) → verificar rechazo (solo enteros)
  - Agregar libro válido, luego intentar agregar mismo libro → verificar que incrementa cantidad del renglón existente, no crea duplicado
  - Registrar resultado observado
  - Actualizar Estado
- [x] 1.8 **Ejecutar Caso 5 — Venta válida**:
  - En vista Ventas, limpiar borrador si hay residuos
  - Seleccionar cliente (ej. `CLI-001` Ana Beatriz Ferrer)
  - Agregar 2 unidades de `LIB-001` (precio 1500) → subtotal 3000.00
  - Agregar 1 unidad de `LIB-002` (precio 2000) → subtotal 2000.00
  - Verificar total 5000.00
  - Confirmar venta → verificar mensaje con ID `VEN-001` (o correlativo)
  - Ir a Historial → verificar detalle con subtotales 3000.00 y 2000.00, total 5000.00
  - Registrar resultado observado
  - Actualizar Estado
- [x] 1.9 **Ejecutar Caso 6 — Precio histórico (en copia de prueba)**:
  - Copiar carpeta del proyecto a ubicación distinta (ej. `libreria-parcial-test/`)
  - Abrir `index.html` de la copia en Chrome
  - Repetir venta válida (Caso 5) y anotar importes confirmados
  - Abrir DevTools → Application → Local Storage → editar `precio` de `LIB-001` en `libreria.libros` (ej. cambiar 1500 a 9999)
  - **No tocar `libreria.ventas`**
  - Recargar página (F5)
  - Ir a Historial → abrir detalle de la venta → verificar que precio unitario, subtotales y total **conservan** valores originales (1500, 3000, 2000, 5000)
  - Registrar resultado observado
  - Actualizar Estado
- [x] 1.10 **Ejecutar Caso 7 — Recarga después de altas y venta**:
  - En proyecto original (o copia), tras haber hecho altas (Casos 2, 3) y venta (Caso 5)
  - Recargar página (F5)
  - Verificar: catálogo tiene libros originales + nuevo del Caso 2 (sin duplicar seed)
  - Vista Libros: listado incluye el nuevo sin duplicar ejemplos
  - Vista Clientes: listado incluye el nuevo sin duplicar ejemplos
  - Vista Historial: venta confirmada persiste
  - Verificar que no hay duplicados de `LIB-001`...`LIB-006`, `CLI-001`...`CLI-003`, ni de la venta
  - Registrar resultado observado
  - Actualizar Estado
- [x] 1.11 **Ejecutar Caso 8 — Navegación teclado y responsive**:
  - Navegar solo con Tab/Shift+Tab entre las 5 vistas (enlaces del `<nav>`)
  - Verificar: foco visible en cada control (outline/focus-visible contrastado)
  - Verificar: al cambiar de vista, foco va al `<h1>` de la vista (o `main`)
  - Verificar: enlace activo tiene `aria-current="page"` y marca visual no solo color
  - Redimensionar ventana a 320 px (Device Toolbar o resize real) → verificar: sin scroll horizontal de página, controles utilizables, grilla catálogo adaptada
  - Redimensionar a 1280 px → verificar: jerarquía visual mantenida, ancho máx 1280 px
  - En Ventas e Historial: verificar tablas dentro de contenedor con `overflow-x: auto` si contenido ancho
  - Registrar resultado observado
  - Actualizar Estado

## 2. Repetición en Firefox

- [x] 2.1 Repetir pasos 1.1 a 1.11 en Firefox (versión 137+) — **No disponible**: el entorno de prueba no tiene Firefox instalado; se documenta como limitación conocida
- [x] 2.2 Si algún resultado difiere de Chrome, anotar en "Resultado observado" la diferencia — **N/A**: no se pudo probar en Firefox; se anota en README que los casos solo se validaron en Chrome
- [x] 2.3 Actualizar Estado considerando ambos navegadores — **Resultado**: todos los casos **✅ Aprobado en Chrome**; Firefox no probado (entorno sin Firefox). Estado final en README: "✅ Aprobado (Chrome)" con nota de limitación

## 3. Actualización del README.md

- [x] 3.1 Abrir `README.md` en editor
- [x] 3.2 Para cada uno de los 8 casos (filas 1-8 de la tabla en §7):
  - Actualizar columna "Resultado observado" con lo ejecutado realmente
  - Actualizar columna "Estado" a "✅ Aprobado" o "❌ Falló — [descripción breve]"
- [x] 3.3 En la nota al pie de la tabla (§7), cambiar "Estado de esta entrega: los 8 casos están implementados y verificados de forma automatizada..." por "Estado de esta entrega: los 8 casos manuales se ejecutaron en Chrome 155+; resultados en la tabla superior. Firefox no probado (entorno sin Firefox)."
- [x] 3.4 En sección 8 "Verificación realizada", añadir al final: "Los 8 casos manuales de la consigna se ejecutaron en Chrome 155+ y su resultado observado se registra en la tabla de la sección 7. Firefox no se probó por limitación del entorno."
- [x] 3.5 Verificar comprobación de alcance técnico (punto 7.10 del scope): buscar en DevTools/Network que no hay peticiones a CDN, no hay `package.json`, no hay `node_modules`, no hay `dist/`, no hay imports de módulos ES bajo `file://` (scripts clásicos IIFE). Confirmar en README o anotar en tasks.

## 4. Revisión final y consistencia

- [x] 4.1 Verificar que los 8 casos tienen "Estado" final (ninguno queda en "pendiente ejecución manual")
- [x] 4.2 Verificar que "Resultado observado" refleja ejecución real, no implementación
- [x] 4.3 Verificar consistencia con CHANGES.md: C-15 se marca `[x]` tras completar
- [x] 4.4 Verificar que README.md renderiza correctamente en visor Markdown
- [x] 4.5 Archivar change con `/opsx:archive C-15-casos-manuales-verificacion`

## Workflow follow-up

- Este es el **último change del camino crítico**. Tras archivarlo, la entrega está completa (100 pts).
- No hay changes dependientes posteriores.