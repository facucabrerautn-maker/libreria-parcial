from collections.abc import Callable
from datetime import datetime, timezone
from typing import Annotated, Any
from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_session
from app.core.security import decode_access_token
from app.modules.usuarios.models import AsignacionRol, Usuario


async def get_usuario_actual(
    access_token: Annotated[str | None, Cookie()] = None,
    session: AsyncSession = Depends(get_session),
) -> Usuario:
    """
    Obtiene el usuario autenticado a partir de la cookie access_token.
    Responde 401 si no hay cookie, si el token es inválido o venció, o si el usuario no existe o está inactivo.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado: cookie de sesión ausente.",
        )

    settings = get_settings()
    try:
        payload = decode_access_token(
            token=access_token,
            secret_key=settings.SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido.",
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión inválida o expirada.",
        )

    stmt = select(Usuario).where(Usuario.id == int(user_id))
    result = await session.execute(stmt)
    usuario = result.scalars().first()

    if not usuario or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo.",
        )

    return usuario


async def verificar_cambio_password_pendiente(
    usuario: Usuario = Depends(get_usuario_actual),
) -> Usuario:
    """
    Verifica si el usuario tiene pendiente el cambio de contraseña obligatorio (RN-06).
    Si debe_cambiar_password es True, se bloquea el acceso con 403 a las rutas protegidas.
    """
    if usuario.debe_cambiar_password:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Debe cambiar su contraseña antes de continuar.",
        )
    return usuario


def requiere_rol(*roles_permitidos: str) -> Callable[..., Any]:
    """
    Generador de dependencias para verificar que el usuario posea al menos uno
    de los roles requeridos con vigencia actual en la base de datos (RN-04).
    Responde 403 si no tiene el rol necesario.
    """

    async def _verificador(
        usuario: Usuario = Depends(get_usuario_actual),
        session: AsyncSession = Depends(get_session),
    ) -> Usuario:
        ahora = datetime.now(timezone.utc)
        stmt = (
            select(AsignacionRol)
            .where(AsignacionRol.usuario_id == usuario.id)
            .where(AsignacionRol.revocada_en.is_(None))
            .where((AsignacionRol.vence_en.is_(None)) | (AsignacionRol.vence_en > ahora))
        )
        result = await session.execute(stmt)
        roles_vigentes = [r.rol for r in result.scalars().all()]

        if not any(rol in roles_vigentes for rol in roles_permitidos):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No posee los permisos necesarios para realizar esta acción.",
            )
        return usuario

    return _verificador
