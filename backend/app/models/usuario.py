from sqlalchemy import Column, Integer, String, Boolean

from app.database.session import Base


class UsuarioModel(Base):
    """Usuario del panel administrativo (personal del restaurante)."""

    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    es_admin = Column(Boolean, default=True, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
