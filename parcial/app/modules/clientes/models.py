from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.usuarios.models import Usuario
    from app.modules.ventas.models import Venta


class PerfilCliente(SQLModel, table=True):
    __tablename__ = "perfil_cliente"

    id: int | None = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="cliente.id", unique=True, index=True, nullable=False)
    telefono: str = Field(max_length=50, nullable=False)
    direccion: str = Field(max_length=200, nullable=False)

    cliente: "Cliente" = Relationship(back_populates="perfil")


class Cliente(SQLModel, table=True):
    __tablename__ = "cliente"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=150, nullable=False)
    email: str = Field(unique=True, index=True, max_length=150, nullable=False)
    # Acceso opcional con usuario_id UNIQUE (nulo permitido)
    usuario_id: int | None = Field(
        default=None,
        foreign_key="usuario.id",
        unique=True,
        index=True,
        nullable=True
    )

    # Cliente.usuario devuelve un objeto (1 a 1), no una lista
    usuario: "Usuario | None" = Relationship(back_populates="cliente")
    perfil: PerfilCliente | None = Relationship(
        back_populates="cliente",
        sa_relationship_kwargs={"uselist": False, "cascade": "all, delete-orphan"}
    )
    ventas: list["Venta"] = Relationship(back_populates="cliente")
