-- Caso C-14: Verificación del disparador de sólo agregado en movimiento_stock
-- Resultado esperado: tanto el UPDATE como el DELETE deben ser rechazados por el disparador.

-- 1. Intentar actualizar una fila existente en movimiento_stock
-- Debe fallar con excepción: 'Operación no permitida: la tabla movimiento_stock es de sólo agregado...'
UPDATE movimiento_stock
SET cantidad = 999
WHERE id = 1;

-- 2. Intentar borrar una fila existente en movimiento_stock
-- Debe fallar con excepción: 'Operación no permitida: la tabla movimiento_stock es de sólo agregado...'
DELETE FROM movimiento_stock
WHERE id = 1;
