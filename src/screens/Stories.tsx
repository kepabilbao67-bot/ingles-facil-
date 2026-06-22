import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { STORIES } from '../data/stories'
import { speak } from '../hooks/useSpeech'
import type { Story } from '../types'

export default function Stories() {
  const { state } = useGame()
  const [active, setActive] = useState<Story | null>(null)

  if (active) {
    return <StoryReader story={active} onExit={() => setActive(null)} />
  }

  return (
    <div className="stories fade-in">
      <h2 className="section-title">📖 Historias</h2>
      <p className="muted section-sub">Lee, escucha y responde para ganar XP.</p>
      <div className="story-list">
        {STORIES.map((s) => {
          const read = state.readStories.includes(s.id)
          return (
            <button key={s.id} className="story-card" onClick={() => setActive(s)}>
              <span className="story-emoji">{s.emoji}</span>
              <span className="story-info">
                <span className="story-title">
                  {s.title} {read && <span className="story-read">✓</span>}
                </span>
                <span className="story-summary">{s.summary}</span>
              </span>
              <span className="story-level">{s.level}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StoryReader({ story, onExit }: { story: Story; onExit: () => void }) {
  const { dispatch } = useGame()
  const [phase, setPhase] = useState<'read' | 'quiz' | 'done'>('read')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)

  function readAll() {
    // Lee todas las lineas en secuencia
    story.lines.forEach((line, i) => {
      setTimeout(() => speak(line.en), i * 1800)
    })
  }

  if (phase === 'read') {
    return (
      <div className="story-reader fade-in">
        <div className="lesson-top">
          <button className="close-btn" onClick={onExit}>
            ✕
          </button>
          <h3 className="reader-title">
            {story.emoji} {story.title}
          </h3>
          <button className="play-all" onClick={readAll} title="Escuchar todo">
            ▶️
          </button>
        </div>
        <div className="dialogue">
          {story.lines.map((line, i) => (
            <div key={i} className="line">
              {line.speaker && <span className="speaker-name">{line.speaker}</span>}
              <button className="line-bubble" onClick={() => speak(line.en)}>
                <span className="line-en">
                  {line.en} <span className="ge-spk">🔊</span>
                </span>
                <span className="line-es">{line.es}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="lesson-footer">
          <button className="btn-primary" onClick={() => setPhase('quiz')}>
            RESPONDER PREGUNTAS
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const q = story.questions[qIndex]
    function choose(opt: string) {
      if (answered) return
      setSelected(opt)
      setAnswered(true)
      if (opt === q.answer) setCorrect((c) => c + 1)
    }
    function nextQ() {
      if (qIndex + 1 >= story.questions.length) {
        const xp = 8 + correct * 3
        dispatch({ type: 'COMPLETE_STORY', storyId: story.id, xp })
        setPhase('done')
      } else {
        setQIndex((i) => i + 1)
        setSelected(null)
        setAnswered(false)
      }
    }
    return (
      <div className="story-reader fade-in">
        <div className="lesson-top">
          <button className="close-btn" onClick={onExit}>
            ✕
          </button>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(qIndex / story.questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="lesson-body">
          <h2 className="ex-prompt">{q.question}</h2>
          <div className="choice-grid">
            {q.options.map((opt) => {
              const isCorrect = opt === q.answer
              const cls = answered
                ? isCorrect
                  ? 'choice correct'
                  : selected === opt
                    ? 'choice wrong'
                    : 'choice'
                : `choice ${selected === opt ? 'selected' : ''}`
              return (
                <button key={opt} className={cls} disabled={answered} onClick={() => choose(opt)}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
        <div className="lesson-footer">
          {answered && (
            <button className="btn-primary" onClick={nextQ}>
              CONTINUAR
            </button>
          )}
        </div>
      </div>
    )
  }

  // done
  const xp = 8 + correct * 3
  return (
    <div className="lesson-complete fade-in">
      <div className="lc-mascot">📚🎉</div>
      <h1>¡Historia completada!</h1>
      <div className="lc-stats">
        <div className="lc-stat xp">
          <span className="lc-stat-val">+{xp}</span>
          <span className="lc-stat-label">XP</span>
        </div>
        <div className="lc-stat acc">
          <span className="lc-stat-val">
            {correct}/{story.questions.length}
          </span>
          <span className="lc-stat-label">ACIERTOS</span>
        </div>
        <div className="lc-stat gem">
          <span className="lc-stat-val">+3 💎</span>
          <span className="lc-stat-label">GEMAS</span>
        </div>
      </div>
      <button className="btn-primary" onClick={onExit}>
        VOLVER
      </button>
    </div>
  )
}
