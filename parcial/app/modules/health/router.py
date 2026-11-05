from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session

router = APIRouter(prefix="/health", tags=["Salud"])


@router.get("/live", status_code=status.HTTP_200_OK)
async def health_live() -> dict[str, str]:
    """Endpoint de vivacidad: responde 200 sin tocar la base de datos."""
    return {"status": "live"}


@router.get("/ready", status_code=status.HTTP_200_OK)
async def health_ready(session: AsyncSession = Depends(get_session)) -> dict[str, str]:
    """
    Endpoint de disponibilidad: ejecuta SELECT 1 en la base de datos.
    Responde 200 si contesta, o 503 si la base no está lista o no contesta.
    """
    try:
        resultado = await session.execute(text("SELECT 1"))
        valor = resultado.scalar()
        if valor != 1:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Base de datos no lista"
            )
        return {"status": "ready"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Base de datos no disponible"
        )
