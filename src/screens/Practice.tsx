import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { getDueCards } from '../srs'
import { speak } from '../hooks/useSpeech'

// Repaso con repeticion espaciada (SRS)
export default function Practice() {
  const { state, dispatch } = useGame()
  const initialDue = useMemo(() => getDueCards(state.srs), [state.srs])
  const [queue, setQueue] = useState(initialDue.map((c) => c.en))
  const [showAnswer, setShowAnswer] = useState(false)
  const [done, setDone] = useState(0)

  if (initialDue.length === 0) {
    return (
      <div className="practice empty fade-in">
        <div className="big-emoji">🎯</div>
        <h2>¡Todo repasado!</h2>
        <p className="muted">No tienes palabras pendientes. Completa lecciones para añadir vocabulario a tu repaso.</p>
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="practice empty fade-in">
        <div className="big-emoji">🌟</div>
        <h2>¡Repaso completado!</h2>
        <p className="muted">Repasaste {done} palabras. ¡Excelente memoria!</p>
      </div>
    )
  }

  const currentWord = queue[0]
  const card = state.srs[currentWord]

  function grade(quality: number) {
    dispatch({ type: 'REVIEW_CARD', word: currentWord, quality })
    if (quality >= 3) dispatch({ type: 'ADD_XP', amount: 2 })
    setDone((d) => d + 1)
    setQueue((q) => q.slice(1))
    setShowAnswer(false)
  }

  return (
    <div className="practice fade-in">
      <div className="practice-progress">
        Repaso · {done + 1} / {initialDue.length}
      </div>

      <div className="flashcard" onClick={() => speak(card.en)}>
        <span className="fc-en">{card.en}</span>
        {card.ipa && <span className="fc-ipa">{card.ipa}</span>}
        <span className="fc-hint">🔊 toca para oír</span>
        {showAnswer && <span className="fc-es">{card.es}</span>}
      </div>

      {!showAnswer ? (
        <button className="btn-primary" onClick={() => setShowAnswer(true)}>
          MOSTRAR RESPUESTA
        </button>
      ) : (
        <div className="grade-row">
          <button className="grade hard" onClick={() => grade(1)}>
            😕 Difícil
          </button>
          <button className="grade good" onClick={() => grade(3)}>
            🙂 Bien
          </button>
          <button className="grade easy" onClick={() => grade(5)}>
            😎 Fácil
          </button>
        </div>
      )}
    </div>
  )
}
