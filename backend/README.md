# Backend - Menu Digital Restaurante (v1.1)

API REST del backend de **Menu Digital Restaurante**: gestiona el catalogo de platillos,
el consumo por mesa y el acceso del personal administrativo. Construida en **Python 3.12**
con **FastAPI**, organizada por capas (models / schemas / services / routers) siguiendo
principios de arquitectura limpia y el proceso de diseño de ISO/IEC 12207.

No incluye codigo de frontend ni funcionalidades fuera del alcance del backend.

---

## Tecnologias utilizadas

| Componente          | Tecnologia                          |
|----------------------|--------------------------------------|
| Lenguaje              | Python 3.12                          |
| Framework web         | FastAPI                              |
| Servidor ASGI         | Uvicorn                              |
| ORM                   | SQLAlchemy 2.0                       |
| Base de datos          | PostgreSQL (via psycopg2-binary)     |
| Validacion de datos    | Pydantic v2 / pydantic-settings      |
| Migraciones            | Alembic                              |
| Variables de entorno   | python-dotenv                        |
| Autenticacion          | JWT (python-jose) + bcrypt (passlib) |

---

## Estructura del proyecto

```text
backend/
├── app/
│   ├── main.py               # Punto de entrada, arranque y seed
│   ├── core/
│   │   ├── config.py         # Settings desde variables de entorno
│   │   └── security.py       # Hash de password y JWT
│   ├── database/
│   │   └── session.py        # Engine, SessionLocal, Base, get_db
│   ├── models/                # Entidades SQLAlchemy
│   │   ├── platillo.py
│   │   ├── mesa.py
│   │   └── usuario.py
│   ├── schemas/                # DTOs Pydantic
│   │   ├── platillo.py
│   │   ├── mesa.py
│   │   └── usuario.py
│   ├── services/                # Logica de negocio
│   │   ├── platillo_service.py
│   │   ├── mesa_service.py
│   │   ├── auth_service.py
│   │   └── seed_service.py
│   ├── routers/                  # Endpoints HTTP
│   │   ├── platillos.py
│   │   ├── mesa.py
│   │   └── auth.py
│   └── utils/
│       └── calculation.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Novedades (version 1.1)

1. **Sin limite de unidades**: se elimino la restriccion de 50 raciones maximas por platillo en la mesa.
2. **Alerta de producto agotado**: si un plato cambia a estado *agotado*, su seleccion previa se conserva
   y el endpoint de mesa devuelve una notificacion explicita en `notificaciones`, sin borrar el pedido del cliente.
3. **Login de administrador (JWT)**: los endpoints de escritura del catalogo (crear platillo, cambiar
   disponibilidad, cambiar precio) ahora requieren un token valido de administrador. Los endpoints de
   consulta del menu y de gestion de mesa siguen siendo publicos, ya que los usa el cliente sin iniciar sesion.
4. **Datos de prueba automaticos**: al levantar el servidor se siembran platillos de ejemplo y un usuario
   administrador inicial si las tablas estan vacias, para poder probar la API de inmediato. El sistema no
   maneja cuentas de cliente: los clientes usan la carta y su mesa sin iniciar sesion.
5. **Registro de personal**: `POST /api/auth/registrar` permite crear nuevas cuentas de administracion
   (username + password) sin depender solo del usuario sembrado por el seed.

---

## Instalacion y configuracion

### 1. Ingresar al directorio del backend
```bash
cd backend
```

### 2. Crear y activar el entorno virtual
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y ajusta los valores segun tu entorno:
```bash
cp .env.example .env
```

Variables disponibles:

```env
PROJECT_NAME="Menu Digital Restaurante"
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/menu_digital_db"
HOST="0.0.0.0"
PORT=8000

SECRET_KEY="cambia-esta-clave-por-una-generada-de-forma-segura"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

SEED_DATA=true
SEED_ADMIN_USERNAME="admin"
SEED_ADMIN_PASSWORD="admin123"
```

> **Importante:** cambia `SECRET_KEY` y las credenciales de `SEED_ADMIN_*` antes de desplegar a un
> entorno real. `SEED_DATA=false` desactiva por completo la siembra de datos de prueba. El sistema no
> tiene cuentas de cliente: el resto del personal se registra con `POST /api/auth/registrar`.

---

## Ejecucion local del servidor

```bash
uvicorn app.main:app --reload
```

El servidor queda disponible en: `http://localhost:8000`

Al arrancar, la aplicacion crea las tablas automaticamente y — si `SEED_DATA=true` y las tablas
estan vacias — inserta platillos de ejemplo y un usuario administrador de prueba. Esta siembra es
idempotente: se revisa en cada arranque, pero nunca duplica datos si ya existen.

---

## Autenticacion (login y registro)

1. Crea una cuenta de personal en `POST /api/auth/registrar` con `username` y `password` (JSON), o usa
   directamente la cuenta admin creada por el seed. El registro devuelve el `access_token` de una vez.
2. Para iniciar sesion con una cuenta existente, usa `POST /api/auth/login` enviando `username` y
   `password` como formulario (`application/x-www-form-urlencoded`, estandar OAuth2 password flow).
3. Credenciales de prueba creadas por el seed: `admin` / `admin123` (o las que definiste en `.env`).
4. La respuesta entrega un `access_token` tipo `bearer`. Envialo en las peticiones protegidas como:
   `Authorization: Bearer <token>`.
5. En Swagger UI puedes autenticarte con el boton **Authorize** usando esas mismas credenciales.

Endpoints protegidos (requieren token de administrador): crear platillo, cambiar disponibilidad,
cambiar precio y listar el catalogo completo (`GET /api/platillos/admin/todos`, incluye los agotados
para que el panel de administracion pueda desmarcarlos). La consulta publica del menu
(`GET /api/platillos/`) y toda la gestion de mesa (`/api/mesa/...`) permanecen publicas: el sistema no
tiene cuentas de cliente, asi que ningun cliente inicia sesion.

---

## Documentacion interactiva (Swagger UI)

* **Swagger UI:** http://localhost:8000/docs
* **ReDoc:** http://localhost:8000/redoc
