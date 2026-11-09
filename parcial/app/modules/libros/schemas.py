from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class LibroAutorInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    autor_id: int
    rol: str = "autor"
    orden: int = 1


class LibroCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    isbn: str = Field(..., min_length=1, max_length=20)
    titulo: str = Field(..., min_length=1, max_length=200)
    precio: Decimal = Field(..., gt=0)
    stock_inicial: int = Field(0, ge=0)
    editorial_id: int
    genero_id: int | None = None
    autores: list[LibroAutorInput] = Field(..., min_length=1)


class LibroUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    titulo: str | None = Field(None, min_length=1, max_length=200)
    precio: Decimal | None = Field(None, gt=0)


class LibroReponer(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cantidad: int = Field(..., gt=0)
    motivo: str = Field("Reposición de stock", min_length=1, max_length=150)


class LibroResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    isbn: str
    titulo: str
    precio: Decimal
    stock: int
    editorial_id: int | None = None
    genero_id: int | None = None


class MovimientoStockResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    libro_id: int
    venta_id: int | None
    usuario_id: int
    cantidad: int
    motivo: str
    cuando: str
