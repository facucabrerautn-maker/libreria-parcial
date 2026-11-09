from sqlalchemy.ext.asyncio import AsyncSession
from app.core.repository import BaseRepository
from app.modules.generos.models import Genero


class GeneroRepository(BaseRepository[Genero]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Genero)
