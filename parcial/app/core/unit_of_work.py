from typing import Self
from sqlalchemy.ext.asyncio import AsyncSession


class UnitOfWork:
    """
    Unit of Work base como gestor de contexto asincrónico.
    - Confirma (commit) al salir limpiamente del bloque.
    - Revierte (rollback) si ocurre una excepción.
    - No cierra la sesión, porque no la creó (se maneja en get_session).
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is not None:
            await self.rollback()
        else:
            await self.commit()

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()
