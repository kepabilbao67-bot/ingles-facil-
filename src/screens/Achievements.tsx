import { useGame } from '../context/GameContext'
import { ACHIEVEMENTS, isUnlocked, unlockedCount } from '../data/achievements'

export default function Achievements() {
  const { state } = useGame()
  const total = ACHIEVEMENTS.length
  const got = unlockedCount(state)

  return (
    <div className="achievements">
      <div className="ach-header">
        <h3>🏅 Logros</h3>
        <span className="ach-count">
          {got}/{total}
        </span>
      </div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = isUnlocked(a, state)
          const current = Math.min(a.progress(state), a.goal)
          const pct = Math.round((current / a.goal) * 100)
          return (
            <div key={a.id} className={`ach-badge ${unlocked ? 'unlocked' : 'locked'}`}>
              <span className="ach-icon">{unlocked ? a.icon : '🔒'}</span>
              <span className="ach-title">{a.title}</span>
              <span className="ach-desc">{a.desc}</span>
              {!unlocked && (
                <div className="ach-bar">
                  <div className="ach-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              )}
              {!unlocked && (
                <span className="ach-progress">
                  {current}/{a.goal}
                </span>
              )}
              {unlocked && <span className="ach-done">¡Conseguido!</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
