from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import requiere_rol
from app.core.paginacion import PaginaResponse, PaginacionParams
from app.modules.editoriales.schemas import EditorialCreate, EditorialResponse, EditorialUpdate
from app.modules.editoriales.service import EditorialService
from app.modules.editoriales.unit_of_work import EditorialUnitOfWork

router_abierto = APIRouter(prefix="/editoriales", tags=["Editoriales (Público)"])
router_protegido = APIRouter(prefix="/editoriales", tags=["Editoriales (Admin)"])


def get_uow(session: AsyncSession = Depends(get_session)) -> EditorialUnitOfWork:
    return EditorialUnitOfWork(session)


@router_abierto.get("", response_model=PaginaResponse[EditorialResponse], status_code=status.HTTP_200_OK)
async def listar_editoriales(
    params: PaginacionParams = Depends(),
    uow: EditorialUnitOfWork = Depends(get_uow),
) -> PaginaResponse[EditorialResponse]:
    return await EditorialService.listar(uow, params.page, params.size)


@router_abierto.get("/{id}/libros", status_code=status.HTTP_200_OK)
async def listar_libros_por_editorial(
    id: int,
    uow: EditorialUnitOfWork = Depends(get_uow),
) -> list[dict]:
    return await EditorialService.obtener_libros(uow, id)


@router_protegido.post(
    "",
    response_model=EditorialResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def crear_editorial(
    data: EditorialCreate,
    uow: EditorialUnitOfWork = Depends(get_uow),
) -> EditorialResponse:
    return await EditorialService.crear(uow, data)


@router_protegido.patch(
    "/{id}",
    response_model=EditorialResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(requiere_rol("ADMIN"))],
)
async def actualizar_editorial(
    id: int,
    data: EditorialUpdate,
    uow: EditorialUnitOfWork = Depends(get_uow),
) -> EditorialResponse:
    return await EditorialService.actualizar(uow, id, data)
