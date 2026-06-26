import { useState, useMemo } from 'react'
import { useGame } from '../context/GameContext'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'

interface FalseFriend {
  word: string
  wrongMeaning: string
  correctMeaning: string
  spanishTrap: string
  example: string
}

const FALSE_FRIENDS: FalseFriend[] = [
  { word: 'actually', wrongMeaning: 'actualmente', correctMeaning: 'en realidad', spanishTrap: 'actualmente = currently', example: 'Actually, I disagree with you.' },
  { word: 'sensible', wrongMeaning: 'sensible', correctMeaning: 'sensato / prudente', spanishTrap: 'sensible = sensitive', example: "That's a sensible decision." },
  { word: 'embarrassed', wrongMeaning: 'embarazada', correctMeaning: 'avergonzado/a', spanishTrap: 'embarazada = pregnant', example: 'I was so embarrassed when I fell.' },
  { word: 'sympathetic', wrongMeaning: 'simpático', correctMeaning: 'comprensivo / compasivo', spanishTrap: 'simpático = nice/friendly', example: 'She was very sympathetic about my problem.' },
  { word: 'fabric', wrongMeaning: 'fábrica', correctMeaning: 'tela / tejido', spanishTrap: 'fábrica = factory', example: 'This fabric is very soft.' },
  { word: 'carpet', wrongMeaning: 'carpeta', correctMeaning: 'alfombra', spanishTrap: 'carpeta = folder', example: 'We bought a new carpet for the living room.' },
  { word: 'library', wrongMeaning: 'librería', correctMeaning: 'biblioteca', spanishTrap: 'librería = bookshop', example: 'I studied at the library all day.' },
  { word: 'contest', wrongMeaning: 'contestar', correctMeaning: 'concurso / competición', spanishTrap: 'contestar = to answer', example: 'She won the singing contest.' },
  { word: 'attend', wrongMeaning: 'atender', correctMeaning: 'asistir / acudir', spanishTrap: 'atender = to serve / help', example: 'I will attend the conference next week.' },
  { word: 'pretend', wrongMeaning: 'pretender', correctMeaning: 'fingir', spanishTrap: 'pretender = to intend/aim', example: "He's pretending to be sick." },
  { word: 'realize', wrongMeaning: 'realizar', correctMeaning: 'darse cuenta', spanishTrap: 'realizar = to carry out', example: "I didn't realize it was so late." },
  { word: 'success', wrongMeaning: 'suceso', correctMeaning: 'éxito', spanishTrap: 'suceso = event/incident', example: 'The project was a great success.' },
  { word: 'argument', wrongMeaning: 'argumento (de película)', correctMeaning: 'discusión / pelea verbal', spanishTrap: 'argumento = plot', example: 'They had a big argument about money.' },
  { word: 'resume', wrongMeaning: 'resumen', correctMeaning: 'reanudar / currículum (US)', spanishTrap: 'resumen = summary', example: "Let's resume the meeting after lunch." },
  { word: 'constipated', wrongMeaning: 'constipado', correctMeaning: 'estreñido', spanishTrap: 'constipado = have a cold', example: "I've been constipated for three days." },
  { word: 'eventually', wrongMeaning: 'eventualmente', correctMeaning: 'finalmente / al final', spanishTrap: 'eventualmente = possibly', example: 'He eventually passed the exam after three attempts.' },
  { word: 'introduce', wrongMeaning: 'introducir', correctMeaning: 'presentar (a una persona)', spanishTrap: 'introducir = to insert', example: 'Let me introduce you to my colleague.' },
  { word: 'diversion', wrongMeaning: 'diversión', correctMeaning: 'desvío (de tráfico)', spanishTrap: 'diversión = fun/entertainment', example: 'Follow the diversion signs.' },
  { word: 'exit', wrongMeaning: 'éxito', correctMeaning: 'salida', spanishTrap: 'éxito = success', example: 'The emergency exit is over there.' },
  { word: 'record', wrongMeaning: 'recordar', correctMeaning: 'grabar / registro', spanishTrap: 'recordar = to remember', example: 'I need to record this meeting.' },
]

export default function FalseFriendsGame() {
  const { state, dispatch } = useGame()
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro')
  const shuffled = useMemo(() => [...FALSE_FRIENDS].sort(() => Math.random() - 0.5).slice(0, 10), [phase])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  if (phase === 'intro') {
    return (
      <div className="ff-game fade-in">
        <div className="speed-ready">
          <span className="big-emoji">⚠️</span>
          <h2>Falsos Amigos</h2>
          <p className="muted">Palabras inglesas que PARECEN significar algo en español pero NO.</p>
          <div className="speed-rules">
            <p>🎯 Te mostraré una palabra inglesa</p>
            <p>✅ Elige su significado REAL en inglés</p>
            <p>❌ ¡Cuidado con la trampa del español!</p>
            <p>⭐ 3 XP por acierto</p>
          </div>
          <button className="btn-primary" onClick={() => { setPhase('playing'); setIndex(0); setScore(0) }}>
            ¡EMPEZAR!
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const xp = score * 3
    return (
      <div className="ff-game fade-in">
        <div className="speed-done">
          <span className="big-emoji">{score >= 8 ? '🏆' : score >= 5 ? '👍' : '📚'}</span>
          <h2>¡Resultado!</h2>
          <div className="speed-results">
            <div className="speed-result-item">
              <span className="speed-result-val">{score}/10</span>
              <span className="speed-result-label">Aciertos</span>
            </div>
            <div className="speed-result-item">
              <span className="speed-result-val">+{xp}</span>
              <span className="speed-result-label">XP</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => { setPhase('intro'); setAnswered(false); setSelected(null) }}>
            JUGAR DE NUEVO
          </button>
        </div>
      </div>
    )
  }

  const current = shuffled[index]
  const options = [current.correctMeaning, current.wrongMeaning].sort(() => Math.random() - 0.5)

  function handleAnswer(opt: string) {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    if (opt === current.correctMeaning) {
      setScore(s => s + 1)
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
  }

  function next() {
    if (index + 1 >= shuffled.length) {
      const xp = (score + (selected === current.correctMeaning ? 0 : 0)) * 3
      if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp })
      if (state.soundEnabled) playComplete()
      setPhase('done')
    } else {
      setIndex(i => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  return (
    <div className="ff-game fade-in">
      <div className="speed-top">
        <span className="muted">{index + 1}/10</span>
        <span className="speed-score">✅ {score}</span>
      </div>

      <div className="ff-card">
        <span className="ff-word">{current.word}</span>
        <p className="muted">¿Qué significa REALMENTE?</p>
      </div>

      <div className="ff-options">
        {options.map(opt => {
          const isCorrect = opt === current.correctMeaning
          const cls = answered
            ? (isCorrect ? 'ff-opt correct' : selected === opt ? 'ff-opt wrong' : 'ff-opt')
            : `ff-opt ${selected === opt ? 'selected' : ''}`
          return (
            <button key={opt} className={cls} disabled={answered} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="ff-explanation fade-in">
          <p><strong>"{current.word}"</strong> = {current.correctMeaning}</p>
          <p className="muted">🇪🇸 Trampa: {current.spanishTrap}</p>
          <p className="muted">📝 "{current.example}"</p>
          <button className={`btn-primary ${selected === current.correctMeaning ? '' : 'btn-danger'}`} onClick={next}>
            CONTINUAR
          </button>
        </div>
      )}
    </div>
  )
}
