import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import PlatilloCard from '../components/PlatilloCard.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { listarCatalogoCompleto, crearPlatillo, actualizarDisponibilidad } from '../services/api.js'

const CATEGORIAS_FORM = ['Entradas', 'Fondos', 'Bebidas', 'Postres']

const FORM_INICIAL = {
  nombre: '',
  descripcion: '',
  categoria: CATEGORIAS_FORM[0],
  precio_unitario: '',
}

export default function Admin() {
  const { usuario } = useAuth()
  const [platillos, setPlatillos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizandoId, setActualizandoId] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [creando, setCreando] = useState(false)

  async function cargarTodo() {
    setCargando(true)
    try {
      // El catalogo publico solo trae disponibles; el admin necesita ver tambien los agotados.
      const data = await listarCatalogoCompleto()
      setPlatillos(data)
    } catch (err) {
      toast.error('No se pudo cargar el catalogo.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  async function manejarToggleDisponibilidad(platillo) {
    setActualizandoId(platillo.id_plato)
    try {
      const actualizado = await actualizarDisponibilidad(platillo.id_plato, !platillo.disponible)
      setPlatillos((prev) =>
        prev.map((p) => (p.id_plato === actualizado.id_plato ? actualizado : p))
      )
      toast.success(
        actualizado.disponible
          ? `${actualizado.nombre} vuelve a estar disponible.`
          : `${actualizado.nombre} se marco como agotado.`
      )
    } catch (err) {
      toast.error('No se pudo actualizar la disponibilidad.')
    } finally {
      setActualizandoId(null)
    }
  }

  async function manejarCrearPlatillo(e) {
    e.preventDefault()
    setCreando(true)
    try {
      const nuevo = await crearPlatillo({
        ...form,
        precio_unitario: Number(form.precio_unitario),
      })
      setPlatillos((prev) => [...prev, nuevo])
      setForm(FORM_INICIAL)
      toast.success(`${nuevo.nombre} agregado al catalogo.`)
    } catch (err) {
      toast.error('No se pudo crear el platillo. Revisa los datos.')
    } finally {
      setCreando(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-mustard-600">
          Administracion
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Gestion del catalogo</h1>
        <p className="mt-1 text-ink/60">
          Sesion activa: <span className="font-medium text-ink">{usuario?.username}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-stone p-5">
        <h2 className="font-display text-xl font-semibold">Agregar platillo</h2>
        <form onSubmit={manejarCrearPlatillo} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
            Nombre
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
            Categoria
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
            >
              {CATEGORIAS_FORM.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-ink/70 sm:col-span-2">
            Descripcion
            <input
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
            Precio unitario (S/)
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.precio_unitario}
              onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })}
              className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
            />
          </label>

          <div className="flex items-end sm:col-span-2">
            <button
              type="submit"
              disabled={creando}
              className="flex items-center gap-2 rounded-full bg-mustard-400 px-4 py-2.5 text-sm font-semibold text-white hover:bg-mustard-500 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {creando ? 'Guardando...' : 'Agregar al catalogo'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Catalogo actual</h2>
        {cargando ? (
          <Loading etiqueta="Cargando catalogo..." />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platillos.map((platillo) => (
              <PlatilloCard
                key={platillo.id_plato}
                platillo={platillo}
                variante="admin"
                onToggleDisponibilidad={manejarToggleDisponibilidad}
                actualizandoDisponibilidad={actualizandoId === platillo.id_plato}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
