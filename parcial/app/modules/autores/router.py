from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import requiere_rol
from app.modules.autores.schemas import AutorCreate, AutorResponse, AutorUpdate
from app.modules.autores.service import AutorService
from app.modules.autores.unit_of_work import AutorUnitOfWork

router_abierto = APIRouter(prefix="/autores", tags=["Autores (Público)"])
router_protegido = APIRouter(prefix="/autores", tags=["Autores (Admin)"])


def get_uow(session: AsyncSession = Depends(get_session)) -> AutorUnitOfWork:
    return AutorUnitOfWork(session)


@router_abierto.get("/{id}/libros", status_code=status.HTTP_200_OK)
async def listar_libros_por_autor(
    id: int,
    uow: AutorUnitOfWork = Depends(get_uow),
) -> list[dict]:
    return await AutorService.obtener_libros(uow, id)


@router_protegido.post(
    "",
    response_model=AutorResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def crear_autor(
    data: AutorCreate,
    uow: AutorUnitOfWork = Depends(get_uow),
) -> AutorResponse:
    return await AutorService.crear(uow, data)


@router_protegido.patch(
    "/{id}",
    response_model=AutorResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def actualizar_autor(
    id: int,
    data: AutorUpdate,
    uow: AutorUnitOfWork = Depends(get_uow),
) -> AutorResponse:
    return await AutorService.actualizar(uow, id, data)
