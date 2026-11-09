from pydantic import BaseModel, ConfigDict, Field


class GeneroCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str = Field(..., min_length=1, max_length=100)


class GeneroResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)

    id: int
    nombre: str
