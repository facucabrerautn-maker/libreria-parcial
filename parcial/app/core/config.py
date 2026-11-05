from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Base de datos (variables sueltas obligatorias según consigna, sin defaults para contraseña)
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    SQL_ECHO: bool = False

    # Clave de firma de tokens (obligatoria en entorno, sin default en código)
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BCRYPT_ROUNDS: int = 12

    # Configuración de cookies
    COOKIE_SECURE: bool = False
    COOKIE_SAME_SITE: str = "lax"

    # Intentos de acceso y rate limiting
    LOGIN_MAX_ATTEMPTS: int = 5
    LOGIN_WINDOW_SECONDS: int = 60

    @computed_field
    @property
    def database_url(self) -> str:
        """Construye la URL asincrónica de conexión para asyncpg."""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings: Settings | None = None


def get_settings() -> Settings:
    global settings
    if settings is None:
        settings = Settings()
    return settings
