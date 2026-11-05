import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt
import jwt

# Semáforo para limitar cuántas operaciones intensivas de bcrypt corren a la vez en hilos
# Por defecto permitimos hasta 4 operaciones concurrentes para no saturar CPU
_BCRYPT_SEMAPHORE: asyncio.Semaphore | None = None


def get_bcrypt_semaphore() -> asyncio.Semaphore:
    global _BCRYPT_SEMAPHORE
    if _BCRYPT_SEMAPHORE is None:
        _BCRYPT_SEMAPHORE = asyncio.Semaphore(4)
    return _BCRYPT_SEMAPHORE


def _hash_password_sync(password: str, rounds: int) -> str:
    # Máximo 72 bytes por especificación de bcrypt (RN del parcial)
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=rounds)
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def _verify_password_sync(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hash_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hash_bytes)


async def hash_password(password: str, rounds: int) -> str:
    """Calcula el hash de la contraseña fuera del bucle de eventos y bajo semáforo."""
    sem = get_bcrypt_semaphore()
    async with sem:
        return await asyncio.to_thread(_hash_password_sync, password, rounds)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica la contraseña fuera del bucle de eventos y bajo semáforo."""
    sem = get_bcrypt_semaphore()
    async with sem:
        return await asyncio.to_thread(_verify_password_sync, plain_password, hashed_password)


async def generate_dummy_hash(rounds: int) -> str:
    """Calcula un hash ficticio válido para comparaciones de tiempo constante cuando el usuario no existe."""
    return await hash_password("PasswordFicticiaParaRN08!", rounds)


def create_access_token(
    data: dict[str, Any],
    secret_key: str,
    algorithm: str,
    expires_delta: timedelta | None = None
) -> tuple[str, int]:
    """
    Emite un JWT firmado con sub, exp y roles informativos.
    Devuelve (token, expira_en_segundos).
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
        expires_seconds = int(expires_delta.total_seconds())
    else:
        expire = now + timedelta(minutes=30)
        expires_seconds = 1800

    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt, expires_seconds


def decode_access_token(token: str, secret_key: str, algorithm: str) -> dict[str, Any]:
    """Decodifica y valida el JWT."""
    return jwt.decode(token, secret_key, algorithms=[algorithm])
