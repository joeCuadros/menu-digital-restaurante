from pydantic import BaseModel, Field


class UsuarioCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    es_admin: bool = True


class UsuarioResponse(BaseModel):
    id_usuario: int
    username: str
    es_admin: bool
    activo: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: str | None = None
