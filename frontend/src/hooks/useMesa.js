import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { obtenerEstadoMesa, actualizarItemMesa, reiniciarMesa } from '../services/api'

/**
 * Encapsula la carga y las mutaciones del estado de una mesa (RF03, RF04, RF07, RF09).
 * Cuando el backend devuelve notificaciones (p. ej. un plato seleccionado que
 * paso a "agotado"), se muestran como toast sin borrar la seleccion del cliente.
 */
export function useMesa(idMesa) {
  const [mesa, setMesa] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarMesa = useCallback(async () => {
    if (!idMesa) return
    try {
      const data = await obtenerEstadoMesa(idMesa)
      setMesa(data)
      data.notificaciones?.forEach((mensaje) => toast(mensaje, { icon: '⚠️' }))
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setCargando(false)
    }
  }, [idMesa])

  useEffect(() => {
    setCargando(true)
    cargarMesa()
  }, [cargarMesa])

  async function cambiarCantidad(idPlato, delta) {
    try {
      const data = await actualizarItemMesa(idMesa, idPlato, delta)
      setMesa(data)
      data.notificaciones?.forEach((mensaje) => toast(mensaje, { icon: '⚠️' }))
    } catch (err) {
      toast.error('No se pudo actualizar la cantidad.')
    }
  }

  async function limpiarMesa() {
    try {
      const data = await reiniciarMesa(idMesa)
      setMesa(data)
      toast.success('Cuenta de la mesa reiniciada.')
    } catch (err) {
      toast.error('No se pudo reiniciar la mesa.')
    }
  }

  return { mesa, cargando, error, cambiarCantidad, limpiarMesa, recargar: cargarMesa }
}
