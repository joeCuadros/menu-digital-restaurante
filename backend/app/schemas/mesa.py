from typing import List

from pydantic import BaseModel, Field


class ItemSeleccionadoUpdate(BaseModel):
    id_plato: int
    delta_cantidad: int = Field(..., description="Incremento (+1) o decremento (-1) de unidades")


class ItemSeleccionadoResponse(BaseModel):
    id_plato: int
    nombre_plato: str
    precio_unitario: float
    cantidad: int
    subtotal: float
    disponible: bool

    class Config:
        from_attributes = True


class EstadoMesaResponse(BaseModel):
    id_mesa: int
    items: List[ItemSeleccionadoResponse]
    monto_total_calculado: float
    notificaciones: List[str] = []

    class Config:
        from_attributes = True
