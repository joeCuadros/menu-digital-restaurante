from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.usuario import UsuarioModel
from app.schemas.platillo import (
    PlatilloResponse,
    PlatilloCreate,
    PlatilloUpdateDisponibilidad,
    PlatilloUpdatePrecio,
)
from app.services.auth_service import get_current_admin_user
from app.services.platillo_service import PlatilloService

router = APIRouter(prefix="/api/platillos", tags=["Platillos y Catalogo"])


@router.get("/", response_model=List[PlatilloResponse])
def listar_platillos(
    categoria: Optional[str] = Query(None, description="Filtrar por categoria (ej. Entradas, Bebidas)"),
    busqueda: Optional[str] = Query(None, description="Busqueda por nombre de plato"),
    db: Session = Depends(get_db),
):
    """RF01, RF02, RF08: lista la carta filtrada por categoria y busqueda (solo platillos disponibles).
    Endpoint publico: no requiere autenticacion, lo usan los clientes en su mesa."""
    return PlatilloService.obtener_menu_filtrado(db, categoria, busqueda)


@router.post("/", response_model=PlatilloResponse, status_code=status.HTTP_201_CREATED)
def crear_platillo(
    datos: PlatilloCreate,
    db: Session = Depends(get_db),
    _admin: UsuarioModel = Depends(get_current_admin_user),
):
    """Registra un nuevo platillo en el catalogo. Requiere sesion de administrador."""
    return PlatilloService.crear_platillo(db, datos)


@router.patch("/{id_plato}/disponibilidad", response_model=PlatilloResponse)
def cambiar_disponibilidad(
    id_plato: int,
    datos: PlatilloUpdateDisponibilidad,
    db: Session = Depends(get_db),
    _admin: UsuarioModel = Depends(get_current_admin_user),
):
    """RF05: actualiza el estado de disponibilidad ('Disponible' / 'Agotado'). Requiere administrador."""
    plato = PlatilloService.actualizar_disponibilidad(db, id_plato, datos.disponible)
    if not plato:
        raise HTTPException(status_code=404, detail="El platillo especificado no existe.")
    return plato


@router.patch("/{id_plato}/precio", response_model=PlatilloResponse)
def cambiar_precio(
    id_plato: int,
    datos: PlatilloUpdatePrecio,
    db: Session = Depends(get_db),
    _admin: UsuarioModel = Depends(get_current_admin_user),
):
    """RF06: actualiza el precio unitario del platillo en Soles (S/). Requiere administrador."""
    plato = PlatilloService.actualizar_precio(db, id_plato, datos.nuevo_precio)
    if not plato:
        raise HTTPException(status_code=404, detail="El platillo especificado no existe.")
    return plato
