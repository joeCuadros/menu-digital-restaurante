from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.session import Base, engine, SessionLocal
from app.routers import platillos, mesa, auth
from app.services.seed_service import seed_initial_data

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.1.0",
    description="API REST Backend para la gestion de Menu Digital de Restaurante (ISO/IEC 12207).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(platillos.router)
app.include_router(mesa.router)


@app.on_event("startup")
def on_startup() -> None:
    """
    Al iniciar el servidor:
    1. Crea las tablas si no existen.
    2. Siembra datos de prueba (platillos + usuario admin) SOLO si las
       tablas estan vacias, para que el proyecto se pueda probar de
       inmediato sin llenar el catalogo a mano.
    """
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()


@app.get("/", tags=["Health Check"])
def check_status():
    return {
        "status": "ok",
        "sistema": settings.PROJECT_NAME,
        "version": "1.1.0",
    }
