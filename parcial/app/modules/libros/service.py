from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy import select
from app.core.paginacion import PaginaResponse, calcular_paginacion
from app.modules.editoriales.models import Editorial
from app.modules.libros.models import Libro, LibroAutor, MovimientoStock
from app.modules.libros.schemas import (
    LibroCreate,
    LibroReponer,
    LibroResponse,
    LibroUpdate,
    MovimientoStockResponse,
)
from app.modules.libros.unit_of_work import LibroUnitOfWork


class LibroService:
    @staticmethod
    async def listar(
        uow: LibroUnitOfWork,
        page: int,
        size: int,
        titulo: str | None = None,
        genero_id: int | None = None,
    ) -> PaginaResponse[LibroResponse]:
        async with uow:
            total = await uow.libros.contar_por_criterios(titulo=titulo, genero_id=genero_id)
            pages, offset = calcular_paginacion(total, page, size)
            items = await uow.libros.buscar_por_criterios(
                titulo=titulo,
                genero_id=genero_id,
                offset=offset,
                limit=size,
            )
            return PaginaResponse(
                items=[LibroResponse.model_validate(l) for l in items],
                total=total,
                page=page,
                size=size,
                pages=pages,
            )

    @staticmethod
    async def obtener_por_id(uow: LibroUnitOfWork, id: int) -> LibroResponse:
        async with uow:
            libro = await uow.libros.get_by_id(id)
            if not libro:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
            return LibroResponse.model_validate(libro)

    @staticmethod
    async def crear(uow: LibroUnitOfWork, data: LibroCreate, usuario_id: int) -> LibroResponse:
        async with uow:
            # Verificar editorial existente
            stmt = select(Editorial).where(Editorial.id == data.editorial_id)
            res_ed = await uow.session.execute(stmt)
            if not res_ed.scalars().first():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="La editorial especificada no existe.",
                )

            # Verificar si existe un libro vigente con el mismo ISBN
            stmt_isbn = (
                select(Libro)
                .where(Libro.isbn == data.isbn.strip())
                .where(Libro.borrado_en.is_(None))
            )
            res_isbn = await uow.session.execute(stmt_isbn)
            if res_isbn.scalars().first():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe un libro vigente con ese ISBN.",
                )

            # Crear libro con stock_inicial (RN-11)
            nuevo_libro = Libro(
                isbn=data.isbn.strip(),
                titulo=data.titulo.strip(),
                precio=Decimal(str(data.precio)),
                stock=data.stock_inicial,
                editorial_id=data.editorial_id,
                genero_id=data.genero_id,
            )
            await uow.libros.add(nuevo_libro)

            # Asociar autores
            for autor_in in data.autores:
                link = LibroAutor(
                    libro_id=nuevo_libro.id,
                    autor_id=autor_in.autor_id,
                    rol=autor_in.rol,
                    orden=autor_in.orden,
                )
                await uow.libro_autores.add(link)

            # Si stock_inicial > 0, dejar movimiento "Stock inicial" (RN-11)
            if data.stock_inicial > 0:
                mov = MovimientoStock(
                    libro_id=nuevo_libro.id,
                    usuario_id=usuario_id,
                    cantidad=data.stock_inicial,
                    motivo="Stock inicial",
                )
                await uow.movimientos.add(mov)

            return LibroResponse.model_validate(nuevo_libro)

    @staticmethod
    async def actualizar(uow: LibroUnitOfWork, id: int, data: LibroUpdate) -> LibroResponse:
        async with uow:
            libro = await uow.libros.get_by_id(id)
            if not libro:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")

            campos = data.model_dump(exclude_unset=True)
            for k, v in campos.items():
                setattr(libro, k, v)

            await uow.libros.update(libro)
            return LibroResponse.model_validate(libro)

    @staticmethod
    async def dar_de_baja(uow: LibroUnitOfWork, id: int) -> None:
        async with uow:
            libro = await uow.libros.get_by_id(id)
            if not libro:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
            await uow.libros.soft_delete(libro)

    @staticmethod
    async def reponer(uow: LibroUnitOfWork, id: int, data: LibroReponer, usuario_id: int) -> dict:
        async with uow:
            libro = await uow.libros.get_by_id_including_deleted(id)
            if not libro:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")

            # RN-13: Un libro dado de baja no se puede reponer
            if libro.borrado_en is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="No se puede reponer stock de un libro dado de baja.",
                )

            # Actualizar stock a través de movimiento (RN-11)
            libro.stock += data.cantidad
            await uow.libros.update(libro)

            mov = MovimientoStock(
                libro_id=libro.id,
                usuario_id=usuario_id,
                cantidad=data.cantidad,
                motivo=data.motivo,
            )
            await uow.movimientos.add(mov)

            return {
                "mensaje": "Stock repuesto exitosamente",
                "libro_id": libro.id,
                "nuevo_stock": libro.stock,
            }

    @staticmethod
    async def listar_movimientos(uow: LibroUnitOfWork, id: int) -> list[MovimientoStockResponse]:
        async with uow:
            libro = await uow.libros.get_by_id_including_deleted(id)
            if not libro:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")

            movs = await uow.movimientos.listar_por_libro(id)
            return [
                MovimientoStockResponse(
                    id=m.id,
                    libro_id=m.libro_id,
                    venta_id=m.venta_id,
                    usuario_id=m.usuario_id,
                    cantidad=m.cantidad,
                    motivo=m.motivo,
                    cuando=m.cuando.isoformat(),
                )
                for m in movs
            ]
