from fastapi import HTTPException, status
from sqlalchemy import select
from app.modules.autores.models import Autor
from app.modules.autores.schemas import AutorCreate, AutorResponse, AutorUpdate
from app.modules.autores.unit_of_work import AutorUnitOfWork
from app.modules.libros.models import Libro, LibroAutor


class AutorService:
    @staticmethod
    async def crear(uow: AutorUnitOfWork, data: AutorCreate) -> AutorResponse:
        async with uow:
            nuevo = Autor(nombre=data.nombre, nacionalidad=data.nacionalidad)
            await uow.autores.add(nuevo)
            return AutorResponse.model_validate(nuevo)

    @staticmethod
    async def actualizar(uow: AutorUnitOfWork, id: int, data: AutorUpdate) -> AutorResponse:
        async with uow:
            autor = await uow.autores.get_by_id(id)
            if not autor:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Autor no encontrado")

            campos = data.model_dump(exclude_unset=True)
            for k, v in campos.items():
                setattr(autor, k, v)

            await uow.autores.update(autor)
            return AutorResponse.model_validate(autor)

    @staticmethod
    async def obtener_libros(uow: AutorUnitOfWork, id: int) -> list[dict]:
        async with uow:
            autor = await uow.autores.get_by_id(id)
            if not autor:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Autor no encontrado")

            stmt = (
                select(Libro)
                .join(LibroAutor, LibroAutor.libro_id == Libro.id)
                .where(LibroAutor.autor_id == id)
                .where(Libro.borrado_en.is_(None))
            )
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
