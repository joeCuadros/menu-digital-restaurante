from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.platillo import PlatilloModel
from app.schemas.platillo import PlatilloCreate


class PlatilloService:

    @staticmethod
    def obtener_menu_filtrado(
        db: Session, categoria: Optional[str] = None, busqueda: Optional[str] = None
    ) -> List[PlatilloModel]:
        query = db.query(PlatilloModel).filter(PlatilloModel.disponible == True)  # noqa: E712

        if categoria and categoria.upper() != "TODAS":
            query = query.filter(PlatilloModel.categoria.ilike(categoria))

        if busqueda:
            query = query.filter(PlatilloModel.nombre.ilike(f"%{busqueda}%"))

        return query.all()

    @staticmethod
    def obtener_catalogo_completo(db: Session) -> List[PlatilloModel]:
        """Lista TODOS los platillos, incluidos los agotados. Uso exclusivo de administracion,
        ya que la carta publica (obtener_menu_filtrado) solo muestra los disponibles."""
        return db.query(PlatilloModel).order_by(PlatilloModel.categoria, PlatilloModel.nombre).all()


    @staticmethod
    def crear_platillo(db: Session, datos: PlatilloCreate) -> PlatilloModel:
        nuevo_plato = PlatilloModel(**datos.model_dump())
        db.add(nuevo_plato)
        db.commit()
        db.refresh(nuevo_plato)
        return nuevo_plato

    @staticmethod
    def actualizar_disponibilidad(
        db: Session, id_plato: int, disponible: bool
    ) -> Optional[PlatilloModel]:
        plato = db.query(PlatilloModel).filter(PlatilloModel.id_plato == id_plato).first()
        if plato:
            plato.disponible = disponible
            db.commit()
            db.refresh(plato)
        return plato

    @staticmethod
    def actualizar_precio(
        db: Session, id_plato: int, nuevo_precio: float
    ) -> Optional[PlatilloModel]:
        plato = db.query(PlatilloModel).filter(PlatilloModel.id_plato == id_plato).first()
        if plato:
            plato.precio_unitario = round(nuevo_precio, 2)
            db.commit()
            db.refresh(plato)
        return plato
