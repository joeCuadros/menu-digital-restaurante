from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.usuario import UsuarioModel
from app.schemas.usuario import Token, UsuarioCreate, UsuarioResponse
from app.services.auth_service import AuthService, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Autenticacion"])


@router.post("/registrar", response_model=Token, status_code=status.HTTP_201_CREATED)
def registrar(datos: UsuarioCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva cuenta de personal administrativo y devuelve un access
    token, para que quede la sesion iniciada de inmediato tras registrarse.

    El sistema no maneja cuentas de cliente: los clientes usan la carta y su
    mesa sin iniciar sesion. Solo el personal del restaurante se registra aqui.
    """
    usuario = AuthService.registrar_usuario(db, datos)
    token = AuthService.generar_token_para_usuario(usuario)
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Inicia sesion con username y password (formulario OAuth2 estandar) y
    devuelve un access token JWT. Usalo desde el boton "Authorize" de Swagger UI.

    Credenciales de prueba (creadas automaticamente por el seed):
    - Administrador: username=admin    / password=admin123
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
