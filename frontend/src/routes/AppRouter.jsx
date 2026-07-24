import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Menu from '../pages/Menu.jsx'
import Mesa from '../pages/Mesa.jsx'
import Admin from '../pages/Admin.jsx'
import Login from '../pages/Login.jsx'
import Registrar from '../pages/Registrar.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Menu />} />
        <Route path="/mesa/:idMesa" element={<Mesa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute soloAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <p className="py-16 text-center text-ink/50">
              Pagina no encontrada.
            </p>
          }
        />
      </Route>
    </Routes>
  )
}
