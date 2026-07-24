import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_URL no esta definida. Copia .env.example a .env y configura la URL del backend.'
  )
}

const TOKEN_KEY = 'menu_digital_token'

export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function obtenerTokenGuardado() {
  return localStorage.getItem(TOKEN_KEY)
}

export function limpiarToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const api = axios.create({
  baseURL: API_URL,
})

// Adjunta el token JWT (si existe) a cada peticion saliente.
api.interceptors.request.use((config) => {
  const token = obtenerTokenGuardado()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expira o es invalido, se limpia para forzar un nuevo login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      limpiarToken()
    }
    return Promise.reject(error)
  }
)

/* ---------- Autenticacion ---------- */

export async function registrarRequest(username, password) {
  const { data } = await api.post('/api/auth/registrar', { username, password })
  return data
}

export async function loginRequest(username, password) {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)

  const { data } = await api.post('/api/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function obtenerPerfil() {
  const { data } = await api.get('/api/auth/me')
  return data
}

/* ---------- Platillos / Catalogo ---------- */

export async function listarPlatillos({ categoria, busqueda } = {}) {
  const { data } = await api.get('/api/platillos/', {
    params: {
      ...(categoria && categoria !== 'Todas' ? { categoria } : {}),
      ...(busqueda ? { busqueda } : {}),
    },
  })
  return data
}

export async function listarCatalogoCompleto() {
  const { data } = await api.get('/api/platillos/admin/todos')
  return data
}

export async function crearPlatillo(datos) {
  const { data } = await api.post('/api/platillos/', datos)
  return data
}

export async function actualizarDisponibilidad(idPlato, disponible) {
  const { data } = await api.patch(`/api/platillos/${idPlato}/disponibilidad`, { disponible })
  return data
}

export async function actualizarPrecio(idPlato, nuevoPrecio) {
  const { data } = await api.patch(`/api/platillos/${idPlato}/precio`, {
    nuevo_precio: nuevoPrecio,
  })
  return data
}

/* ---------- Mesa / Consumo ---------- */

export async function obtenerEstadoMesa(idMesa) {
  const { data } = await api.get(`/api/mesa/${idMesa}`)
  return data
}

export async function actualizarItemMesa(idMesa, idPlato, deltaCantidad) {
  const { data } = await api.post(`/api/mesa/${idMesa}/item`, {
    id_plato: idPlato,
    delta_cantidad: deltaCantidad,
  })
  return data
}

export async function reiniciarMesa(idMesa) {
  const { data } = await api.delete(`/api/mesa/${idMesa}/limpiar`)
  return data
}
