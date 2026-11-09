from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.repository import BaseRepository, SoftDeleteRepository
from app.modules.libros.models import Libro, LibroAutor, MovimientoStock


class LibroRepository(SoftDeleteRepository[Libro]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Libro)

    async def buscar_por_criterios(
        self,
        titulo: str | None = None,
        genero_id: int | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Libro]:
        """
        Búsqueda de libros vigentes con parámetros ligados y sin distinguir mayúsculas.
        """
        stmt = select(Libro).where(Libro.borrado_en.is_(None))

        if titulo and titulo.strip():
            # Parámetro ligado para prevenir inyección SQL y case-insensitive
            patron = f"%{titulo.strip().lower()}%"
            stmt = stmt.where(func.lower(Libro.titulo).like(patron))

        if genero_id is not None:
            stmt = stmt.where(Libro.genero_id == genero_id)

        stmt = stmt.order_by(Libro.id).offset(offset).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def contar_por_criterios(
        self,
        titulo: str | None = None,
        genero_id: int | None = None,
    ) -> int:
        """
        Cuenta el total de libros vigentes aplicando los mismos filtros que el listado.
        """
        stmt = select(func.count()).select_from(Libro).where(Libro.borrado_en.is_(None))

        if titulo and titulo.strip():
            patron = f"%{titulo.strip().lower()}%"
            stmt = stmt.where(func.lower(Libro.titulo).like(patron))

        if genero_id is not None:
            stmt = stmt.where(Libro.genero_id == genero_id)

        result = await self.session.execute(stmt)
        return result.scalar_one()


class MovimientoStockRepository(BaseRepository[MovimientoStock]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, MovimientoStock)

    async def listar_por_libro(self, libro_id: int) -> list[MovimientoStock]:
        stmt = (
            select(MovimientoStock)
            .where(MovimientoStock.libro_id == libro_id)
            .order_by(MovimientoStock.cuando.desc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


class LibroAutorRepository(BaseRepository[LibroAutor]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, LibroAutor)
