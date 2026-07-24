from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.platillo import PlatilloModel
from app.models.usuario import UsuarioModel

PLATILLOS_DE_PRUEBA = [
    {
        "nombre": "Lomo Saltado",
        "descripcion": "Clasico salteado de res con papas fritas y arroz",
        "categoria": "Fondos",
        "precio_unitario": 28.50,
        "disponible": True,
    },
    {
        "nombre": "Aji de Gallina",
        "descripcion": "Pechuga deshilachada en crema de aji amarillo",
        "categoria": "Fondos",
        "precio_unitario": 24.00,
        "disponible": True,
    },
    {
        "nombre": "Causa Limeña",
        "descripcion": "Pure de papa amarilla relleno de pollo",
        "categoria": "Entradas",
        "precio_unitario": 18.00,
        "disponible": True,
    },
    {
        "nombre": "Chicharron de Pescado",
        "descripcion": "Trozos de pescado frito con yuca y salsa criolla",
        "categoria": "Entradas",
        "precio_unitario": 22.00,
        "disponible": False,
    },
    {
        "nombre": "Chicha Morada",
        "descripcion": "Bebida tradicional de maiz morado, 1/2 litro",
        "categoria": "Bebidas",
        "precio_unitario": 8.00,
        "disponible": True,
    },
    {
        "nombre": "Suspiro a la Limeña",
        "descripcion": "Postre de manjar blanco con merengue",
        "categoria": "Postres",
        "precio_unitario": 12.00,
        "disponible": True,
    },
]


def seed_initial_data(db: Session) -> None:
    """
    Inserta datos de prueba (platillos, un usuario admin y un usuario cliente)
    para facilitar las pruebas locales. Se ejecuta en cada arranque del
    servidor, pero es idempotente: solo escribe si la tabla correspondiente
    esta vacia, por lo que nunca duplica datos ni sobreescribe informacion real.
    """
    if not settings.SEED_DATA:
        return

    if db.query(PlatilloModel).count() == 0:
        db.bulk_save_objects([PlatilloModel(**data) for data in PLATILLOS_DE_PRUEBA])
        db.commit()

    if db.query(UsuarioModel).count() == 0:
        admin = UsuarioModel(
            username=settings.SEED_ADMIN_USERNAME,
            hashed_password=hash_password(settings.SEED_ADMIN_PASSWORD),
            es_admin=True,
            activo=True,
        )
        cliente = UsuarioModel(
            username=settings.SEED_CLIENTE_USERNAME,
            hashed_password=hash_password(settings.SEED_CLIENTE_PASSWORD),
            es_admin=False,
            activo=True,
        )
        db.add_all([admin, cliente])
        db.commit()
