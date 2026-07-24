import { AuthProvider } from './hooks/useAuth.jsx'
import { MesaActivaProvider } from './hooks/useMesaActiva.jsx'
import AppRouter from './routes/AppRouter.jsx'

export default function App() {
  return (
    <AuthProvider>
      <MesaActivaProvider>
        <AppRouter />
      </MesaActivaProvider>
    </AuthProvider>
  )
}
