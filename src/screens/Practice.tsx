import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { getDueCards } from '../srs'
import { speak } from '../hooks/useSpeech'
import { playCorrect, playClick } from '../hooks/useSounds'

// Example sentences for common words (enhances flashcard experience)
const EXAMPLE_SENTENCES: Record<string, string> = {
  'hello': 'Hello! How are you doing today?',
  'goodbye': 'Goodbye, see you tomorrow!',
  'good morning': 'Good morning! Did you sleep well?',
  'thank you': 'Thank you so much for your help.',
  'please': 'Could you please pass the salt?',
  'mother': 'My mother is a wonderful cook.',
  'father': 'His father works in a hospital.',
  'sister': 'My sister is older than me.',
  'brother': 'My brother plays guitar really well.',
  'water': 'Can I have a glass of water, please?',
  'menu': 'Could we see the menu, please?',
  'wake up': 'I usually wake up at 7 in the morning.',
  'breakfast': 'I have breakfast before going to work.',
  'sunny': 'It is sunny today, let us go to the beach.',
  'head': 'I have a terrible headache in my head.',
  'shirt': 'He is wearing a blue shirt today.',
  'salary': 'What is the expected salary for this role?',
  'boarding pass': 'Please show your boarding pass at the gate.',
  'turn left': 'Turn left at the traffic lights.',
  'give up': 'Never give up on your dreams.',
  'nevertheless': 'It was raining. Nevertheless, we went outside.',
  'furthermore': 'Furthermore, the results show significant improvement.',
  'break the ice': 'A joke is a good way to break the ice.',
  'ubiquitous': 'Smartphones are now ubiquitous in daily life.',
  'wreak havoc': 'The hurricane wreaked havoc on the coast.',
}

function getExample(word: string): string | null {
  const key = word.toLowerCase()
  return EXAMPLE_SENTENCES[key] || null
}

// Repaso con repeticion espaciada (SRS) - Enhanced flashcards
export default function Practice() {
  const { state, dispatch } = useGame()
  const initialDue = useMemo(() => getDueCards(state.srs), [state.srs])
  const [queue, setQueue] = useState(initialDue.map((c) => c.en))
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExample, setShowExample] = useState(false)
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
  const example = getExample(currentWord)

  function grade(quality: number) {
    dispatch({ type: 'REVIEW_CARD', word: currentWord, quality })
    if (quality >= 3) {
      dispatch({ type: 'ADD_XP', amount: 2 })
      if (state.soundEnabled) playCorrect()
    }
    setDone((d) => d + 1)
    setQueue((q) => q.slice(1))
    setShowAnswer(false)
    setShowExample(false)
  }

  return (
    <div className="practice fade-in">
      <div className="practice-progress">
        Repaso · {done + 1} / {initialDue.length}
      </div>

      <div className="flashcard" onClick={() => { speak(card.en); if (state.soundEnabled) playClick() }}>
        <span className="fc-en">{card.en}</span>
        {card.ipa && <span className="fc-ipa">{card.ipa}</span>}
        <span className="fc-hint">🔊 toca para oír</span>
        {showAnswer && (
          <>
            <span className="fc-es">{card.es}</span>
            {example && showExample && (
              <div className="fc-example">
                <span className="fc-example-label">Ejemplo:</span>
                <span className="fc-example-text">"{example}"</span>
              </div>
            )}
          </>
        )}
      </div>

      {!showAnswer ? (
        <button className="btn-primary" onClick={() => setShowAnswer(true)}>
          MOSTRAR RESPUESTA
        </button>
      ) : (
        <>
          {example && !showExample && (
            <button className="btn-ghost" onClick={() => setShowExample(true)}>
              📖 Ver ejemplo en contexto
            </button>
          )}
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
        </>
      )}
    </div>
  )
}
