import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import CategoriaFilter from '../components/CategoriaFilter.jsx'
import PlatilloCard from '../components/PlatilloCard.jsx'
import Loading from '../components/Loading.jsx'
import { listarPlatillos } from '../services/api.js'
import { useMesa } from '../hooks/useMesa.js'

const MESA_ACTIVA_KEY = 'menu_digital_mesa_activa'

export default function Menu() {
  const [idMesa, setIdMesa] = useState(() => localStorage.getItem(MESA_ACTIVA_KEY) || '1')
  const [platillos, setPlatillos] = useState([])
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargandoMenu, setCargandoMenu] = useState(true)

  const { mesa, cambiarCantidad } = useMesa(idMesa)

  useEffect(() => {
    localStorage.setItem(MESA_ACTIVA_KEY, idMesa)
  }, [idMesa])

  useEffect(() => {
    let activo = true
    setCargandoMenu(true)
    listarPlatillos({ categoria, busqueda })
      .then((data) => activo && setPlatillos(data))
      .catch(() => activo && toast.error('No se pudo cargar el menu. Verifica el backend.'))
      .finally(() => activo && setCargandoMenu(false))
    return () => {
      activo = false
    }
  }, [categoria, busqueda])

  const cantidadesPorPlato = useMemo(() => {
    const mapa = {}
    mesa?.items?.forEach((item) => {
      mapa[item.id_plato] = item.cantidad
    })
    return mapa
  }, [mesa])

  const totalUnidades = mesa?.items?.reduce((acc, item) => acc + item.cantidad, 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-mustard-600">
          Carta digital
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Nuestro menu de hoy</h1>
        <p className="mt-1 text-ink/60">
          Explora los platillos disponibles. Los agotados quedan marcados y no se pueden seleccionar.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-stone bg-stone-light p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
          Numero de mesa
          <input
            type="number"
            min="1"
            value={idMesa}
            onChange={(e) => setIdMesa(e.target.value || '1')}
            className="w-20 rounded-full border border-stone bg-paper px-3 py-1.5 text-center outline-none focus:border-mustard-400"
          />
        </label>
        <p className="text-xs text-ink/50">
          Tu seleccion se guarda automaticamente en esta mesa, sin limite de unidades por platillo.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoriaFilter categoriaActiva={categoria} onCambiarCategoria={setCategoria} />
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar platillo..."
            className="w-full rounded-full border border-stone bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-mustard-400"
          />
        </div>
      </div>

      {cargandoMenu ? (
        <Loading etiqueta="Cargando la carta..." />
      ) : platillos.length === 0 ? (
        <p className="py-16 text-center text-ink/50">
          No encontramos platillos con esos filtros. Prueba con otra categoria o busqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platillos.map((platillo) => (
            <PlatilloCard
              key={platillo.id_plato}
              platillo={platillo}
              cantidad={cantidadesPorPlato[platillo.id_plato] ?? 0}
              onCambiarCantidad={(delta) => cambiarCantidad(platillo.id_plato, delta)}
            />
          ))}
        </div>
      )}

      {totalUnidades > 0 && (
        <Link
          to={`/mesa/${idMesa}`}
          className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-mustard-400 bg-mustard-50 px-4 py-3 shadow-card transition-colors hover:bg-mustard-200/60"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-mustard-600">
            <ShoppingBag className="h-4 w-4" />
            {totalUnidades} unidad{totalUnidades === 1 ? '' : 'es'} en tu mesa
          </span>
          <span className="rounded-full bg-mustard-400 px-4 py-2 text-sm font-semibold text-white">
            Ver mi cuenta
          </span>
        </Link>
      )}
    </div>
  )
}
