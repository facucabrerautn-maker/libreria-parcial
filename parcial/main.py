from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI

from app.core.config import get_settings
from app.core.database import close_database, init_database
from app.core.security import generate_dummy_hash
from app.modules.health.router import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Ciclo de vida de la aplicación:
    1. Carga configuración.
    2. Inicializa el motor asincrónico y la fábrica de sesiones en app.state.
    3. Precalcula el hash ficticio de login para comparaciones de tiempo constante (RN-08).
    4. Cierra el motor liberando conexiones al finalizar.
    """
    settings = get_settings()
    app.state.settings = settings

    # Crear motor y sessionmaker en app.state (nunca al importar módulos)
    await init_database(app, settings)

    # Precalcular una sola vez el hash ficticio para login
    app.state.dummy_hash = await generate_dummy_hash(settings.BCRYPT_ROUNDS)

    yield

    # Cierre limpio del motor de base de datos
    await close_database(app)


app = FastAPI(
    title="Librería API - Parcial Programación III",
    version="1.0.0",
    lifespan=lifespan,
)

# Dos grupos de rutas:
# 1. Grupo Abierto: no pide sesión (/health, catálogo público, /auth)
grupo_abierto = APIRouter()
grupo_abierto.include_router(health_router)

# 2. Grupo Protegido: pide sesión y controla el cambio obligatorio de contraseña montado una sola vez
grupo_protegido = APIRouter()

app.include_router(grupo_abierto)
app.include_router(grupo_protegido)
