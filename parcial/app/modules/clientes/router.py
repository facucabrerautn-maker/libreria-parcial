from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import requiere_rol
from app.modules.clientes.schemas import (
    ClienteCreate,
    ClienteResponse,
    ClienteUpdate,
    PerfilClienteCreate,
    PerfilClienteResponse,
)
from app.modules.clientes.service import ClienteService
from app.modules.clientes.unit_of_work import ClienteUnitOfWork

router_protegido = APIRouter(prefix="/clientes", tags=["Clientes (Personal)"])


def get_uow(session: AsyncSession = Depends(get_session)) -> ClienteUnitOfWork:
    return ClienteUnitOfWork(session)


@router_protegido.post(
    "",
    response_model=ClienteResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("VENDEDOR", "ADMIN"))],
)
async def crear_cliente(
    data: ClienteCreate,
    uow: ClienteUnitOfWork = Depends(get_uow),
) -> ClienteResponse:
    return await ClienteService.crear(uow, data)


@router_protegido.get(
    "/{id}",
    response_model=ClienteResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("VENDEDOR", "ADMIN"))],
)
async def obtener_cliente(
    id: int,
    uow: ClienteUnitOfWork = Depends(get_uow),
) -> ClienteResponse:
    return await ClienteService.obtener_por_id(uow, id)


@router_protegido.patch(
    "/{id}",
    response_model=ClienteResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("VENDEDOR", "ADMIN"))],
)
async def actualizar_cliente(
    id: int,
    data: ClienteUpdate,
    uow: ClienteUnitOfWork = Depends(get_uow),
) -> ClienteResponse:
    return await ClienteService.actualizar(uow, id, data)


@router_protegido.post(
    "/{id}/perfil",
    response_model=PerfilClienteResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("VENDEDOR", "ADMIN"))],
)
async def crear_perfil_cliente(
    id: int,
    data: PerfilClienteCreate,
    uow: ClienteUnitOfWork = Depends(get_uow),
) -> PerfilClienteResponse:
    return await ClienteService.crear_perfil(uow, id, data)


@router_protegido.get(
    "/{id}/ventas",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("VENDEDOR", "ADMIN"))],
)
async def obtener_ventas_cliente(
    id: int,
    uow: ClienteUnitOfWork = Depends(get_uow),
) -> list[dict]:
    return await ClienteService.obtener_ventas(uow, id)
