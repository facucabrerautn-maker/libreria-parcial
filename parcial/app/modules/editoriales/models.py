from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.libros.models import Libro


class Editorial(SQLModel, table=True):
    __tablename__ = "editorial"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True, max_length=150, nullable=False)
    pais: str = Field(max_length=100, nullable=False)

    # Navegación bidireccional
    libros: list["Libro"] = Relationship(back_populates="editorial")
