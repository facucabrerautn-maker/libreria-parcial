from pydantic import BaseModel, ConfigDict, Field


class EditorialCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str = Field(..., min_length=1, max_length=150)
    pais: str = Field(..., min_length=1, max_length=100)


class EditorialUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str | None = Field(None, min_length=1, max_length=150)
    pais: str | None = Field(None, min_length=1, max_length=100)


class EditorialResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    nombre: str
    pais: str
