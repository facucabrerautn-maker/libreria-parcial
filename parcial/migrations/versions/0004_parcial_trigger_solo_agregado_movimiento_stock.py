"""Migración 4 del Parcial: Disparador (trigger) de sólo agregado para movimiento_stock (RN-12)

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-04 12:30:00.000000

COMENTARIO DE CREACIÓN MANUAL:
Esta migración se escribe íntegramente a mano porque la herramienta de comparación
automática de Alembic (--autogenerate) no detecta funciones de procedimiento almacenado
(PL/pgSQL) ni disparadores (triggers) en PostgreSQL.
Instala la función 'trg_fn_movimiento_stock_solo_agregado' y el disparador 'trg_movimiento_stock_solo_agregado'
que intercepta antes de cualquier UPDATE o DELETE sobre la tabla 'movimiento_stock' y arroja
una excepción, garantizando en la base de datos la regla de sólo agregado (RN-12).
"""
from typing import Sequence, Union

from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Crear la función del disparador
    op.execute(
        """
        CREATE OR REPLACE FUNCTION trg_fn_movimiento_stock_solo_agregado()
        RETURNS TRIGGER AS $$
        BEGIN
            RAISE EXCEPTION 'Operación no permitida: la tabla movimiento_stock es de sólo agregado y no admite UPDATE ni DELETE (RN-12).';
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    # 2. Crear el disparador BEFORE UPDATE OR DELETE
    op.execute(
        """
        CREATE TRIGGER trg_movimiento_stock_solo_agregado
        BEFORE UPDATE OR DELETE ON movimiento_stock
        FOR EACH ROW
        EXECUTE FUNCTION trg_fn_movimiento_stock_solo_agregado();
        """
    )


def downgrade() -> None:
    # 1. Eliminar el disparador
    op.execute(
        "DROP TRIGGER IF EXISTS trg_movimiento_stock_solo_agregado ON movimiento_stock;"
    )

    # 2. Eliminar la función
    op.execute(
        "DROP FUNCTION IF EXISTS trg_fn_movimiento_stock_solo_agregado();"
    )
