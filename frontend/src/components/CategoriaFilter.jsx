const CATEGORIAS = ['Todas', 'Entradas', 'Fondos', 'Bebidas', 'Postres']

export default function CategoriaFilter({ categoriaActiva, onCambiarCategoria }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
      {CATEGORIAS.map((categoria) => {
        const activa = categoria === categoriaActiva
        return (
          <button
            key={categoria}
            type="button"
            onClick={() => onCambiarCategoria(categoria)}
            aria-pressed={activa}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activa
                ? 'border-mustard-400 bg-mustard-400 text-white'
                : 'border-stone bg-paper text-ink/70 hover:border-mustard-200 hover:text-ink'
            }`}
          >
            {categoria}
          </button>
        )
      })}
    </div>
  )
}
