from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.mesa import EstadoMesaResponse, ItemSeleccionadoUpdate
from app.services.mesa_service import MesaService

router = APIRouter(prefix="/api/mesa", tags=["Gestion de Mesa y Consumo"])


@router.get("/{id_mesa}", response_model=EstadoMesaResponse)
def consultar_mesa(id_mesa: int, db: Session = Depends(get_db)):
    """Obtiene el consumo actual y el calculo total de la mesa."""
    return MesaService.obtener_estado_mesa(db, id_mesa)


@router.post("/{id_mesa}/item", response_model=EstadoMesaResponse)
def actualizar_item_mesa(
    id_mesa: int, datos: ItemSeleccionadoUpdate, db: Session = Depends(get_db)
):
    """RF03: incrementa o decrementa la cantidad de un platillo en la mesa.
    v1.1: sin limite superior de 50 unidades."""
    return MesaService.actualizar_cantidad_plato(db, id_mesa, datos.id_plato, datos.delta_cantidad)


@router.delete("/{id_mesa}/limpiar", response_model=EstadoMesaResponse)
def reiniciar_cuenta_mesa(id_mesa: int, db: Session = Depends(get_db)):
    """RF09: reinicia y limpia la cuenta completa de la mesa."""
    return MesaService.reiniciar_mesa(db, id_mesa)
