import { useGame } from '../context/GameContext'
import { masteryLevel } from '../srs'

export default function Profile() {
  const { state, dispatch } = useGame()
  const cards = Object.values(state.srs)
  const mastered = cards.filter((c) => masteryLevel(c) === 'mastered').length
  const learning = cards.filter((c) => ['learning', 'review'].includes(masteryLevel(c))).length

  const goalPct = Math.min(100, Math.round((state.xpToday / state.dailyGoal) * 100))

  return (
    <div className="profile fade-in">
      <div className="profile-head">
        <div className="avatar">🦊</div>
        <h2>{state.name || 'Estudiante'}</h2>
        <span className="level-pill">Nivel {state.level}</span>
      </div>

      <div className="daily-goal-card">
        <div className="dg-top">
          <span>Meta diaria</span>
          <span>
            {state.xpToday} / {state.dailyGoal} XP
          </span>
        </div>
        <div className="dg-bar">
          <div className="dg-fill" style={{ width: `${goalPct}%` }} />
        </div>
        {goalPct >= 100 && <span className="dg-done">¡Meta cumplida hoy! 🎉</span>}
      </div>

      <div className="stat-grid">
        <Stat icon="🔥" value={state.streak} label="Días de racha" />
        <Stat icon="⭐" value={state.xp} label="XP total" />
        <Stat icon="💎" value={state.gems} label="Gemas" />
        <Stat icon="📚" value={state.completedLessons.length} label="Lecciones" />
        <Stat icon="🧠" value={mastered} label="Palabras dominadas" />
        <Stat icon="📖" value={learning} label="Aprendiendo" />
      </div>

      <div className="settings">
        <button className="setting-row" onClick={() => dispatch({ type: 'TOGGLE_DARK' })}>
          <span>{state.darkMode ? '🌙' : '☀️'} Modo oscuro</span>
          <span className={`toggle ${state.darkMode ? 'on' : ''}`}>
            <span className="knob" />
          </span>
        </button>
        <button
          className="setting-row danger"
          onClick={() => {
            if (confirm('¿Borrar todo el progreso? Esta acción no se puede deshacer.')) {
              dispatch({ type: 'RESET' })
            }
          }}
        >
          🗑️ Reiniciar progreso
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="stat-box">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
