from typing import Generic, TypeVar
from fastapi import HTTPException, Query, status
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PaginacionParams:
    """Parámetros de consulta estándar para paginación."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Número de página (comienza en 1)"),
        size: int = Query(20, ge=1, le=100, description="Cantidad de elementos por página (1 a 100)"),
    ):
        self.page = page
        self.size = size


class PaginaResponse(BaseModel, Generic[T]):
    """Envoltorio estándar de listados paginados de la sección 2.9."""
    model_config = ConfigDict(extra="forbid")

    items: list[T]
    total: int
    page: int
    size: int
    pages: int


def calcular_paginacion(total: int, page: int, size: int) -> tuple[int, int]:
    """
    Calcula la cantidad total de páginas y el offset.
    Reglas:
    - Con cero resultados hay una página, vacía (total=0 -> pages=1).
    - Pedir una página más allá de la última responde 422 con el mensaje exacto.
    Devuelve (pages, offset).
    """
    if total == 0:
        pages = 1
    else:
        pages = (total + size - 1) // size

    if page > pages:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"La página {page} no existe: hay {pages}",
        )

    offset = (page - 1) * size
    return pages, offset
