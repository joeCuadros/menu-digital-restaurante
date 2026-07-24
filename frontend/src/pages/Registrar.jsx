import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Registrar() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { registrarse } = useAuth()
  const navigate = useNavigate()

  async function manejarEnvio(e) {
    e.preventDefault()

    if (password !== confirmacion) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    try {
      const perfil = await registrarse(username, password)
      toast.success(`Cuenta creada. Bienvenido, ${perfil.username}`)
      navigate('/admin', { replace: true })
    } catch (err) {
      const detalle = err.response?.data?.detail
      toast.error(detalle || 'No se pudo crear la cuenta.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold">Registrar cuenta</h1>
        <p className="mt-1 text-sm text-ink/60">
          Solo para el personal del restaurante que va a administrar la carta.
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-4 rounded-2xl border border-stone p-6 shadow-card">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
          Usuario
          <input
            type="text"
            required
            minLength={3}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
          Contraseña
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
          Confirmar contraseña
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
          />
        </label>

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-mustard-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mustard-500 disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" />
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-xs text-ink/50">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-mustard-600 hover:underline">
            Inicia sesion
          </Link>
        </p>
      </form>
    </div>
  )
}
