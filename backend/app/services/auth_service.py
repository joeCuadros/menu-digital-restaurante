from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.database.session import get_db
from app.models.usuario import UsuarioModel
from app.schemas.usuario import UsuarioCreate

# apunta al endpoint de login para que Swagger UI muestre el boton "Authorize"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


class AuthService:

    @staticmethod
    def obtener_usuario_por_username(db: Session, username: str) -> Optional[UsuarioModel]:
        return db.query(UsuarioModel).filter(UsuarioModel.username == username).first()

    @staticmethod
    def autenticar_usuario(db: Session, username: str, password: str) -> Optional[UsuarioModel]:
        usuario = AuthService.obtener_usuario_por_username(db, username)
        if not usuario or not usuario.activo:
            return None
        if not verify_password(password, usuario.hashed_password):
            return None
        return usuario

    @staticmethod
    def registrar_usuario(db: Session, datos: UsuarioCreate) -> UsuarioModel:
        """Crea una nueva cuenta de personal administrativo. El sistema no maneja
        cuentas de cliente: solo el personal del restaurante inicia sesion."""
        if AuthService.obtener_usuario_por_username(db, datos.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ese nombre de usuario ya esta en uso.",
            )

        nuevo_usuario = UsuarioModel(
            username=datos.username,
            hashed_password=hash_password(datos.password),
            es_admin=True,
            activo=True,
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario

    @staticmethod
    def generar_token_para_usuario(usuario: UsuarioModel) -> str:
        return create_access_token(subject=usuario.username)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> UsuarioModel:
    """Dependencia: exige un JWT valido y devuelve el usuario autenticado."""
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    username = decode_access_token(token)
    if not username:
        raise credenciales_invalidas

    usuario = AuthService.obtener_usuario_por_username(db, username)
    if not usuario or not usuario.activo:
        raise credenciales_invalidas

    return usuario


def get_current_admin_user(usuario: UsuarioModel = Depends(get_current_user)) -> UsuarioModel:
    """Dependencia: exige ademas que el usuario autenticado tenga rol de administrador."""
    if not usuario.es_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador para esta accion.",
        )
    return usuario
