from sqlalchemy import Column, Integer, String, Float, Boolean

from app.database.session import Base


class PlatilloModel(Base):
    __tablename__ = "platillos"

    id_plato = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)
    categoria = Column(String(50), nullable=False)
    precio_unitario = Column(Float, nullable=False)
    disponible = Column(Boolean, default=True, nullable=False)
