from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.session import Base


class MesaModel(Base):
    __tablename__ = "mesas"

    id_mesa = Column(Integer, primary_key=True, index=True)
    monto_total_calculado = Column(Float, default=0.00)

    items = relationship(
        "ItemSeleccionadoModel", back_populates="mesa", cascade="all, delete-orphan"
    )


class ItemSeleccionadoModel(Base):
    __tablename__ = "items_seleccionados"

    id_item = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_mesa = Column(Integer, ForeignKey("mesas.id_mesa"), nullable=False)
    id_plato = Column(Integer, ForeignKey("platillos.id_plato"), nullable=False)
    cantidad = Column(Integer, default=1, nullable=False)

    mesa = relationship("MesaModel", back_populates="items")
    platillo = relationship("PlatilloModel")
