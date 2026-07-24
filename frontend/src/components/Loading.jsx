export default function Loading({ etiqueta = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/60">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-mustard-400 border-t-transparent"
        role="status"
        aria-label={etiqueta}
      />
      <p className="text-sm">{etiqueta}</p>
    </div>
  )
}
