import { useState } from 'react'
import { useGame, getPlayerLevelInfo } from '../context/GameContext'
import { masteryLevel } from '../srs'
import { UNITS } from '../data/lessons'
import { THEMES } from '../data/themes'

const AVATARS = ['🦊', '🐱', '🐶', '🦁', '🐼', '🐨', '🦄', '🐸', '🦉', '🐙', '🦋', '🐺', '🦈', '🐯', '🐻', '🦜']

export default function Profile() {
  const { state, dispatch } = useGame()
  const cards = Object.values(state.srs)
  const mastered = cards.filter((c) => masteryLevel(c) === 'mastered').length
  const learning = cards.filter((c) => ['learning', 'review'].includes(masteryLevel(c))).length
  const totalLessons = UNITS.flatMap((u) => u.lessons).length

  const goalPct = Math.min(100, Math.round((state.xpToday / state.dailyGoal) * 100))
  const levelInfo = getPlayerLevelInfo(state.xp)

  const [showAvatars, setShowAvatars] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showThemes, setShowThemes] = useState(false)

  // Level path
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1']
  const currentLevelIdx = levelOrder.indexOf(state.level)

  function exportProgress() {
    const data = JSON.stringify(state, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linguafox_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importProgress(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        localStorage.setItem('linguafox_state_v2', JSON.stringify(data))
        window.location.reload()
      } catch {
        alert('Archivo no válido')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="profile fade-in">
      <div className="profile-head">
        <button className="avatar" onClick={() => setShowAvatars(!showAvatars)}>
          {state.avatar}
        </button>
        <h2>{state.name || 'Estudiante'}</h2>
        <span className="level-pill">
          Lv.{levelInfo.level} — {levelInfo.title}
        </span>
        <div className="level-path">
          {levelOrder.map((lvl, i) => (
            <span
              key={lvl}
              className={`level-dot ${i <= currentLevelIdx ? 'active' : ''}`}
            >
              {lvl}
            </span>
          ))}
        </div>
      </div>

      {showAvatars && (
        <div className="avatar-picker fade-in">
          <p className="muted">Elige tu avatar:</p>
          <div className="avatar-grid">
            {AVATARS.map((av) => (
              <button
                key={av}
                className={`avatar-option ${state.avatar === av ? 'selected' : ''}`}
                onClick={() => {
                  dispatch({ type: 'SET_AVATAR', avatar: av })
                  setShowAvatars(false)
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player Level Progress */}
      <div className="daily-goal-card">
        <div className="dg-top">
          <span>Nivel de jugador</span>
          <span>Lv.{levelInfo.level} → Lv.{levelInfo.level + 1}</span>
        </div>
        <div className="dg-bar">
          <div className="dg-fill" style={{ width: `${levelInfo.progress}%`, background: 'var(--blue)' }} />
        </div>
        <span className="muted" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
          {levelInfo.xpInLevel} / {levelInfo.xpForNext} XP
        </span>
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
        <Stat icon="📚" value={state.completedLessons.length} label={`/${totalLessons} Lecciones`} />
        <Stat icon="🧠" value={mastered} label="Dominadas" />
        <Stat icon="📖" value={learning} label="Aprendiendo" />
      </div>

      <div className="settings">
        <button className="setting-row" onClick={() => dispatch({ type: 'TOGGLE_DARK' })}>
          <span>{state.darkMode ? '🌙' : '☀️'} Modo oscuro</span>
          <span className={`toggle ${state.darkMode ? 'on' : ''}`}>
            <span className="knob" />
          </span>
        </button>
        <button className="setting-row" onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}>
          <span>{state.soundEnabled ? '🔊' : '🔇'} Sonidos</span>
          <span className={`toggle ${state.soundEnabled ? 'on' : ''}`}>
            <span className="knob" />
          </span>
        </button>
        <button className="setting-row" onClick={() => setShowThemes(!showThemes)}>
          <span>🎨 Tema de colores</span>
          <span className="muted">{THEMES.find(t => t.id === state.theme)?.name || 'Clásico'}</span>
        </button>
        {showThemes && (
          <div className="theme-picker fade-in">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-option ${state.theme === t.id ? 'selected' : ''}`}
                onClick={() => dispatch({ type: 'SET_THEME', theme: t.id })}
              >
                <span className="theme-icon">{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        )}
        <button className="setting-row" onClick={() => setShowExport(!showExport)}>
          <span>💾 Exportar / Importar progreso</span>
        </button>
        {showExport && (
          <div className="export-panel fade-in">
            <button className="btn-primary" onClick={exportProgress}>
              📥 Descargar backup
            </button>
            <label className="btn-primary" style={{ background: 'var(--blue)', boxShadow: '0 4px 0 #0e8fd8', textAlign: 'center', cursor: 'pointer' }}>
              📤 Importar backup
              <input type="file" accept=".json" onChange={importProgress} style={{ display: 'none' }} />
            </label>
          </div>
        )}
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
