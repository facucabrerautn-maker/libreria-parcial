from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PerfilClienteCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    telefono: str = Field(..., min_length=1, max_length=50)
    direccion: str = Field(..., min_length=1, max_length=200)


class PerfilClienteResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    cliente_id: int
    telefono: str
    direccion: str


class ClienteCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str = Field(..., min_length=1, max_length=150)
    email: EmailStr


class ClienteUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str | None = Field(None, min_length=1, max_length=150)
    email: EmailStr | None = None


class ClienteResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    nombre: str
    email: str
    usuario_id: int | None = None
    perfil: PerfilClienteResponse | None = None
