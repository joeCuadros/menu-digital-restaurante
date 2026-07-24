from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuracion centralizada de la aplicacion, cargada desde variables de entorno (.env)."""

    PROJECT_NAME: str = "Menu Digital Restaurante"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/menu_digital_db"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Seguridad / JWT
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Datos de prueba
    SEED_DATA: bool = True
    SEED_ADMIN_USERNAME: str = "admin"
    SEED_ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
