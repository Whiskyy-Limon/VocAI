const SESSION_KEY = 'vocai_session_id'

/**
 * Devuelve un identificador de sesión persistente en localStorage,
 * usado para agrupar el historial de conversación en MongoDB.
 */
export function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch (e) {
    return null
  }
}
