import { Minus, Plus, Ban, CheckCircle2 } from 'lucide-react'

/**
 * Tarjeta de un platillo del catalogo.
 *
 * Modo "cliente" (por defecto): muestra selector de cantidad para agregarlo a la mesa.
 * Si el platillo esta agotado, el selector queda bloqueado y se muestra el sello "Agotado".
 *
 * Modo "admin": agrega un boton para marcar/desmarcar el platillo como agotado.
 */
export default function PlatilloCard({
  platillo,
  cantidad = 0,
  onCambiarCantidad,
  variante = 'cliente',
  onToggleDisponibilidad,
  actualizandoDisponibilidad = false,
}) {
  const agotado = !platillo.disponible

  return (
    <article
      className={`relative flex flex-col gap-3 rounded-2xl border bg-paper p-4 shadow-card transition-opacity ${
        agotado ? 'border-stone opacity-80' : 'border-stone'
      }`}
    >
      {agotado && (
        <span
          className="stamp-agotado absolute -right-2 -top-2 select-none rounded-md border-2 border-rocoto-500 bg-paper px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-rocoto-500"
          role="status"
        >
          Agotado
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold leading-snug">{platillo.nombre}</h3>
        <span className="whitespace-nowrap font-display text-lg font-semibold text-mustard-600">
          S/ {platillo.precio_unitario.toFixed(2)}
        </span>
      </div>

      {platillo.descripcion && (
        <p className="text-sm text-ink/60">{platillo.descripcion}</p>
      )}

      <span className="w-fit rounded-full bg-stone-light px-2.5 py-0.5 text-xs font-medium text-ink/60">
        {platillo.categoria}
      </span>

      {variante === 'cliente' ? (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-ink/50">
            {agotado ? 'No disponible por ahora' : 'Sin limite de unidades'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={agotado || cantidad === 0}
              onClick={() => onCambiarCantidad?.(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone text-ink/70 transition-colors hover:border-mustard-400 hover:text-mustard-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Quitar una unidad de ${platillo.nombre}`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-medium tabular-nums">{cantidad}</span>
            <button
              type="button"
              disabled={agotado}
              onClick={() => onCambiarCantidad?.(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone text-ink/70 transition-colors hover:border-mustard-400 hover:text-mustard-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Agregar una unidad de ${platillo.nombre}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={actualizandoDisponibilidad}
          onClick={() => onToggleDisponibilidad?.(platillo)}
          className={`mt-1 flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
            agotado
              ? 'border-sage-500 text-sage-500 hover:bg-sage-50'
              : 'border-rocoto-500 text-rocoto-500 hover:bg-rocoto-50'
          }`}
        >
          {agotado ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Marcar disponible
            </>
          ) : (
            <>
              <Ban className="h-4 w-4" /> Marcar agotado
            </>
          )}
        </button>
      )}
    </article>
  )
}
