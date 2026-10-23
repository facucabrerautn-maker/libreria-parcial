# Proposal

## Why

El `README.md` actual (actualizado en C-14) documenta correctamente el estado de la implementación: las 14 funcionalidades principales están completadas y verificadas automatizadamente, pero **los 8 casos manuales de la consigna aún no se han ejecutado en el navegador** para registrar el **resultado observado**. El cambio C-15 es la ejecución final de esos 8 casos manuales en el navegador real (Chrome/Firefox), comprobando el comportamiento punta a punta con datos reales, y actualizando la tabla de "Casos manuales" (sección 7 del README) con el resultado real de cada caso. Según RN-ENT-03: "Si un caso falla o queda pendiente, registrar el comportamiento real; no declarar aprobada ninguna prueba que no se haya ejecutado".

## What Changes

- **Ejecutar en navegador (Chrome y Firefox)** los 8 casos manuales listados en la sección 7 del README
- **Actualizar la tabla de "Casos manuales"** (sección 7) con el **resultado observado** real de cada caso:
  - Cambiar el estado de "✅ Implementado (pendiente ejecución manual)" / "✅ Implementado (parcial verificado)" a **"✅ Aprobado"** si el caso pasa, o a **"❌ Falló — [descripción del comportamiento real]"** si falla
  - Completar la columna "Resultado observado" con lo que realmente sucede en el navegador
  - Registrar qué registros del seed se usaron como duplicados (`LIB-001`, `CLI-001`) según SU-10
- **Actualizar la sección 8 "Verificación realizada"**: añadir nota de que los 8 casos manuales se ejecutaron y su resultado está en la tabla de la sección 7
- **Comprobación de alcance técnico** (punto 7.10 del scope): verificar 0 librerías, 0 frameworks, 0 CDNs, 0 dependencias, 0 build antes de la entrega

## Capabilities

### Modified Capabilities

- `entrega/readme-documentation`: El README.md es la documentación de entrega obligatoria (Ejercicio 6 — 3 pts). Este change completa la ejecución de los casos manuales y registra el resultado observado (RN-ENT-03, US-031).

### New Capabilities

- (ninguna — este change solo completa la verificación y actualiza documentación existente)

## Impact

- **Archivo modificado**: `README.md` (solo la tabla de la sección 7 y nota en sección 8)
- **Sin cambios en código**: Solo documentación de resultados
- **Sin cambios en specs**: El comportamiento del sistema no cambia
- **Sin impacto en localStorage**: Las claves `libreria.*` y su estructura no se modifican; la ejecución de casos puede crear/leer datos de prueba pero no cambia la estructura
- **Ejecución en navegador real requerida**: Chrome 155+ y Firefox 137+ (verificados en C-01)