import { useGame } from '../context/GameContext'

export default function Records() {
  const { state } = useGame()

  // Calculate personal records
  const bestStreak = state.streak // current streak is the live one
  const totalWords = Object.keys(state.srs).length
  const totalLessons = state.completedLessons.length
  const totalXp = state.xp
  const totalChallenges = state.challengesCompleted

  // Best day XP
  const bestDayXp = Math.max(0, ...Object.values(state.xpHistory))
  const bestDay = Object.entries(state.xpHistory).find(([, v]) => v === bestDayXp)?.[0] || '-'

  const records = [
    { icon: '🔥', label: 'Mejor racha', value: `${bestStreak} días` },
    { icon: '⭐', label: 'XP total acumulado', value: `${totalXp} XP` },
    { icon: '📚', label: 'Lecciones completadas', value: `${totalLessons}` },
    { icon: '🧠', label: 'Palabras aprendidas', value: `${totalWords}` },
    { icon: '🏅', label: 'Retos completados', value: `${totalChallenges}` },
    { icon: '💎', label: 'Gemas acumuladas', value: `${state.gems}` },
    { icon: '📅', label: 'Mejor día', value: `${bestDayXp} XP` },
    { icon: '🗓️', label: 'Fecha mejor día', value: formatDate(bestDay) },
  ]

  return (
    <div className="records fade-in">
      <h2 className="records-title">🏆 Tus Records</h2>
      <p className="muted records-subtitle">Tu historial personal de logros</p>

      <div className="records-grid">
        {records.map((r) => (
          <div key={r.label} className="record-card">
            <span className="record-icon">{r.icon}</span>
            <span className="record-value">{r.value}</span>
            <span className="record-label">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === '-') return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}
