from pydantic import BaseModel, ConfigDict, Field


class AutorCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str = Field(..., min_length=1, max_length=150)
    nacionalidad: str = Field(..., min_length=1, max_length=100)


class AutorUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str | None = Field(None, min_length=1, max_length=150)
    nacionalidad: str | None = Field(None, min_length=1, max_length=100)


class AutorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    nombre: str
    nacionalidad: str
