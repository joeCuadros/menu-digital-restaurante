import { AuthProvider } from './hooks/useAuth.jsx'
import AppRouter from './routes/AppRouter.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
