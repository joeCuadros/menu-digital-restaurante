from typing import Optional

from pydantic import BaseModel, Field


class PlatilloBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    categoria: str
    precio_unitario: float = Field(..., gt=0, description="Precio unitario en Soles (S/)")
    disponible: bool = True


class PlatilloCreate(PlatilloBase):
    pass


class PlatilloUpdatePrecio(BaseModel):
    nuevo_precio: float = Field(..., gt=0, description="Nuevo precio unitario en Soles (S/)")


class PlatilloUpdateDisponibilidad(BaseModel):
    disponible: bool


class PlatilloResponse(PlatilloBase):
    id_plato: int

    class Config:
        from_attributes = True
