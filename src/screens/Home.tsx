import { useGame } from '../context/GameContext'
import { UNITS } from '../data/lessons'
import { getDueCards } from '../srs'
import WordOfDay from './WordOfDay'

interface Props {
  onStartLesson: (lessonId: string) => void
  onPronunciation?: () => void
  onSpeedGame?: () => void
  onReading?: () => void
  onWritingTips?: () => void
  onIrregularVerbs?: () => void
  onDialogues?: () => void
  onCulturalTips?: () => void
}

export default function Home({ onStartLesson, onPronunciation, onSpeedGame, onReading, onWritingTips, onIrregularVerbs, onDialogues, onCulturalTips }: Props) {
  const { state } = useGame()
  const due = getDueCards(state.srs).length

  // Check if a unit is unlocked: first unit always unlocked,
  // others require completing at least one lesson from the previous unit
  function isUnitUnlocked(unitIndex: number): boolean {
    if (unitIndex === 0) return true
    const prevUnit = UNITS[unitIndex - 1]
    const prevLessons = prevUnit.lessons
    return prevLessons.some((l) => state.completedLessons.includes(l.id))
  }

  return (
    <div className="home">
      {due > 0 && (
        <div className="review-banner">
          <span>🔁 Tienes <strong>{due}</strong> palabras para repasar</span>
        </div>
      )}

      {onPronunciation && (
        <button className="pronunciation-banner" onClick={onPronunciation}>
          <span>🗣️ Guía de Pronunciación</span>
          <span className="muted" style={{ fontSize: '12px' }}>Aprende los sonidos del inglés</span>
        </button>
      )}

      {onSpeedGame && (
        <button className="speed-banner" onClick={onSpeedGame}>
          <span>⚡ Modo Velocidad</span>
          <span className="muted" style={{ fontSize: '12px' }}>¿Cuántas palabras en 30 seg?</span>
        </button>
      )}

      {/* Tools Section */}
      <div className="tools-section">
        <h3>🧰 Herramientas</h3>
        <div className="tools-grid">
          {onReading && (
            <button className="tool-card" onClick={onReading}>
              <span className="tool-icon">📖</span>
              <span>Lectura</span>
            </button>
          )}
          {onWritingTips && (
            <button className="tool-card" onClick={onWritingTips}>
              <span className="tool-icon">📝</span>
              <span>Escritura</span>
            </button>
          )}
          {onIrregularVerbs && (
            <button className="tool-card" onClick={onIrregularVerbs}>
              <span className="tool-icon">📚</span>
              <span>V. Irregulares</span>
            </button>
          )}
          {onDialogues && (
            <button className="tool-card" onClick={onDialogues}>
              <span className="tool-icon">🎭</span>
              <span>Diálogos</span>
            </button>
          )}
          {onCulturalTips && (
            <button className="tool-card" onClick={onCulturalTips}>
              <span className="tool-icon">🌍</span>
              <span>Cultura</span>
            </button>
          )}
          {onPronunciation && (
            <button className="tool-card" onClick={onPronunciation}>
              <span className="tool-icon">🗣️</span>
              <span>Pronunciación</span>
            </button>
          )}
        </div>
      </div>

      <WordOfDay />

      {UNITS.map((unit, unitIdx) => {
        const unitUnlocked = isUnitUnlocked(unitIdx)
        const completedInUnit = unit.lessons.filter((l) =>
          state.completedLessons.includes(l.id)
        ).length
        const totalInUnit = unit.lessons.length
        const unitProgress = Math.round((completedInUnit / totalInUnit) * 100)

        return (
          <section key={unit.id} className={`unit ${!unitUnlocked ? 'unit-locked' : ''}`}>
            <div className="unit-header" style={{ background: unitUnlocked ? unit.color : '#999' }}>
              <div>
                <span className="unit-level">
                  {unit.level} · UNIDAD {unitIdx + 1}
                </span>
                <h2>{unit.title} {!unitUnlocked && '🔒'}</h2>
                <p>{unit.description}</p>
                {unitUnlocked && completedInUnit > 0 && (
                  <div className="unit-progress">
                    <div className="unit-progress-bar">
                      <div
                        className="unit-progress-fill"
                        style={{ width: `${unitProgress}%` }}
                      />
                    </div>
                    <span className="unit-progress-text">
                      {completedInUnit}/{totalInUnit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {unitUnlocked && (
              <div className="lesson-path">
                {unit.lessons.map((lesson, i) => {
                  const done = state.completedLessons.includes(lesson.id)
                  const prev = unit.lessons[i - 1]
                  const unlocked = i === 0 || !prev || state.completedLessons.includes(prev.id)
                  return (
                    <button
                      key={lesson.id}
                      className={`lesson-node ${done ? 'done' : unlocked ? 'unlocked' : 'locked'}`}
                      style={done || unlocked ? { borderColor: unit.color } : undefined}
                      disabled={!unlocked}
                      onClick={() => onStartLesson(lesson.id)}
                    >
                      <span className="node-icon">{done ? '✓' : unlocked ? lesson.icon : '🔒'}</span>
                      <span className="node-title">{lesson.title}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}

      <div className="home-foot muted">
        🦊 ¡Completa lecciones para desbloquear más contenido!
      </div>
    </div>
  )
}
