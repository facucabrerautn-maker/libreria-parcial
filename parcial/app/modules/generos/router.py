from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import requiere_rol
from app.core.paginacion import PaginaResponse, PaginacionParams
from app.modules.generos.schemas import GeneroCreate, GeneroResponse
from app.modules.generos.service import GeneroService
from app.modules.generos.unit_of_work import GeneroUnitOfWork

router_abierto = APIRouter(prefix="/generos", tags=["Géneros (Público)"])
router_protegido = APIRouter(prefix="/generos", tags=["Géneros (Admin)"])


def get_uow(session: AsyncSession = Depends(get_session)) -> GeneroUnitOfWork:
    return GeneroUnitOfWork(session)


@router_abierto.get("", response_model=PaginaResponse[GeneroResponse], status_code=status.HTTP_200_OK)
async def listar_generos(
    params: PaginacionParams = Depends(),
    uow: GeneroUnitOfWork = Depends(get_uow),
) -> PaginaResponse[GeneroResponse]:
    return await GeneroService.listar(uow, params.page, params.size)


@router_abierto.get("/{id}/libros", status_code=status.HTTP_200_OK)
async def listar_libros_por_genero(
    id: int,
    uow: GeneroUnitOfWork = Depends(get_uow),
) -> list[dict]:
    return await GeneroService.obtener_libros(uow, id)


@router_protegido.post(
    "",
    response_model=GeneroResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def crear_genero(
    data: GeneroCreate,
    uow: GeneroUnitOfWork = Depends(get_uow),
) -> GeneroResponse:
    return await GeneroService.crear(uow, data)
