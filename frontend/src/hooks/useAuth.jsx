import { createContext, useContext, useEffect, useState } from 'react'
import {
  loginRequest,
  registrarRequest,
  obtenerPerfil,
  guardarToken,
  obtenerTokenGuardado,
  limpiarToken,
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = obtenerTokenGuardado()
    if (!token) {
      setCargando(false)
      return
    }

    obtenerPerfil()
      .then((data) => setUsuario(data))
      .catch(() => limpiarToken())
      .finally(() => setCargando(false))
  }, [])

  async function iniciarSesion(username, password) {
    const { access_token: token } = await loginRequest(username, password)
    guardarToken(token)
    const perfil = await obtenerPerfil()
    setUsuario(perfil)
    return perfil
  }

  async function registrarse(username, password) {
    const { access_token: token } = await registrarRequest(username, password)
    guardarToken(token)
    const perfil = await obtenerPerfil()
    setUsuario(perfil)
    return perfil
  }

  function cerrarSesion() {
    limpiarToken()
    setUsuario(null)
  }

  const value = {
    usuario,
    cargando,
    autenticado: Boolean(usuario),
    esAdmin: Boolean(usuario?.es_admin),
    iniciarSesion,
    registrarse,
    cerrarSesion,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
