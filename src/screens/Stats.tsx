import { useGame } from '../context/GameContext'
import { getPlayerLevelInfo } from '../context/GameContext'

export default function Stats() {
  const { state } = useGame()
  const levelInfo = getPlayerLevelInfo(state.xp)

  // Get last 7 days of XP history
  const last7Days = getLast7Days(state.xpHistory)
  const maxXp = Math.max(...last7Days.map((d) => d.xp), 1)

  return (
    <div className="stats fade-in">
      {/* Player Level */}
      <div className="stats-level-card">
        <div className="stats-level-header">
          <span className="stats-avatar">{state.avatar}</span>
          <div className="stats-level-info">
            <strong>Nivel {levelInfo.level} — {levelInfo.title}</strong>
            <span className="muted">{state.xp} XP total</span>
          </div>
        </div>
        <div className="stats-level-bar">
          <div className="stats-level-fill" style={{ width: `${levelInfo.progress}%` }} />
        </div>
        <span className="muted stats-level-text">
          {levelInfo.xpInLevel} / {levelInfo.xpForNext} XP para nivel {levelInfo.level + 1}
        </span>
      </div>

      {/* Weekly Chart */}
      <div className="stats-chart-card">
        <h3>Últimos 7 días</h3>
        <div className="stats-chart">
          {last7Days.map((day) => (
            <div key={day.date} className="chart-col">
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{ height: `${(day.xp / maxXp) * 100}%` }}
                />
              </div>
              <span className="chart-label">{day.label}</span>
              <span className="chart-value">{day.xp}</span>
            </div>
          ))}
        </div>
        <div className="stats-summary">
          <div className="stats-summary-item">
            <strong>{last7Days.reduce((a, d) => a + d.xp, 0)}</strong>
            <span className="muted">XP esta semana</span>
          </div>
          <div className="stats-summary-item">
            <strong>{Math.round(last7Days.reduce((a, d) => a + d.xp, 0) / 7)}</strong>
            <span className="muted">Media diaria</span>
          </div>
          <div className="stats-summary-item">
            <strong>{last7Days.filter((d) => d.xp > 0).length}</strong>
            <span className="muted">Días activos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getLast7Days(xpHistory: Record<string, number>): { date: string; xp: number; label: string }[] {
  const days: { date: string; xp: number; label: string }[] = []
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      xp: xpHistory[key] || 0,
      label: dayNames[d.getDay()],
    })
  }
  return days
}
