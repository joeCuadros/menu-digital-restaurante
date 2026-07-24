import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function manejarEnvio(e) {
    e.preventDefault()
    setEnviando(true)
    try {
      const perfil = await iniciarSesion(username, password)
      toast.success(`Bienvenido, ${perfil.username}`)
      const destino = location.state?.desde?.pathname || '/admin'
      navigate(destino, { replace: true })
    } catch (err) {
      toast.error('Usuario o contraseña incorrectos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold">Iniciar sesion</h1>
        <p className="mt-1 text-sm text-ink/60">
          Acceso para el personal del restaurante que administra la carta.
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="flex flex-col gap-4 rounded-2xl border border-stone p-6 shadow-card">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink/70">
          Usuario
          <input
            type="text"
            required
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-stone px-3 py-2 text-sm outline-none focus:border-mustard-400"
          />
        </label>

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-mustard-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mustard-500 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="text-center text-xs text-ink/50">
          ¿Eres personal nuevo?{' '}
          <Link to="/registrar" className="font-medium text-mustard-600 hover:underline">
            Crea una cuenta
          </Link>
        </p>
      </form>
    </div>
  )
}
