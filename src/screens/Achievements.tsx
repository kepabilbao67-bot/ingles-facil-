import { useGame } from '../context/GameContext'
import { ACHIEVEMENTS, getUnlockedAchievements, getLockedAchievements } from '../data/achievements'
import { useEffect } from 'react'

export default function Achievements() {
  const { state, dispatch } = useGame()
  const unlocked = getUnlockedAchievements(state)
  const locked = getLockedAchievements(state)

  // Auto-unlock achievements
  useEffect(() => {
    ACHIEVEMENTS.forEach((a) => {
      if (a.check(state) && !state.unlockedAchievements.includes(a.id)) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: a.id })
      }
    })
  }, [state, dispatch])

  return (
    <div className="achievements fade-in">
      <h2 className="ach-title">🏆 Logros</h2>
      <p className="muted ach-subtitle">
        {unlocked.length} / {ACHIEVEMENTS.length} desbloqueados
      </p>

      {unlocked.length > 0 && (
        <div className="ach-section">
          <h3>Desbloqueados</h3>
          <div className="ach-grid">
            {unlocked.map((a) => (
              <div key={a.id} className="ach-card unlocked">
                <span className="ach-icon">{a.icon}</span>
                <strong>{a.title}</strong>
                <small>{a.description}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="ach-section">
          <h3>Por desbloquear</h3>
          <div className="ach-grid">
            {locked.map((a) => (
              <div key={a.id} className="ach-card locked">
                <span className="ach-icon">🔒</span>
                <strong>{a.title}</strong>
                <small>{a.description}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
