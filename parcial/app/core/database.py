from collections.abc import AsyncGenerator
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import Settings


async def init_database(app, settings: Settings) -> None:
    """
    Inicializa el motor asincrónico y la fábrica de sesiones dentro del lifespan
    y los guarda en app.state para evitar crearlos al importar módulos.
    """
    engine = create_async_engine(
        settings.database_url,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        echo=settings.SQL_ECHO,
    )
    session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    app.state.engine = engine
    app.state.session_factory = session_factory


async def close_database(app) -> None:
    """Cierra el motor asincrónico liberando conexiones activas."""
    if hasattr(app.state, "engine") and app.state.engine:
        await app.state.engine.dispose()


async def get_session(request: Request) -> AsyncGenerator[AsyncSession, None]:
    """
    Entrega una sesión asincrónica por petición tomada de app.state.session_factory
    creada con expire_on_commit=False y la cierra al terminar.
    """
    session_factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
