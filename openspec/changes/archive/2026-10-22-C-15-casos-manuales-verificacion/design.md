# Design

## Context

El `README.md` actual (tras C-14) tiene la tabla de 8 casos manuales en la sección 7 con estados de "✅ Implementado (pendiente ejecución manual)" o "✅ Implementado (parcial verificado)" y resultados observados que describen qué está implementado, **pero no el resultado de ejecutar los casos en el navegador**. El change C-15 consiste en ejecutar esos 8 casos manualmente en el navegador (abrir `index.html`, navegar, interactuar, comprobar) y actualizar la tabla con el **resultado observado real**.

Los 8 casos son (del CHANGES.md y sección 7 del README):
1. Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente
2. Alta de libro con ISBN existente y luego con ISBN nuevo
3. Alta de cliente con email inválido, email existente en mayúsculas y email nuevo
4. Venta sin cliente, cantidad cero/negativa/decimal y libro repetido
5. Venta válida de dos unidades a 1500 y una a 2000 → subtotales 3000 y 2000, total 5000
6. Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba → el precio unitario, los subtotales y el total conservan los valores confirmados
7. Recarga después de altas y de una venta → se recuperan los datos sin duplicar ejemplos ni ventas
8. Navegación por teclado y anchos de 320 px y 1280 px → foco visible, controles utilizables y tabla con desplazamiento propio

## Goals / Non-Goals

**Goals:**
- Ejecutar los 8 casos en Chrome y Firefox (abrir con doble clic `index.html`)
- Actualizar la tabla de la sección 7 del README con el resultado observado real
- Completar la columna "Estado" con "✅ Aprobado" o "❌ Falló — [detalle]"
- Registrar qué registros del seed se usaron como duplicados (`LIB-001`, `CLI-001`) según SU-10
- Verificar alcance técnico: 0 librerías, 0 frameworks, 0 CDNs, 0 dependencias, 0 build
- Añadir nota en sección 8 de que los 8 casos manuales se ejecutaron

**Non-Goals:**
- Modificar código de la aplicación
- Cambiar estructura del README
- Ejecutar pruebas automatizadas (ya están en verde)
- Cambiar claves localStorage ni estructura de datos

## Decisions

1. **Ejecución en navegador real (file://)**
   - *Rationale*: La consigna exige comprobar apertura por doble clic; `localStorage` bajo `file://` tiene comportamiento específico por navegador. C-01 ya verificó que Chrome y Firefox abren correctamente con scripts clásicos IIFE.
   - *Alternativa*: Servidor estático — descartada porque la entrega requiere apertura directa y C-14 ya documenta la alternativa como opcional.

2. **Actualización quirúrgica de la tabla de la sección 7**
   - *Rationale*: El resto del README está correcto y completo tras C-14. Solo cambian la columna "Resultado observado" y "Estado" de los 8 casos.
   - *Alternativa*: Regenerar tabla completa — descartado por riesgo de romper formato Markdown.

3. **Copia de prueba para Caso 6 (precio histórico)**
   - *Rationale*: El procedimiento guiado en README §6.3 dice explícitamente "sobre una copia de prueba del proyecto y con datos de prueba, para no alterar los datos de la entrega". C-13 ya verificó esto automatizadamente; C-15 lo ejecuta manualmente.

4. **Ejecución en Chrome y Firefox**
   - *Rationale*: C-01 verificó ambos. La entrega debe funcionar en ambos. Ejecutar en ambos detecta diferencias de `localStorage` bajo `file://`.

## Risks / Trade-offs

- [Riesgo: `localStorage` bloqueado bajo `file://` en Firefox/Chrome restrictivo] → Mitigación: C-01 y C-07 ya manejan esto (aviso al usuario, funcionamiento en memoria). Si falla, se registra como comportamiento observado real.
- [Riesgo: Caso 6 requiere edición manual en DevTools] → Mitigación: Procedimiento documentado en README §6.3 paso a paso; se sigue tal cual.
- [Riesgo: Olvidar actualizar Estado a "✅ Aprobado" vs "❌ Falló"] → Mitigación: Checklist explícito en tasks.md por cada caso.
- [Riesgo: Inconsistencia entre Chrome y Firefox] → Mitigación: Ejecutar en ambos; si difieren, registrar ambos resultados en "Resultado observado".