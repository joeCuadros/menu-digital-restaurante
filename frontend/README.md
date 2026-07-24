# Frontend - Menu Digital Restaurante (v1.1)

Interfaz web del proyecto **Menu Digital Restaurante**: la carta digital que ven los clientes,
la cuenta de su mesa y el panel de administracion del catalogo. Construida con **React 18** y
**Vite**, consume la API REST del backend en FastAPI a traves de una URL configurable por
variables de entorno (nunca direcciones quemadas en el codigo).

No incluye codigo ni logica de backend; solo la capa de presentacion.

---

## Tecnologias utilizadas

| Componente            | Tecnologia          |
|-------------------------|----------------------|
| Libreria de UI           | React 18             |
| Bundler / dev server      | Vite                 |
| Lenguaje                  | JavaScript (JSX)     |
| Estilos                   | Tailwind CSS         |
| Cliente HTTP               | Axios                |
| Enrutamiento                | React Router DOM     |
| Iconos                      | lucide-react         |
| Notificaciones               | react-hot-toast       |

---

## Estructura del proyecto

```text
frontend/
├── src/
│   ├── assets/                 # Imagenes e iconos estaticos
│   ├── components/
│   │   ├── PlatilloCard.jsx    # Tarjeta de platillo (modo cliente / admin)
│   │   ├── CategoriaFilter.jsx # Filtro de categorias del menu
│   │   ├── Navbar.jsx          # Barra de navegacion
│   │   ├── Loading.jsx         # Indicador de carga
│   │   └── ProtectedRoute.jsx  # Bloquea rutas que requieren sesion de admin
│   ├── pages/
│   │   ├── Menu.jsx            # Carta digital publica
│   │   ├── Mesa.jsx            # Cuenta y total de una mesa
│   │   ├── Admin.jsx           # Gestion del catalogo (requiere login)
│   │   ├── Login.jsx           # Inicio de sesion del personal
│   │   └── Registrar.jsx       # Alta de nuevas cuentas de personal
│   ├── services/
│   │   └── api.js              # Cliente Axios y llamadas a la API
│   ├── hooks/
│   │   ├── useAuth.jsx         # Contexto/estado de autenticacion (JWT)
│   │   └── useMesa.js          # Carga y mutaciones del estado de una mesa
│   ├── layouts/
│   │   └── MainLayout.jsx      # Navbar + contenedor de paginas + toasts
│   ├── routes/
│   │   └── AppRouter.jsx       # Definicion de rutas
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Novedades (version 1.1)

1. **Sin limite de unidades**: los controles de cantidad ya no bloquean la seleccion en 50 unidades;
   se puede seguir sumando mientras el backend lo permita.
2. **Estado agotado visible**: cada `PlatilloCard` muestra un sello **"Agotado"** cuando el platillo no
   esta disponible, y sus controles de cantidad quedan deshabilitados para impedir la seleccion.
3. **Notificacion sin perder la seleccion**: si un platillo ya elegido pasa a estado agotado, la pagina
   de la mesa muestra la alerta que envia el backend (`notificaciones`) sin eliminar el item; el cliente
   sigue viendo su cantidad, pero el subtotal no se suma al total.
4. **Panel de administrador con login**: `Admin.jsx` esta protegido por `ProtectedRoute` y requiere una
   sesion JWT de administrador. Desde ahi se puede marcar/desmarcar un platillo como agotado con un
   boton y registrar nuevos platillos.
5. **Registro de personal y navegacion solo para admin**: `Registrar.jsx` crea nuevas cuentas de
   administracion (no hay cuentas de cliente: el sistema no las maneja). La barra de navegacion que ve
   el cliente solo muestra "Carta" y "Mi mesa"; el enlace a Administracion solo aparece una vez que hay
   una sesion de admin iniciada. El personal accede escribiendo directamente `/login` o `/registrar`.

---

## Instalacion de dependencias

```bash
cd frontend
npm install
```

---

## Configuracion del archivo `.env`

Copia el archivo de ejemplo y ajusta la URL del backend segun tu entorno:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
```

> Todas las llamadas a la API pasan por `src/services/api.js`, que lee `VITE_API_URL`. No hay
> direcciones del backend escritas directamente en los componentes.

---

## Ejecucion en desarrollo

```bash
npm run dev
```

La aplicacion queda disponible en `http://localhost:5173` (asegurate de que el backend este
corriendo en la URL configurada en `.env`).

El cliente entra directo a la carta (`/`) y a su mesa (`/mesa/:idMesa`), sin ver ningun enlace de
administracion. El personal accede escribiendo `/login` (o `/registrar` para crear una cuenta nueva).
Credenciales de prueba sembradas por el backend: `admin` / `admin123`.

---

## Compilacion para produccion

```bash
npm run build
```

Genera la version optimizada en la carpeta `dist/`. Para revisarla localmente antes de desplegar:

```bash
npm run preview
```

---

## Despliegue en Vercel

1. Sube el repositorio (con las carpetas `frontend/` y `backend/`) a GitHub/GitLab/Bitbucket.
2. En Vercel, crea un nuevo proyecto e importa el repositorio.
3. En **Root Directory**, selecciona `frontend/` (para que Vercel no intente construir el backend).
4. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
5. En **Environment Variables**, agrega `VITE_API_URL` con la URL publica de tu backend
   (por ejemplo, el servicio desplegado en Render).
6. Despliega. Cada vez que el backend cambie de URL, solo hace falta actualizar esa variable
   de entorno en Vercel y volver a desplegar.

Este esquema separa responsabilidades: el frontend (React) vive en Vercel, el backend (FastAPI)
vive en Render, y ambos comparten un mismo repositorio con carpetas independientes `frontend/` y
`backend/`.
