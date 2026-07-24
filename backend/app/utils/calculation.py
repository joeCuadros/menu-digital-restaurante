from typing import List, Tuple

from app.models.mesa import ItemSeleccionadoModel


def calcular_total_mesa(items: List[ItemSeleccionadoModel]) -> Tuple[float, List[str]]:
    """
    Calcula el total en Soles (S/) de la mesa.

    Mejora v1.1: si un plato esta agotado, se genera una notificacion y su
    subtotal no se suma al total, pero la seleccion del usuario se conserva
    (no se elimina automaticamente el item).
    """
    subtotal_acumulado = 0.00
    notificaciones = []

    for item in items:
        if item.cantidad > 0:
            plato = item.platillo
            if plato and plato.disponible:
                subtotal_acumulado += item.cantidad * plato.precio_unitario
            else:
                nombre = plato.nombre if plato else f"ID {item.id_plato}"
                notificaciones.append(
                    f"Alerta: El platillo '{nombre}' se encuentra agotado actualmente. "
                    "Se mantiene en su lista pero no se suma al total."
                )

    return round(subtotal_acumulado, 2), notificaciones
