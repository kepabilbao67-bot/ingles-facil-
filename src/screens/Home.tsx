import { useGame } from '../context/GameContext'
import { UNITS } from '../data/lessons'
import { getDueCards } from '../srs'

interface Props {
  onStartLesson: (lessonId: string) => void
}

export default function Home({ onStartLesson }: Props) {
  const { state } = useGame()
  const due = getDueCards(state.srs).length

  return (
    <div className="home">
      {due > 0 && (
        <div className="review-banner">
          <span>🔁 Tienes <strong>{due}</strong> palabras para repasar</span>
        </div>
      )}

      {UNITS.map((unit) => (
        <section key={unit.id} className="unit">
          <div className="unit-header" style={{ background: unit.color }}>
            <div>
              <span className="unit-level">{unit.level} · UNIDAD</span>
              <h2>{unit.title}</h2>
              <p>{unit.description}</p>
            </div>
          </div>

          <div className="lesson-path">
            {unit.lessons.map((lesson, i) => {
              const done = state.completedLessons.includes(lesson.id)
              // desbloqueada si es la primera de la unidad o la anterior esta hecha
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
        </section>
      ))}

      <div className="home-foot muted">¡Más unidades muy pronto! 🦊</div>
    </div>
  )
}
