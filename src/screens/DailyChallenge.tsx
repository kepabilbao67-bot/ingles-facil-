import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { UNITS } from '../data/lessons'
import { speak } from '../hooks/useSpeech'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'
import type { Exercise } from '../types'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// Generate a daily challenge based on the date (deterministic per day)
function getDailyExercises(): Exercise[] {
  const today = todayStr()
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0)
  const allExercises = UNITS.flatMap((u) => u.lessons.flatMap((l) => l.exercises))

  // Pick 5 exercises based on date seed
  const picked: Exercise[] = []
  for (let i = 0; i < 5; i++) {
    const idx = (seed * (i + 7) + i * 13) % allExercises.length
    picked.push(allExercises[idx])
  }
  return picked
}

export default function DailyChallenge() {
  const { state, dispatch } = useGame()
  const today = todayStr()
  const alreadyDone = state.lastChallengeDate === today

  const exercises = useMemo(() => getDailyExercises(), [])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  if (alreadyDone && !finished) {
    return (
      <div className="challenge fade-in">
        <div className="challenge-done">
          <span className="big-emoji">✅</span>
          <h2>¡Reto de hoy completado!</h2>
          <p className="muted">Vuelve mañana para un nuevo reto</p>
          <div className="challenge-reward">
            <span>🏅 +25 XP</span>
            <span>💎 +10 gemas</span>
          </div>
        </div>
      </div>
    )
  }

  if (finished) {
    const accuracy = Math.round((correctCount / exercises.length) * 100)
    return (
      <div className="challenge fade-in">
        <div className="challenge-done">
          <span className="big-emoji">🏅</span>
          <h2>¡Reto completado!</h2>
          <p>Precisión: {accuracy}%</p>
          <div className="challenge-reward">
            <span>⭐ +25 XP</span>
            <span>💎 +10 gemas</span>
          </div>
          <p className="muted">¡Vuelve mañana para un nuevo reto!</p>
        </div>
      </div>
    )
  }

  const current = exercises[index]
  const progress = ((index) / exercises.length) * 100

  function handleAnswer(answer: string) {
    if (answered) return
    setSelected(answer)
    setAnswered(true)
    const correct = answer === (current as any).answer
    setWasCorrect(correct)
    if (correct) {
      setCorrectCount((c) => c + 1)
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
  }

  function next() {
    if (index + 1 >= exercises.length) {
      dispatch({ type: 'COMPLETE_CHALLENGE' })
      if (state.soundEnabled) playComplete()
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
      setWasCorrect(false)
      setSelected(null)
    }
  }

  // Simplified rendering for the challenge — only show choice-based exercises
  const hasOptions = 'options' in current && (current as any).options
  const hasAudioText = 'audioText' in current && (current as any).audioText

  return (
    <div className="challenge fade-in">
      <div className="challenge-header">
        <h2>🏅 Reto Diario</h2>
        <span className="muted">{index + 1} / {exercises.length}</span>
      </div>

      <div className="progress-bar" style={{ margin: '12px 0' }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="challenge-body">
        <h3 className="ex-prompt">{current.prompt}</h3>

        {hasAudioText && (
          <button className="speaker-btn big" onClick={() => speak((current as any).audioText)} style={{ margin: '12px auto', display: 'block' }}>
            🔊
          </button>
        )}

        {'question' in current && (current as any).question && (
          <div className="word-card">
            <span className="word-en">{(current as any).question}</span>
          </div>
        )}

        {'sentence' in current && (current as any).sentence && (
          <div className="word-card">
            <span className="word-en fill-sentence">{(current as any).sentence}</span>
          </div>
        )}

        {hasOptions && (
          <div className="choice-grid">
            {(current as any).options.map((opt: string) => {
              const isCorrect = opt === (current as any).answer
              const cls = answered
                ? isCorrect ? 'choice correct' : selected === opt ? 'choice wrong' : 'choice'
                : `choice ${selected === opt ? 'selected' : ''}`
              return (
                <button key={opt} className={cls} disabled={answered} onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {!hasOptions && !answered && (
          <button className="btn-primary" onClick={() => handleAnswer((current as any).answer || '')}>
            COMPLETAR
          </button>
        )}
      </div>

      {answered && (
        <div className={`lesson-footer ${wasCorrect ? 'correct' : 'wrong'}`}>
          <div className="feedback">
            <strong>{wasCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😕'}</strong>
          </div>
          <button className={`btn-primary ${wasCorrect ? '' : 'btn-danger'}`} onClick={next}>
            CONTINUAR
          </button>
        </div>
      )}
    </div>
  )
}
