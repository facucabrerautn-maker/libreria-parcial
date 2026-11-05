from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.libros.models import Libro


class Genero(SQLModel, table=True):
    __tablename__ = "genero"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True, max_length=100, nullable=False)

    # Navegación bidireccional
    libros: list["Libro"] = Relationship(back_populates="genero")
