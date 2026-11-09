from fastapi import HTTPException, status
from sqlalchemy import select
from app.core.paginacion import PaginaResponse, calcular_paginacion
from app.modules.generos.models import Genero
from app.modules.generos.schemas import GeneroCreate, GeneroResponse
from app.modules.generos.unit_of_work import GeneroUnitOfWork
from app.modules.libros.models import Libro


class GeneroService:
    @staticmethod
    async def listar(uow: GeneroUnitOfWork, page: int, size: int) -> PaginaResponse[GeneroResponse]:
        async with uow:
            total = await uow.generos.count()
            pages, offset = calcular_paginacion(total, page, size)
            items = await uow.generos.get_all(offset=offset, limit=size)
            return PaginaResponse(
                items=[GeneroResponse.model_validate(g) for g in items],
                total=total,
                page=page,
                size=size,
                pages=pages,
            )

    @staticmethod
    async def crear(uow: GeneroUnitOfWork, data: GeneroCreate) -> GeneroResponse:
        async with uow:
            nuevo = Genero(nombre=data.nombre)
            await uow.generos.add(nuevo)
            return GeneroResponse.model_validate(nuevo)

    @staticmethod
    async def obtener_libros(uow: GeneroUnitOfWork, id: int) -> list[dict]:
        async with uow:
            genero = await uow.generos.get_by_id(id)
            if not genero:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Género no encontrado")

            stmt = select(Libro).where(Libro.genero_id == id).where(Libro.borrado_en.is_(None))
            result = await uow.session.execute(stmt)
            libros = result.scalars().all()
            return [
                {
                    "id": l.id,
                    "isbn": l.isbn,
                    "titulo": l.titulo,
                    "precio": str(l.precio),
                    "stock": l.stock,
                }
                for l in libros
            ]
