"""Migración 3 del Parcial: Tablas de acceso, movimiento de stock y cambios en cliente y libro

Revision ID: 0003
Revises: 0002
Create Date: 2026-11-04 12:00:00.000000

COMENTARIO DE REVISIÓN Y CORRECCIÓN MANUAL:
Esta migración fue generada originalmente con alembic revision --autogenerate y revisada
exhaustivamente antes de su aplicación.
Correcciones realizadas a mano:
1. La comparación automática de Alembic no incluye por defecto la cláusula 'postgresql_where'
   para los índices únicos parciales. Se agregaron explícitamente a mano:
   - En 'libro': el índice único parcial 'ix_libro_isbn_vigente' sobre 'isbn' WHERE borrado_en IS NULL
     reemplazando la restricción UNIQUE global 'uq_libro_isbn'.
   - En 'asignacion_rol': el índice único parcial 'ix_asignacion_rol_vigente' sobre ('usuario_id', 'rol')
     WHERE revocada_en IS NULL.
2. Se aseguraron los índices sobre todas las claves foráneas nuevas (usuario_id, libro_id, venta_id).
3. Se garantizó la bidireccionalidad completa en downgrade().
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Tabla usuario
    op.create_table(
        "usuario",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("activo", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("debe_cambiar_password", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_usuario_email"),
    )
    op.create_index(op.f("ix_usuario_email"), "usuario", ["email"], unique=True)

    # 2. Tabla asignacion_rol
    op.create_table(
        "asignacion_rol",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("usuario_id", sa.Integer(), nullable=False),
        sa.Column("rol", sa.String(length=20), nullable=False),
        sa.Column("desde", sa.DateTime(timezone=True), nullable=False),
        sa.Column("vence_en", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revocada_en", sa.DateTime(timezone=True), nullable=True),
        sa.Column("otorgada_por", sa.Integer(), nullable=True),
        sa.CheckConstraint("rol IN ('ADMIN', 'VENDEDOR', 'CLIENTE')", name="ck_asignacion_rol_permitido"),
        sa.ForeignKeyConstraint(["otorgada_por"], ["usuario.id"], name="fk_asignacion_rol_otorgada_por"),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuario.id"], name="fk_asignacion_rol_usuario"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_asignacion_rol_usuario_id"), "asignacion_rol", ["usuario_id"], unique=False)
    op.create_index(op.f("ix_asignacion_rol_otorgada_por"), "asignacion_rol", ["otorgada_por"], unique=False)
    # Índice único parcial: un usuario solo tiene a lo sumo una asignación abierta por rol
    op.create_index(
        "ix_asignacion_rol_vigente",
        "asignacion_rol",
        ["usuario_id", "rol"],
        unique=True,
        postgresql_where=sa.text("revocada_en IS NULL"),
    )

    # 3. Tabla intento_acceso
    op.create_table(
        "intento_acceso",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cuando", sa.DateTime(timezone=True), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("ip", sa.String(length=45), nullable=False),
        sa.Column("exito", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_intento_acceso_email"), "intento_acceso", ["email"], unique=False)
    op.create_index(
        "ix_intento_acceso_email_ip_cuando",
        "intento_acceso",
        ["email", "ip", "cuando"],
        unique=False,
    )

    # 4. Tabla evento_seguridad
    op.create_table(
        "evento_seguridad",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cuando", sa.DateTime(timezone=True), nullable=False),
        sa.Column("actor", sa.String(length=150), nullable=False),
        sa.Column("accion", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # 5. Tabla movimiento_stock
    op.create_table(
        "movimiento_stock",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("libro_id", sa.Integer(), nullable=False),
        sa.Column("venta_id", sa.Integer(), nullable=True),
        sa.Column("usuario_id", sa.Integer(), nullable=False),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("motivo", sa.String(length=150), nullable=False),
        sa.Column("cuando", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("cantidad <> 0", name="ck_movimiento_stock_cantidad_no_cero"),
        sa.ForeignKeyConstraint(["libro_id"], ["libro.id"], name="fk_movimiento_stock_libro"),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuario.id"], name="fk_movimiento_stock_usuario"),
        sa.ForeignKeyConstraint(["venta_id"], ["venta.id"], name="fk_movimiento_stock_venta"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_movimiento_stock_libro_id"), "movimiento_stock", ["libro_id"], unique=False)
    op.create_index(op.f("ix_movimiento_stock_usuario_id"), "movimiento_stock", ["usuario_id"], unique=False)
    op.create_index(op.f("ix_movimiento_stock_venta_id"), "movimiento_stock", ["venta_id"], unique=False)

    # 6. Modificar cliente: agregar usuario_id (UNIQUE y FK)
    op.add_column("cliente", sa.Column("usuario_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_cliente_usuario", "cliente", "usuario", ["usuario_id"], ["id"])
    op.create_index(op.f("ix_cliente_usuario_id"), "cliente", ["usuario_id"], unique=True)

    # 7. Modificar libro: agregar borrado_en y cambiar UNIQUE común por índice único parcial
    op.add_column("libro", sa.Column("borrado_en", sa.DateTime(timezone=True), nullable=True))
    # Quitar el índice/restricción UNIQUE global anterior
    op.drop_index("ix_libro_isbn", table_name="libro")
    op.drop_constraint("uq_libro_isbn", "libro", type_="unique")
    # Crear el nuevo índice único parcial sobre ISBN de los libros vigentes
    op.create_index(
        "ix_libro_isbn_vigente",
        "libro",
        ["isbn"],
        unique=True,
        postgresql_where=sa.text("borrado_en IS NULL"),
    )


def downgrade() -> None:
    # 7. Revertir cambios en libro
    op.drop_index("ix_libro_isbn_vigente", table_name="libro", postgresql_where=sa.text("borrado_en IS NULL"))
    op.create_unique_constraint("uq_libro_isbn", "libro", ["isbn"])
    op.create_index("ix_libro_isbn", "libro", ["isbn"], unique=True)
    op.drop_column("libro", "borrado_en")

    # 6. Revertir cambios en cliente
    op.drop_index(op.f("ix_cliente_usuario_id"), table_name="cliente")
    op.drop_constraint("fk_cliente_usuario", "cliente", type_="foreignkey")
    op.drop_column("cliente", "usuario_id")

    # 5. Drop movimiento_stock
    op.drop_index(op.f("ix_movimiento_stock_venta_id"), table_name="movimiento_stock")
    op.drop_index(op.f("ix_movimiento_stock_usuario_id"), table_name="movimiento_stock")
    op.drop_index(op.f("ix_movimiento_stock_libro_id"), table_name="movimiento_stock")
    op.drop_table("movimiento_stock")

    # 4. Drop evento_seguridad
    op.drop_table("evento_seguridad")

    # 3. Drop intento_acceso
    op.drop_index("ix_intento_acceso_email_ip_cuando", table_name="intento_acceso")
    op.drop_index(op.f("ix_intento_acceso_email"), table_name="intento_acceso")
    op.drop_table("intento_acceso")

    # 2. Drop asignacion_rol
    op.drop_index("ix_asignacion_rol_vigente", table_name="asignacion_rol", postgresql_where=sa.text("revocada_en IS NULL"))
    op.drop_index(op.f("ix_asignacion_rol_otorgada_por"), table_name="asignacion_rol")
    op.drop_index(op.f("ix_asignacion_rol_usuario_id"), table_name="asignacion_rol")
    op.drop_table("asignacion_rol")

    # 1. Drop usuario
    op.drop_index(op.f("ix_usuario_email"), table_name="usuario")
    op.drop_table("usuario")
