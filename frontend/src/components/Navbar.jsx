import { NavLink } from 'react-router-dom'
import { UtensilsCrossed, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useMesaActiva } from '../hooks/useMesaActiva.jsx'

const linkBase =
  'px-3 py-2 text-sm font-medium rounded-full transition-colors'

export default function Navbar() {
  const { autenticado, esAdmin, usuario, cerrarSesion } = useAuth()
  const { idMesa } = useMesaActiva()

  return (
    <header className="sticky top-0 z-20 border-b border-stone bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <UtensilsCrossed className="h-5 w-5 text-mustard-500" aria-hidden="true" />
          Menu Digital
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-mustard-50 text-mustard-600' : 'text-ink/70 hover:bg-stone-light'}`
            }
          >
            Carta
          </NavLink>
          <NavLink
            to={`/mesa/${idMesa}`}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-mustard-50 text-mustard-600' : 'text-ink/70 hover:bg-stone-light'}`
            }
          >
            Mi mesa
          </NavLink>

          {autenticado && esAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-mustard-50 text-mustard-600' : 'text-ink/70 hover:bg-stone-light'}`
              }
            >
              Administracion
            </NavLink>
          )}

          {autenticado && (
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink/70 hover:bg-stone-light"
              title={`Cerrar sesion de ${usuario?.username}`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Salir
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
