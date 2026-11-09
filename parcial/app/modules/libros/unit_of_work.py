from sqlalchemy.ext.asyncio import AsyncSession
from app.core.unit_of_work import UnitOfWork
from app.modules.libros.repository import LibroAutorRepository, LibroRepository, MovimientoStockRepository


class LibroUnitOfWork(UnitOfWork):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.libros = LibroRepository(session)
        self.movimientos = MovimientoStockRepository(session)
        self.libro_autores = LibroAutorRepository(session)
