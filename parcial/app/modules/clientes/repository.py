from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.repository import BaseRepository
from app.modules.clientes.models import Cliente, PerfilCliente


class ClienteRepository(BaseRepository[Cliente]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Cliente)

    async def get_by_id_with_perfil(self, cliente_id: int) -> Cliente | None:
        """Obtiene un cliente con su perfil precargado de forma anticipada (evita N+1 y lazy loading)."""
        stmt = (
            select(Cliente)
            .where(Cliente.id == cliente_id)
            .options(selectinload(Cliente.perfil))
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Cliente | None:
        stmt = select(Cliente).where(Cliente.email == email.strip().lower())
        result = await self.session.execute(stmt)
        return result.scalars().first()


class PerfilClienteRepository(BaseRepository[PerfilCliente]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, PerfilCliente)

    async def get_by_cliente_id(self, cliente_id: int) -> PerfilCliente | None:
        stmt = select(PerfilCliente).where(PerfilCliente.cliente_id == cliente_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()
