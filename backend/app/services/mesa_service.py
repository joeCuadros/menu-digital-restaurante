from sqlalchemy.orm import Session

from app.models.mesa import MesaModel, ItemSeleccionadoModel
from app.models.platillo import PlatilloModel
from app.schemas.mesa import EstadoMesaResponse, ItemSeleccionadoResponse
from app.utils.calculation import calcular_total_mesa


class MesaService:

    @staticmethod
    def obtener_o_crear_mesa(db: Session, id_mesa: int) -> MesaModel:
        mesa = db.query(MesaModel).filter(MesaModel.id_mesa == id_mesa).first()
        if not mesa:
            mesa = MesaModel(id_mesa=id_mesa, monto_total_calculado=0.00)
            db.add(mesa)
            db.commit()
            db.refresh(mesa)
        return mesa

    @staticmethod
    def actualizar_cantidad_plato(
        db: Session, id_mesa: int, id_plato: int, delta: int
    ) -> EstadoMesaResponse:
        MesaService.obtener_o_crear_mesa(db, id_mesa)
        item = (
            db.query(ItemSeleccionadoModel)
            .filter(
                ItemSeleccionadoModel.id_mesa == id_mesa,
                ItemSeleccionadoModel.id_plato == id_plato,
            )
            .first()
        )

        if item:
            nueva_cantidad = item.cantidad + delta
            # RF03: la cantidad minima es 0. v1.1: sin limite superior de 50 unidades.
            item.cantidad = max(nueva_cantidad, 0)
        elif delta > 0:
            item = ItemSeleccionadoModel(id_mesa=id_mesa, id_plato=id_plato, cantidad=delta)
            db.add(item)

        db.commit()
        return MesaService.obtener_estado_mesa(db, id_mesa)

    @staticmethod
    def obtener_estado_mesa(db: Session, id_mesa: int) -> EstadoMesaResponse:
        mesa = MesaService.obtener_o_crear_mesa(db, id_mesa)
        items_db = db.query(ItemSeleccionadoModel).filter(
            ItemSeleccionadoModel.id_mesa == id_mesa
        ).all()

        monto_total, notificaciones = calcular_total_mesa(items_db)
        mesa.monto_total_calculado = monto_total
        db.commit()

        items_response = []
        for it in items_db:
            plato = db.query(PlatilloModel).filter(PlatilloModel.id_plato == it.id_plato).first()
            if plato:
                subtotal = round(it.cantidad * plato.precio_unitario, 2) if plato.disponible else 0.00
                items_response.append(
                    ItemSeleccionadoResponse(
                        id_plato=plato.id_plato,
                        nombre_plato=plato.nombre,
                        precio_unitario=plato.precio_unitario,
                        cantidad=it.cantidad,
                        subtotal=subtotal,
                        disponible=plato.disponible,
                    )
                )

        return EstadoMesaResponse(
            id_mesa=mesa.id_mesa,
            items=items_response,
            monto_total_calculado=monto_total,
            notificaciones=notificaciones,
        )

    @staticmethod
    def reiniciar_mesa(db: Session, id_mesa: int) -> EstadoMesaResponse:
        db.query(ItemSeleccionadoModel).filter(ItemSeleccionadoModel.id_mesa == id_mesa).delete()
        mesa = MesaService.obtener_o_crear_mesa(db, id_mesa)
        mesa.monto_total_calculado = 0.00
        db.commit()
        return MesaService.obtener_estado_mesa(db, id_mesa)
