from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_usuario_actual, requiere_rol
from app.core.paginacion import PaginaResponse, PaginacionParams
from app.modules.libros.schemas import (
    LibroCreate,
    LibroReponer,
    LibroResponse,
    LibroUpdate,
    MovimientoStockResponse,
)
from app.modules.libros.service import LibroService
from app.modules.libros.unit_of_work import LibroUnitOfWork
from app.modules.usuarios.models import Usuario

router_abierto = APIRouter(prefix="/libros", tags=["Libros (Público)"])
router_protegido = APIRouter(prefix="/libros", tags=["Libros (Admin)"])


def get_uow(session: AsyncSession = Depends(get_session)) -> LibroUnitOfWork:
    return LibroUnitOfWork(session)


@router_abierto.get("", response_model=PaginaResponse[LibroResponse], status_code=status.HTTP_200_OK)
async def listar_libros(
    params: PaginacionParams = Depends(),
    titulo: str | None = Query(None, description="Búsqueda por título (insensible a mayúsculas)"),
    genero_id: int | None = Query(None, description="Filtrar por género"),
    uow: LibroUnitOfWork = Depends(get_uow),
) -> PaginaResponse[LibroResponse]:
    return await LibroService.listar(
        uow=uow,
        page=params.page,
        size=params.size,
        titulo=titulo,
        genero_id=genero_id,
    )


@router_abierto.get("/{id}", response_model=LibroResponse, status_code=status.HTTP_200_OK)
async def obtener_libro(
    id: int,
    uow: LibroUnitOfWork = Depends(get_uow),
) -> LibroResponse:
    return await LibroService.obtener_por_id(uow, id)


@router_protegido.post(
    "",
    response_model=LibroResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def crear_libro(
    data: LibroCreate,
    uow: LibroUnitOfWork = Depends(get_uow),
    usuario: Usuario = Depends(get_usuario_actual),
) -> LibroResponse:
    return await LibroService.crear(uow, data, usuario.id)


@router_protegido.patch(
    "/{id}",
    response_model=LibroResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def actualizar_libro(
    id: int,
    data: LibroUpdate,
    uow: LibroUnitOfWork = Depends(get_uow),
) -> LibroResponse:
    return await LibroService.actualizar(uow, id, data)


@router_protegido.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def dar_de_baja_libro(
    id: int,
    uow: LibroUnitOfWork = Depends(get_uow),
) -> Response:
    await LibroService.dar_de_baja(uow, id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router_protegido.post(
    "/{id}/reponer",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def reponer_stock(
    id: int,
    data: LibroReponer,
    uow: LibroUnitOfWork = Depends(get_uow),
    usuario: Usuario = Depends(get_usuario_actual),
) -> dict:
    return await LibroService.reponer(uow, id, data, usuario.id)


@router_protegido.get(
    "/{id}/movimientos",
    response_model=list[MovimientoStockResponse],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def obtener_movimientos(
    id: int,
    uow: LibroUnitOfWork = Depends(get_uow),
) -> list[MovimientoStockResponse]:
    return await LibroService.listar_movimientos(uow, id)
