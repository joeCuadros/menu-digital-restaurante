import { useParams } from 'react-router-dom'
import { Minus, Plus, RotateCcw, AlertTriangle } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { useMesa } from '../hooks/useMesa.js'

export default function Mesa() {
  const { idMesa } = useParams()
  const { mesa, cargando, cambiarCantidad, limpiarMesa } = useMesa(idMesa)

  if (cargando) {
    return <Loading etiqueta="Cargando tu cuenta..." />
  }

  if (!mesa) {
    return <p className="py-16 text-center text-ink/50">No se pudo cargar la mesa {idMesa}.</p>
  }

  const itemsConCantidad = mesa.items.filter((item) => item.cantidad > 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-mustard-600">
          Mesa {mesa.id_mesa}
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Tu cuenta</h1>
        <p className="mt-1 text-ink/60">
          Ajusta las cantidades cuando quieras. No hay limite de unidades por platillo.
        </p>
      </div>

      {mesa.notificaciones.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-rocoto-500/40 bg-rocoto-50 p-4">
          {mesa.notificaciones.map((mensaje, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-rocoto-600">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{mensaje}</span>
            </div>
          ))}
        </div>
      )}

      {itemsConCantidad.length === 0 ? (
        <p className="py-16 text-center text-ink/50">
          Aun no has agregado platillos. Ve a la carta para empezar a pedir.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-light text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Platillo</th>
                <th className="px-4 py-3 font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              {itemsConCantidad.map((item) => (
                <tr key={item.id_plato} className={!item.disponible ? 'bg-rocoto-50/40' : ''}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.nombre_plato}</p>
                    {!item.disponible && (
                      <span className="text-xs font-semibold uppercase text-rocoto-500">
                        Agotado &mdash; no se suma al total
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(item.id_plato, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-stone text-ink/70 hover:border-mustard-400 hover:text-mustard-600"
                        aria-label={`Quitar una unidad de ${item.nombre_plato}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center tabular-nums">{item.cantidad}</span>
                      <button
                        type="button"
                        disabled={!item.disponible}
                        onClick={() => cambiarCantidad(item.id_plato, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-stone text-ink/70 hover:border-mustard-400 hover:text-mustard-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Agregar una unidad de ${item.nombre_plato}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    S/ {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-stone bg-stone-light px-4 py-4">
            <button
              type="button"
              onClick={limpiarMesa}
              className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-rocoto-500"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar cuenta
            </button>
            <p className="font-display text-xl font-semibold">
              Total: S/ {mesa.monto_total_calculado.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
