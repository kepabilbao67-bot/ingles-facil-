// Recordatorios diarios mediante la API de Notificaciones del navegador.
// Nota: para notificaciones PUSH reales en segundo plano (con la app cerrada)
// hace falta un servidor con Web Push + service worker. Aquí mostramos un
// recordatorio local cuando el usuario abre/usa la app pasada la hora elegida.

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function showReminder(streak: number) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  const body =
    streak > 0
      ? `¡No pierdas tu racha de ${streak} días! 🔥 Practica tu inglés ahora.`
      : '¡Hora de aprender inglés! 🦊 Solo unos minutos hoy.'
  try {
    new Notification('LinguaFox 🦊', {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'daily-reminder',
    })
  } catch {
    // algunos navegadores requieren mostrarlo desde el service worker
  }
}

// Comprueba si toca recordar (hora alcanzada y no recordado hoy)
export function shouldRemindNow(reminderTime: string, lastReminderDate: string | null): boolean {
  const today = new Date().toISOString().slice(0, 10)
  if (lastReminderDate === today) return false
  const [h, m] = reminderTime.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h || 0, m || 0, 0, 0)
  return now >= target
}
