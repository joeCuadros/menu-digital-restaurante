import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loading from './Loading.jsx'

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { autenticado, esAdmin, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return <Loading etiqueta="Verificando sesion..." />
  }

  if (!autenticado) {
    return <Navigate to="/login" state={{ desde: location }} replace />
  }

  if (soloAdmin && !esAdmin) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h2 className="font-display text-xl font-semibold">Acceso restringido</h2>
        <p className="mt-2 text-ink/60">
          Tu cuenta no tiene permisos de administrador para ver esta seccion.
        </p>
      </div>
    )
  }

  return children
}
