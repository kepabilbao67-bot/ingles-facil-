import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { getLessonById } from '../data/lessons'
import { speak, useSpeechRecognition } from '../hooks/useSpeech'
import type { Exercise } from '../types'

interface Props {
  lessonId: string
  onExit: () => void
  onFinish: () => void
}

export default function Lesson({ lessonId, onExit, onFinish }: Props) {
  const { state, dispatch } = useGame()
  const data = useMemo(() => getLessonById(lessonId), [lessonId])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showGrammar, setShowGrammar] = useState(true)

  if (!data) return <div className="screen-pad">Lección no encontrada</div>
  const { lesson } = data
  const exercises = lesson.exercises
  const total = exercises.length
  const current = exercises[index]
  const progress = (index / total) * 100

  // Pantalla de gramatica al inicio (si la leccion tiene una nota)
  if (showGrammar && lesson.grammarTip) {
    const tip = lesson.grammarTip
    return (
      <div className="grammar-intro fade-in">
        <div className="lesson-top">
          <button className="close-btn" onClick={onExit} aria-label="Salir">
            ✕
          </button>
          <span className="grammar-tag">📘 Gramática</span>
        </div>
        <div className="grammar-body">
          <h1>{tip.title}</h1>
          <p className="grammar-exp">{tip.explanation}</p>
          <div className="grammar-examples">
            {tip.examples.map((ex, i) => (
              <button key={i} className="grammar-example" onClick={() => speak(ex.en)}>
                <span className="ge-en">
                  {ex.en} <span className="ge-spk">🔊</span>
                </span>
                <span className="ge-es">{ex.es}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="lesson-footer">
          <button className="btn-primary" onClick={() => setShowGrammar(false)}>
            ¡ENTENDIDO, A PRACTICAR!
          </button>
        </div>
      </div>
    )
  }

  function handleResult(correct: boolean) {
    setAnswered(true)
    setWasCorrect(correct)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      dispatch({ type: 'LOSE_HEART' })
    }
  }

  function next() {
    if (index + 1 >= total) {
      const earnedXp = 10 + correctCount * 2
      dispatch({ type: 'COMPLETE_LESSON', lessonId, vocab: lesson.vocab, xp: earnedXp })
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
      setWasCorrect(false)
    }
  }

  if (finished) {
    const earnedXp = 10 + correctCount * 2
    const accuracy = Math.round((correctCount / total) * 100)
    return (
      <div className="lesson-complete fade-in">
        <div className="lc-mascot">🦊🎉</div>
        <h1>¡Lección completada!</h1>
        <div className="lc-stats">
          <div className="lc-stat xp">
            <span className="lc-stat-val">+{earnedXp}</span>
            <span className="lc-stat-label">XP TOTAL</span>
          </div>
          <div className="lc-stat acc">
            <span className="lc-stat-val">{accuracy}%</span>
            <span className="lc-stat-label">PRECISIÓN</span>
          </div>
          <div className="lc-stat gem">
            <span className="lc-stat-val">+5 💎</span>
            <span className="lc-stat-label">GEMAS</span>
          </div>
        </div>
        <button className="btn-primary" onClick={onFinish}>
          CONTINUAR
        </button>
      </div>
    )
  }

  const noHearts = state.hearts <= 0
  if (noHearts && !answered) {
    return (
      <div className="lesson-complete fade-in">
        <div className="lc-mascot">💔</div>
        <h1>¡Te quedaste sin vidas!</h1>
        <p className="muted">Espera a que se recarguen o cómpralas con gemas.</p>
        <button
          className="btn-primary"
          disabled={state.gems < 50}
          onClick={() => dispatch({ type: 'BUY_HEARTS' })}
        >
          Recargar por 50 💎
        </button>
        <button className="btn-ghost" onClick={onExit}>
          Salir
        </button>
      </div>
    )
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="close-btn" onClick={onExit} aria-label="Salir">
          ✕
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="hearts-count">❤️ {state.hearts}</span>
      </div>

      <div className="lesson-body">
        <ExerciseView key={current.id} exercise={current} onResult={handleResult} answered={answered} />
      </div>

      <div className={`lesson-footer ${answered ? (wasCorrect ? 'correct' : 'wrong') : ''}`}>
        {answered && (
          <div className="feedback">
            <strong>{wasCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😕'}</strong>
          </div>
        )}
        {answered ? (
          <button className={`btn-primary ${wasCorrect ? '' : 'btn-danger'}`} onClick={next}>
            CONTINUAR
          </button>
        ) : (
          <div className="footer-hint muted">Responde para continuar</div>
        )}
      </div>
    </div>
  )
}

// ---------- Vista de ejercicio (dispatch por tipo) ----------
function ExerciseView({
  exercise,
  onResult,
  answered,
}: {
  exercise: Exercise
  onResult: (c: boolean) => void
  answered: boolean
}) {
  switch (exercise.type) {
    case 'multipleChoice':
    case 'listen':
      return <ChoiceExercise exercise={exercise} onResult={onResult} answered={answered} />
    case 'translate':
      return <TranslateExercise exercise={exercise} onResult={onResult} answered={answered} />
    case 'match':
      return <MatchExercise exercise={exercise} onResult={onResult} answered={answered} />
    case 'speak':
      return <SpeakExercise exercise={exercise} onResult={onResult} answered={answered} />
    case 'fillBlank':
      return <FillBlankExercise exercise={exercise} onResult={onResult} answered={answered} />
  }
}

function SpeakerBtn({ text, big }: { text: string; big?: boolean }) {
  return (
    <button className={`speaker-btn ${big ? 'big' : ''}`} onClick={() => speak(text)} aria-label="Escuchar">
      🔊
    </button>
  )
}

// ---------- Opcion multiple / Listening ----------
function ChoiceExercise({ exercise, onResult, answered }: any) {
  const [selected, setSelected] = useState<string | null>(null)
  const isListen = exercise.type === 'listen'
  return (
    <div className="exercise fade-in">
      <h2 className="ex-prompt">{exercise.prompt}</h2>
      {isListen ? (
        <div className="listen-zone">
          <SpeakerBtn text={exercise.audioText} big />
          <p className="muted">Toca para escuchar de nuevo</p>
        </div>
      ) : (
        <div className="word-card">
          <span className="word-en">{exercise.question}</span>
          {exercise.audioText && <SpeakerBtn text={exercise.audioText} />}
        </div>
      )}
      <div className="choice-grid">
        {exercise.options.map((opt: string) => {
          const correct = opt === exercise.answer
          const cls = answered
            ? correct
              ? 'choice correct'
              : selected === opt
                ? 'choice wrong'
                : 'choice'
            : `choice ${selected === opt ? 'selected' : ''}`
          return (
            <button
              key={opt}
              className={cls}
              disabled={answered}
              onClick={() => {
                setSelected(opt)
                onResult(opt === exercise.answer)
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Construir traduccion ----------
function TranslateExercise({ exercise, onResult, answered }: any) {
  const [chosen, setChosen] = useState<string[]>([])
  const bank: string[] = exercise.wordBank

  function pick(word: string, i: number) {
    if (answered) return
    setChosen((c) => [...c, `${word}#${i}`])
  }
  function unpick(token: string) {
    if (answered) return
    setChosen((c) => c.filter((t) => t !== token))
  }
  function check() {
    const result = chosen.map((t) => t.split('#')[0])
    onResult(JSON.stringify(result) === JSON.stringify(exercise.answerWords))
  }

  const usedTokens = new Set(chosen)
  return (
    <div className="exercise fade-in">
      <h2 className="ex-prompt">{exercise.prompt}</h2>
      <div className="word-card">
        <span className="word-en">{exercise.sourceText}</span>
        <SpeakerBtn text={exercise.audioText} />
      </div>

      <div className="answer-line">
        {chosen.map((token) => (
          <button key={token} className="chip chosen" onClick={() => unpick(token)}>
            {token.split('#')[0]}
          </button>
        ))}
      </div>

      <div className="bank-line">
        {bank.map((word, i) => {
          const token = `${word}#${i}`
          const used = usedTokens.has(token)
          return (
            <button
              key={token}
              className={`chip ${used ? 'used' : ''}`}
              disabled={used || answered}
              onClick={() => pick(word, i)}
            >
              {word}
            </button>
          )
        })}
      </div>

      {!answered && (
        <button className="btn-check" disabled={chosen.length === 0} onClick={check}>
          COMPROBAR
        </button>
      )}
    </div>
  )
}

// ---------- Emparejar ----------
function MatchExercise({ exercise, onResult, answered }: any) {
  const pairs = exercise.pairs as { en: string; es: string }[]
  const [enSel, setEnSel] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [wrongFlash, setWrongFlash] = useState<string | null>(null)

  const esShuffled = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs])

  function selectEs(es: string) {
    if (!enSel || answered) return
    const pair = pairs.find((p) => p.en === enSel)
    if (pair && pair.es === es) {
      const nm = { ...matched, [enSel]: es }
      setMatched(nm)
      setEnSel(null)
      if (Object.keys(nm).length === pairs.length) onResult(true)
    } else {
      setWrongFlash(es)
      setTimeout(() => setWrongFlash(null), 400)
      setEnSel(null)
    }
  }

  return (
    <div className="exercise fade-in">
      <h2 className="ex-prompt">{exercise.prompt}</h2>
      <div className="match-grid">
        <div className="match-col">
          {pairs.map((p) => {
            const done = matched[p.en]
            return (
              <button
                key={p.en}
                className={`match-item ${done ? 'done' : enSel === p.en ? 'selected' : ''}`}
                disabled={!!done}
                onClick={() => setEnSel(p.en)}
              >
                {p.en} 🔊
              </button>
            )
          })}
        </div>
        <div className="match-col">
          {esShuffled.map((p) => {
            const done = Object.values(matched).includes(p.es)
            return (
              <button
                key={p.es}
                className={`match-item ${done ? 'done' : wrongFlash === p.es ? 'wrong' : ''}`}
                disabled={!!done}
                onClick={() => selectEs(p.es)}
              >
                {p.es}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------- Pronunciacion (speaking) ----------
function SpeakExercise({ exercise, onResult, answered }: any) {
  const { listen, listening, supported } = useSpeechRecognition()
  const [score, setScore] = useState<number | null>(null)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')

  async function tryListen() {
    setError('')
    try {
      const res = await listen(exercise.audioText)
      setScore(res.score)
      setTranscript(res.transcript)
      onResult(res.score >= 60)
    } catch (e: any) {
      setError('No se pudo acceder al micrófono')
    }
  }

  return (
    <div className="exercise fade-in">
      <h2 className="ex-prompt">{exercise.prompt}</h2>
      <div className="word-card">
        <span className="word-en">{exercise.audioText}</span>
        <SpeakerBtn text={exercise.audioText} />
      </div>
      <p className="muted">{exercise.translation}</p>

      {!supported ? (
        <div className="speak-fallback">
          <p className="muted">Tu navegador no soporta micrófono. Marca como practicado:</p>
          <button className="btn-check" onClick={() => onResult(true)}>
            LO PRACTIQUÉ ✓
          </button>
        </div>
      ) : (
        <>
          <button className={`mic-btn ${listening ? 'recording' : ''}`} disabled={answered} onClick={tryListen}>
            🎤
          </button>
          <p className="muted">{listening ? 'Escuchando...' : 'Toca y habla'}</p>
          {score !== null && (
            <div className="speak-result">
              <strong>Puntuación: {score}%</strong>
              <small>Dijiste: "{transcript}"</small>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </>
      )}
    </div>
  )
}

// ---------- Completar el hueco ----------
function FillBlankExercise({ exercise, onResult, answered }: any) {
  const [selected, setSelected] = useState<string | null>(null)
  const parts = exercise.sentence.split('___')
  return (
    <div className="exercise fade-in">
      <h2 className="ex-prompt">{exercise.prompt}</h2>
      <div className="word-card">
        <span className="word-en fill-sentence">
          {parts[0]}
          <span className="blank">{selected || '_____'}</span>
          {parts[1]}
        </span>
        <SpeakerBtn text={exercise.audioText} />
      </div>
      <p className="muted">{exercise.translation}</p>
      <div className="choice-grid">
        {exercise.options.map((opt: string) => {
          const correct = opt === exercise.answer
          const cls = answered
            ? correct
              ? 'choice correct'
              : selected === opt
                ? 'choice wrong'
                : 'choice'
            : `choice ${selected === opt ? 'selected' : ''}`
          return (
            <button
              key={opt}
              className={cls}
              disabled={answered}
              onClick={() => {
                setSelected(opt)
                onResult(opt === exercise.answer)
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
