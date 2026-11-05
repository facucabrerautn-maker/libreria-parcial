"""Migración 2 del TP: Clientes, perfiles, ventas y renglones de venta

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-16 11:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Cliente (original del TP, sin usuario_id todavía)
    op.create_table(
        "cliente",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_cliente_email"),
    )
    op.create_index(op.f("ix_cliente_email"), "cliente", ["email"], unique=True)

    # 2. PerfilCliente
    op.create_table(
        "perfil_cliente",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cliente_id", sa.Integer(), nullable=False),
        sa.Column("telefono", sa.String(length=50), nullable=False),
        sa.Column("direccion", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(["cliente_id"], ["cliente.id"], name="fk_perfil_cliente_cliente"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cliente_id", name="uq_perfil_cliente_cliente_id"),
    )
    op.create_index(op.f("ix_perfil_cliente_cliente_id"), "perfil_cliente", ["cliente_id"], unique=True)

    # 3. Venta
    op.create_table(
        "venta",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("fecha", sa.DateTime(timezone=True), nullable=False),
        sa.Column("total", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("cliente_id", sa.Integer(), nullable=False),
        sa.CheckConstraint("total >= 0", name="ck_venta_total_no_negativo"),
        sa.ForeignKeyConstraint(["cliente_id"], ["cliente.id"], name="fk_venta_cliente"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_venta_cliente_id"), "venta", ["cliente_id"], unique=False)

    # 4. RenglonVenta
    op.create_table(
        "renglon_venta",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("venta_id", sa.Integer(), nullable=False),
        sa.Column("libro_id", sa.Integer(), nullable=False),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("precio_unitario", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.CheckConstraint("cantidad > 0", name="ck_renglon_venta_cantidad_positiva"),
        sa.CheckConstraint("precio_unitario > 0", name="ck_renglon_venta_precio_positivo"),
        sa.ForeignKeyConstraint(["libro_id"], ["libro.id"], name="fk_renglon_venta_libro"),
        sa.ForeignKeyConstraint(["venta_id"], ["venta.id"], name="fk_renglon_venta_venta"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_renglon_venta_libro_id"), "renglon_venta", ["libro_id"], unique=False)
    op.create_index(op.f("ix_renglon_venta_venta_id"), "renglon_venta", ["venta_id"], unique=False)


def downgrade() -> None:
    op.drop_table("renglon_venta")
    op.drop_table("venta")
    op.drop_table("perfil_cliente")
    op.drop_table("cliente")
