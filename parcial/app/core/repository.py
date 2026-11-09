from datetime import datetime, timezone
from typing import Any, Generic, TypeVar
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    """
    Repositorio base genérico.
    Recibe la sesión y la clase del modelo en el constructor porque los genéricos
    se borran en tiempo de ejecución.
    Nunca hace commit(): hace flush() delegando la transacción al Unit of Work.
    """

    def __init__(self, session: AsyncSession, model_cls: type[T]):
        self.session = session
        self.model_cls = model_cls

    async def get_by_id(self, id: Any) -> T | None:
        return await self.session.get(self.model_cls, id)

    async def get_all(self, offset: int = 0, limit: int = 100) -> list[T]:
        stmt = select(self.model_cls).offset(offset).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model_cls)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def add(self, entity: T) -> T:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def update(self, entity: T) -> T:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def delete(self, entity: T) -> None:
        await self.session.delete(entity)
        await self.session.flush()


class SoftDeleteRepository(BaseRepository[T]):
    """
    Repositorio para entidades con borrado lógico (e.g. Libro).
    Filtra por defecto los registros dados de baja (borrado_en IS NOT NULL)
    y provee get_by_id_including_deleted y soft_delete.
    """

    async def get_by_id(self, id: Any) -> T | None:
        stmt = (
            select(self.model_cls)
            .where(self.model_cls.id == id)  # type: ignore[attr-defined]
            .where(self.model_cls.borrado_en.is_(None))  # type: ignore[attr-defined]
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id_including_deleted(self, id: Any) -> T | None:
        return await self.session.get(self.model_cls, id)

    async def get_all(self, offset: int = 0, limit: int = 100) -> list[T]:
        stmt = (
            select(self.model_cls)
            .where(self.model_cls.borrado_en.is_(None))  # type: ignore[attr-defined]
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(self) -> int:
        stmt = (
            select(func.count())
            .select_from(self.model_cls)
            .where(self.model_cls.borrado_en.is_(None))  # type: ignore[attr-defined]
        )
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def soft_delete(self, entity: T) -> None:
        setattr(entity, "borrado_en", datetime.now(timezone.utc))
        self.session.add(entity)
        await self.session.flush()
