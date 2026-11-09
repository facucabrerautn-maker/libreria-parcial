from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import APIRouter, Depends, FastAPI

from app.core.config import get_settings
from app.core.database import close_database, init_database
from app.core.dependencies import verificar_cambio_password_pendiente
from app.core.exceptions import register_exception_handlers
from app.core.security import generate_dummy_hash
from app.modules.autores.router import router_abierto as autores_abierto
from app.modules.autores.router import router_protegido as autores_protegido
from app.modules.clientes.router import router_protegido as clientes_protegido
from app.modules.editoriales.router import router_abierto as editoriales_abierto
from app.modules.editoriales.router import router_protegido as editoriales_protegido
from app.modules.generos.router import router_abierto as generos_abierto
from app.modules.generos.router import router_protegido as generos_protegido
from app.modules.health.router import router as health_router
from app.modules.libros.router import router_abierto as libros_abierto
from app.modules.libros.router import router_protegido as libros_protegido


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

# Registro de manejadores de excepciones para cumplir con RN-15 (sin filtrar SQL interno)
register_exception_handlers(app)

# 1. Grupo Abierto: no pide sesión (/health, catálogo público, búsquedas)
grupo_abierto = APIRouter()
grupo_abierto.include_router(health_router)
grupo_abierto.include_router(libros_abierto)
grupo_abierto.include_router(editoriales_abierto)
grupo_abierto.include_router(generos_abierto)
grupo_abierto.include_router(autores_abierto)

# 2. Grupo Protegido: pide sesión y controla el cambio obligatorio de contraseña montado una sola vez
grupo_protegido = APIRouter(dependencies=[Depends(verificar_cambio_password_pendiente)])
grupo_protegido.include_router(libros_protegido)
grupo_protegido.include_router(editoriales_protegido)
grupo_protegido.include_router(generos_protegido)
grupo_protegido.include_router(autores_protegido)
grupo_protegido.include_router(clientes_protegido)

app.include_router(grupo_abierto)
app.include_router(grupo_protegido)
