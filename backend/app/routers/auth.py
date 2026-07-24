from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.usuario import UsuarioModel
from app.schemas.usuario import Token, UsuarioResponse
from app.services.auth_service import AuthService, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Autenticacion"])


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Inicia sesion con username y password (formulario OAuth2 estandar) y
    devuelve un access token JWT. Usalo desde el boton "Authorize" de Swagger UI.

    Credenciales de prueba (creadas automaticamente por el seed):
    - Administrador: username=admin    / password=admin123
    - Cliente:       username=cliente / password=cliente123
    """
    usuario = AuthService.autenticar_usuario(db, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = AuthService.generar_token_para_usuario(usuario)
    return Token(access_token=token)


@router.get("/me", response_model=UsuarioResponse)
def perfil_actual(usuario_actual: UsuarioModel = Depends(get_current_user)):
    """Devuelve los datos del usuario autenticado actualmente."""
    return usuario_actual
