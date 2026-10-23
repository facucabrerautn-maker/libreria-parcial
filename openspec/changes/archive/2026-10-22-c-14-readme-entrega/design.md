# Design

## Context

El `README.md` actual (en la raíz del proyecto) documenta el estado del proyecto pero contiene información desactualizada en las secciones 5 (Funcionalidades implementadas y pendientes) y 7 (Casos manuales). Los changes C-11, C-12 y C-13 están completados y archivados pero el README los muestra como pendientes. Ver proposal.md para la motivación completa.

El README ya tiene la estructura correcta y la mayoría del contenido (responsables, pasos de apertura, navegación, claves localStorage, procedimientos, decisiones de diseño, alcance técnico). Solo necesitan actualizarse las secciones que reflejan el estado de implementación.

## Goals / Non-Goals

**Goals:**
- Actualizar el README para que refleje fielmente qué está implementado y qué queda pendiente
- Mantener la estructura y el tono del documento existente
- No cambiar contenido que ya es correcto (responsables, estructura, claves, procedimientos, decisiones, alcance)

**Non-Goals:**
- Reescribir el README desde cero
- Cambiar la estructura de secciones
- Modificar contenido técnico correcto (claves localStorage, estructura de datos, decisiones de diseño)
- Ejecutar los casos manuales (eso es C-15)

## Decisions

1. **Edición directa del README existente** en lugar de regenerarlo
   - *Rationale*: El 95% del contenido es correcto y bien estructurado. Regenerar desde cero reintroduciría riesgo de omisiones y perdería el tono actual.
   - *Alternativa considerada*: Generar README desde plantilla — descartada por sobreingeniería en un change de documentación.

2. **Actualizaciones quirúrgicas por sección** (no reescritura completa)
   - Sección 4 (Navegación): quitar etiquetas "(Pendiente — C-11)" y "(Pendiente — C-12)"
   - Sección 5.1 (Implementado): agregar 3 filas para Ventas, Historial, Persistencia integrada
   - Sección 5.2 (Pendiente): dejar solo C-15
   - Sección 7 (Casos manuales): cambiar estado de "⏳ Pendiente" a descripciones precisas según implementación real
   - Sección 8 (Verificación): actualizar contador de pruebas y módulos cubiertos

3. **Mantener formato Markdown idéntico** (tablas, encabezados, enlaces internos)
   - *Rationale*: El README se renderiza en GitHub y en visores de Markdown; cambiar formato rompería enlaces y legibilidad.

## Risks / Trade-offs

- [Riesgo: Inconsistencia con CHANGES.md] → Mitigación: Verificar que los cambios en README sean consistentes con el estado `[x]` en CHANGES.md para C-11, C-12, C-13
- [Riesgo: Olvidar actualizar el contador de pruebas en §8] → Mitigación: El design incluye checklist explícito de qué actualizar en cada sección
- [Riesgo: Romper enlaces internos (anchors)] → Mitigación: No cambiar IDs de encabezados (`## 5. Funcionalidades...` se mantiene igual)