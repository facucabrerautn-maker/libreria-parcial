"""Migración 1 del TP: Catálogo base (editoriales, géneros, autores, libros y libro_autor)

Revision ID: 0001
Revises: None
Create Date: 2026-10-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Editorial
    op.create_table(
        "editorial",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("pais", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nombre", name="uq_editorial_nombre"),
    )
    op.create_index(op.f("ix_editorial_nombre"), "editorial", ["nombre"], unique=True)

    # 2. Género
    op.create_table(
        "genero",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("nombre", name="uq_genero_nombre"),
    )
    op.create_index(op.f("ix_genero_nombre"), "genero", ["nombre"], unique=True)

    # 3. Autor
    op.create_table(
        "autor",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("nacionalidad", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_autor_nombre"), "autor", ["nombre"], unique=False)

    # 4. Libro (en el TP original el ISBN era UNIQUE común)
    op.create_table(
        "libro",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("isbn", sa.String(length=20), nullable=False),
        sa.Column("titulo", sa.String(length=200), nullable=False),
        sa.Column("precio", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("editorial_id", sa.Integer(), nullable=False),
        sa.Column("genero_id", sa.Integer(), nullable=True),
        sa.CheckConstraint("precio > 0", name="ck_libro_precio_positivo"),
        sa.CheckConstraint("stock >= 0", name="ck_libro_stock_no_negativo"),
        sa.ForeignKeyConstraint(["editorial_id"], ["editorial.id"], name="fk_libro_editorial"),
        sa.ForeignKeyConstraint(["genero_id"], ["genero.id"], name="fk_libro_genero"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("isbn", name="uq_libro_isbn"),
    )
    op.create_index(op.f("ix_libro_isbn"), "libro", ["isbn"], unique=True)
    op.create_index(op.f("ix_libro_titulo"), "libro", ["titulo"], unique=False)
    op.create_index(op.f("ix_libro_editorial_id"), "libro", ["editorial_id"], unique=False)
    op.create_index(op.f("ix_libro_genero_id"), "libro", ["genero_id"], unique=False)

    # 5. LibroAutor (intermedia)
    op.create_table(
        "libro_autor",
        sa.Column("libro_id", sa.Integer(), nullable=False),
        sa.Column("autor_id", sa.Integer(), nullable=False),
        sa.Column("rol", sa.String(length=50), nullable=False, server_default="autor"),
        sa.Column("orden", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["autor_id"], ["autor.id"], name="fk_libro_autor_autor"),
        sa.ForeignKeyConstraint(["libro_id"], ["libro.id"], name="fk_libro_autor_libro"),
        sa.PrimaryKeyConstraint("libro_id", "autor_id"),
    )
    op.create_index(op.f("ix_libro_autor_autor_id"), "libro_autor", ["autor_id"], unique=False)
    op.create_index(op.f("ix_libro_autor_libro_id"), "libro_autor", ["libro_id"], unique=False)


def downgrade() -> None:
    op.drop_table("libro_autor")
    op.drop_table("libro")
    op.drop_table("autor")
    op.drop_table("genero")
    op.drop_table("editorial")
