# Tasks

## 1. Actualizar sección de navegación (Sección 4)

- [x] 1.1 Quitar etiqueta "*(Pendiente — C-11)*" de la fila "Ventas" en la tabla de navegación
- [x] 1.2 Quitar etiqueta "*(Pendiente — C-12)*" de la fila "Historial" en la tabla de navegación
- [x] 1.3 Verificar: la tabla muestra las 5 vistas sin etiquetas de pendiente

## 2. Actualizar funcionalidades implementadas (Sección 5.1)

- [x] 2.1 Agregar fila para "Vista Ventas" con descripción: "Composición de renglones con precio congelado, cálculos, validación y confirmación de venta" y archivos `js/vistas/ventas.js`, `css/vistas.css`
- [x] 2.2 Agregar fila para "Vista Historial" con descripción: "Listado de ventas confirmadas con detalle de renglones leído del snapshot, inmutable" y archivos `js/vistas/historial.js`, `css/vistas.css`
- [x] 2.3 Agregar fila para "Persistencia integrada" con descripción: "Verificación end-to-end de escrituras, recarga sin duplicados e integridad del precio histórico" y archivo `js/storage.js`, `js/app.js`
- [x] 2.4 Verificar: la tabla "Implementado" tiene 13 filas (10 originales + 3 nuevas)

## 3. Actualizar funcionalidades pendientes (Sección 5.2)

- [x] 3.1 Dejar solo la fila para C-15 "Verificación" con "Ejecutar en el navegador los 8 casos manuales y registrar el resultado observado"
- [x] 3.2 Eliminar filas de C-11, C-12, C-13 de la tabla "Pendiente"
- [x] 3.3 Verificar: la tabla "Pendiente" tiene 1 fila (C-15)

## 4. Actualizar casos manuales (Sección 7)

- [x] 4.1 Cambiar estado del Caso 1 (búsqueda catálogo) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Implementado y verificado automatizado en `js/vistas/catalogo.js`, `js/vistas/catalogo-buscador.js`; queda comprobación manual en navegador"
- [x] 4.2 Cambiar estado del Caso 2 (alta libro) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Implementado y verificado automatizado en `js/vistas/libros.js`, `js/vistas/libros-formulario.js`; queda comprobación manual en navegador y reflejo en selección de venta"
- [x] 4.3 Cambiar estado del Caso 3 (alta cliente) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Implementado y verificado automatizado en `js/vistas/clientes.js`, `js/vistas/clientes-formulario.js`; queda comprobación manual en navegador y reflejo en selección de venta"
- [x] 4.4 Cambiar estado del Caso 4 (venta inválida) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Validaciones de cantidad y renglón repetido implementadas y verificadas; vista Ventas completa (C-11); queda comprobación manual en navegador"
- [x] 4.5 Cambiar estado del Caso 5 (venta válida) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Cálculo de subtotales y total con precio congelado implementado y verificado; vistas Ventas e Historial completas (C-11, C-12); queda comprobación manual en navegador"
- [x] 4.6 Cambiar estado del Caso 6 (precio histórico) a "✅ Implementado (pendiente ejecución manual)" y actualizar "Resultado observado" a "Snapshot del renglón y precio congelado implementados y verificados (C-11, C-12, C-13); requiere copia de prueba; queda comprobación manual en navegador"
- [x] 4.7 Cambiar estado del Caso 7 (recarga) a "✅ Implementado (parcial verificado)" y actualizar "Resultado observado" a "Persistencia verificada automatizada: siembra condicional, recarga sin duplicar, supervivencia de datos; queda ejecución punta a punta con venta"
- [x] 4.8 Cambiar estado del Caso 8 (navegación teclado/responsive) a "✅ Implementado (parcial verificado)" y actualizar "Resultado observado" a "Navegación, foco y marca de vista activa implementados; grilla catálogo, formularios y tablas con Grid y contenedor de desplazamiento; falta verificar anchos y tablas de Ventas e Historial en navegador"
- [x] 4.9 Verificar: los 8 casos tienen estado actualizado y "Resultado observado" refleja implementación real

## 5. Actualizar verificación realizada (Sección 8)

- [x] 5.1 Actualizar contador de pruebas: de "240 pruebas" a "240+ pruebas" (incluyendo C-11, C-12, C-13)
- [x] 5.2 Agregar filas a la tabla de módulos verificados para:
  - `js/vistas/ventas.js` — Composición de venta, renglones, snapshot de precio, cálculos, confirmación
  - `js/vistas/historial.js` — Listado, detalle de renglones desde snapshot, inmutabilidad
  - `js/storage.js`, `js/app.js` (integración) — Persistencia end-to-end, recarga, precio histórico, cuota, JSON corrupto
- [x] 5.3 Verificar: la tabla de verificación incluye todos los módulos de vistas implementadas

## 6. Revisión final y consistencia

- [x] 6.1 Verificar que no hay referencias a "C-11", "C-12", "C-13" como pendientes en todo el README
- [x] 6.2 Verificar consistencia con CHANGES.md (C-11, C-12, C-13 marcados `[x]`)
- [x] 6.3 Verificar que enlaces internos (anchors) siguen funcionando
- [x] 6.4 Verificar: README.md renderiza correctamente en visor Markdown

## Workflow follow-up

- Archivar el change después de que el README actualizado sea revisado y aprobado
- Verificar el resultado archivado