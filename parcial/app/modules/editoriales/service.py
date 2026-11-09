from fastapi import HTTPException, status
from sqlalchemy import select
from app.core.paginacion import PaginaResponse, calcular_paginacion
from app.modules.editoriales.models import Editorial
from app.modules.editoriales.schemas import EditorialCreate, EditorialResponse, EditorialUpdate
from app.modules.editoriales.unit_of_work import EditorialUnitOfWork
from app.modules.libros.models import Libro


class EditorialService:
    @staticmethod
    async def listar(uow: EditorialUnitOfWork, page: int, size: int) -> PaginaResponse[EditorialResponse]:
        async with uow:
            total = await uow.editoriales.count()
            pages, offset = calcular_paginacion(total, page, size)
            items = await uow.editoriales.get_all(offset=offset, limit=size)
            return PaginaResponse(
                items=[EditorialResponse.model_validate(e) for e in items],
                total=total,
                page=page,
                size=size,
                pages=pages,
            )

    @staticmethod
    async def obtener_por_id(uow: EditorialUnitOfWork, id: int) -> EditorialResponse:
        async with uow:
            editorial = await uow.editoriales.get_by_id(id)
            if not editorial:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Editorial no encontrada")
            return EditorialResponse.model_validate(editorial)

    @staticmethod
    async def crear(uow: EditorialUnitOfWork, data: EditorialCreate) -> EditorialResponse:
        async with uow:
            nueva = Editorial(nombre=data.nombre, pais=data.pais)
            await uow.editoriales.add(nueva)
            return EditorialResponse.model_validate(nueva)

    @staticmethod
    async def actualizar(uow: EditorialUnitOfWork, id: int, data: EditorialUpdate) -> EditorialResponse:
        async with uow:
            editorial = await uow.editoriales.get_by_id(id)
            if not editorial:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Editorial no encontrada")

            campos = data.model_dump(exclude_unset=True)
            for k, v in campos.items():
                setattr(editorial, k, v)

            await uow.editoriales.update(editorial)
            return EditorialResponse.model_validate(editorial)

    @staticmethod
    async def obtener_libros(uow: EditorialUnitOfWork, id: int) -> list[dict]:
        async with uow:
            editorial = await uow.editoriales.get_by_id(id)
            if not editorial:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Editorial no encontrada")

            stmt = select(Libro).where(Libro.editorial_id == id).where(Libro.borrado_en.is_(None))
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
