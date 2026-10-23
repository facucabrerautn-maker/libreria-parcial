# Proposal

## Why

El `README.md` actual contiene información desactualizada en las secciones "Funcionalidades implementadas y pendientes" y "Casos manuales". Los changes C-11 (`venta-simulada`), C-12 (`historial-inmutable`) y C-13 (`persistencia-integrada`) están **completados y archivados** (ver `openspec/changes/archive/`) pero el README los marca como "Pendiente — C-11", "Pendiente — C-12" y no menciona C-13. Esto genera confusión para el docente y no refleja el estado real de la entrega. El change C-14 debe actualizar el README para que documente correctamente qué está implementado y qué queda pendiente (solo C-15: ejecución de los 8 casos manuales).

## What Changes

- **Actualizar tabla de navegación** (sección 4): quitar etiquetas "*(Pendiente — C-11)*" y " *(Pendiente — C-12)*" de las vistas Ventas e Historial, ya que están implementadas
- **Actualizar sección 5.1 "Implementado"**: agregar filas para Vista Ventas, Vista Historial y Persistencia integrada/verificación end-to-end
- **Actualizar sección 5.2 "Pendiente"**: dejar solo C-15 (casos manuales); mover C-11, C-12, C-13 a implementadas
- **Actualizar sección 7 "Casos manuales"**: cambiar el estado de los 8 casos de "⏳ Pendiente" a "✅ Implementado (pendiente ejecución manual)" donde corresponda, y aclarar que la implementación está completa; solo C-15 queda para ejecutar los casos en navegador
- **Actualizar sección 8 "Verificación realizada"**: agregar que C-11, C-12, C-13 están verificados (total de pruebas actualizado)
- **Añadir nota operativa** sobre `localStorage` bajo `file://` si no está (ya está en el README actual)
- **Mantener todo lo demás**: responsables, estructura de carpetas, claves localStorage, procedimientos, decisiones de diseño, alcance técnico, etc. ya están correctos

## Capabilities

### Modified Capabilities

- `entrega/readme-documentation`: El README.md es la documentación de entrega obligatoria (Ejercicio 6 — 3 pts). Este change actualiza su contenido para reflejar el estado real de la implementación (RN-ENT-01, RN-ENT-02, RN-ENT-03).

### New Capabilities

- (ninguna — este change solo actualiza documentación existente)

## Impact

- **Archivo modificado**: `README.md` (raíz del proyecto)
- **Sin cambios en código**: Solo documentación
- **Sin cambios en specs**: El comportamiento del sistema no cambia
- **Sin impacto en localStorage**: Las claves `libreria.*` y su estructura no se modifican