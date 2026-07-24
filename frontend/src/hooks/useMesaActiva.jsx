import { createContext, useContext, useState } from 'react'

const MESA_ACTIVA_KEY = 'menu_digital_mesa_activa'
const MesaActivaContext = createContext(null)

/**
 * Estado compartido de la mesa activa del comensal (Carta y Navbar deben ver
 * siempre el mismo numero de mesa, incluso si el cliente lo cambia sin navegar).
 */
export function MesaActivaProvider({ children }) {
  const [idMesa, setIdMesaState] = useState(
    () => localStorage.getItem(MESA_ACTIVA_KEY) || '1'
  )

  function setIdMesa(valor) {
    const normalizado = valor || '1'
    localStorage.setItem(MESA_ACTIVA_KEY, normalizado)
    setIdMesaState(normalizado)
  }

  const value = { idMesa, setIdMesa }

  return <MesaActivaContext.Provider value={value}>{children}</MesaActivaContext.Provider>
}

export function useMesaActiva() {
  const context = useContext(MesaActivaContext)
  if (!context) {
    throw new Error('useMesaActiva debe usarse dentro de un MesaActivaProvider')
  }
  return context
}
