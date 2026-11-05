from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING
from sqlalchemy import CheckConstraint, Column, DateTime, Index, Numeric, text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.autores.models import Autor
    from app.modules.editoriales.models import Editorial
    from app.modules.generos.models import Genero
    from app.modules.usuarios.models import Usuario
    from app.modules.ventas.models import RenglonVenta, Venta


class LibroAutor(SQLModel, table=True):
    __tablename__ = "libro_autor"

    libro_id: int = Field(foreign_key="libro.id", primary_key=True, index=True)
    autor_id: int = Field(foreign_key="autor.id", primary_key=True, index=True)
    rol: str = Field(default="autor", max_length=50, nullable=False)
    orden: int = Field(default=1, nullable=False)

    libro: "Libro" = Relationship(back_populates="autores_link")
    autor: "Autor" = Relationship(back_populates="libros_autor")


class Libro(SQLModel, table=True):
    __tablename__ = "libro"
    __table_args__ = (
        CheckConstraint("precio > 0", name="ck_libro_precio_positivo"),
        CheckConstraint("stock >= 0", name="ck_libro_stock_no_negativo"),
        # Índice único parcial: el ISBN es único únicamente entre los libros vigentes (no dados de baja)
        Index(
            "ix_libro_isbn_vigente",
            "isbn",
            unique=True,
            postgresql_where=text("borrado_en IS NULL"),
        ),
    )

    id: int | None = Field(default=None, primary_key=True)
    isbn: str = Field(max_length=20, index=True, nullable=False)
    titulo: str = Field(max_length=200, index=True, nullable=False)
    precio: Decimal = Field(
        sa_column=Column(Numeric(10, 2), nullable=False)
    )
    stock: int = Field(default=0, nullable=False)
    borrado_en: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True)
    )

    editorial_id: int = Field(foreign_key="editorial.id", index=True, nullable=False)
    genero_id: int | None = Field(default=None, foreign_key="genero.id", index=True, nullable=True)

    # Navegación en ambos extremos
    editorial: "Editorial" = Relationship(back_populates="libros")
    genero: "Genero | None" = Relationship(back_populates="libros")
    autores_link: list[LibroAutor] = Relationship(
        back_populates="libro",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    movimientos: list["MovimientoStock"] = Relationship(back_populates="libro")
    renglones_venta: list["RenglonVenta"] = Relationship(back_populates="libro")


class MovimientoStock(SQLModel, table=True):
    __tablename__ = "movimiento_stock"
    __table_args__ = (
        CheckConstraint("cantidad <> 0", name="ck_movimiento_stock_cantidad_no_cero"),
    )

    id: int | None = Field(default=None, primary_key=True)
    libro_id: int = Field(foreign_key="libro.id", index=True, nullable=False)
    venta_id: int | None = Field(default=None, foreign_key="venta.id", index=True, nullable=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True, nullable=False)
    cantidad: int = Field(nullable=False)
    motivo: str = Field(max_length=150, nullable=False)
    cuando: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    libro: Libro = Relationship(back_populates="movimientos")
    venta: "Venta | None" = Relationship(back_populates="movimientos_stock")
    usuario: "Usuario" = Relationship(back_populates="movimientos_stock")
