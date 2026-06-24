import { useCallback, useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { speak } from '../hooks/useSpeech'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'

interface Verb {
  base: string
  past: string
  participle: string
  es: string
}

const VERBS: Verb[] = [
  { base: 'be', past: 'was/were', participle: 'been', es: 'ser/estar' },
  { base: 'become', past: 'became', participle: 'become', es: 'convertirse' },
  { base: 'begin', past: 'began', participle: 'begun', es: 'empezar' },
  { base: 'break', past: 'broke', participle: 'broken', es: 'romper' },
  { base: 'bring', past: 'brought', participle: 'brought', es: 'traer' },
  { base: 'build', past: 'built', participle: 'built', es: 'construir' },
  { base: 'buy', past: 'bought', participle: 'bought', es: 'comprar' },
  { base: 'catch', past: 'caught', participle: 'caught', es: 'atrapar' },
  { base: 'choose', past: 'chose', participle: 'chosen', es: 'elegir' },
  { base: 'come', past: 'came', participle: 'come', es: 'venir' },
  { base: 'cost', past: 'cost', participle: 'cost', es: 'costar' },
  { base: 'cut', past: 'cut', participle: 'cut', es: 'cortar' },
  { base: 'do', past: 'did', participle: 'done', es: 'hacer' },
  { base: 'draw', past: 'drew', participle: 'drawn', es: 'dibujar' },
  { base: 'drink', past: 'drank', participle: 'drunk', es: 'beber' },
  { base: 'drive', past: 'drove', participle: 'driven', es: 'conducir' },
  { base: 'eat', past: 'ate', participle: 'eaten', es: 'comer' },
  { base: 'fall', past: 'fell', participle: 'fallen', es: 'caer' },
  { base: 'feel', past: 'felt', participle: 'felt', es: 'sentir' },
  { base: 'find', past: 'found', participle: 'found', es: 'encontrar' },
  { base: 'fly', past: 'flew', participle: 'flown', es: 'volar' },
  { base: 'forget', past: 'forgot', participle: 'forgotten', es: 'olvidar' },
  { base: 'get', past: 'got', participle: 'got/gotten', es: 'obtener' },
  { base: 'give', past: 'gave', participle: 'given', es: 'dar' },
  { base: 'go', past: 'went', participle: 'gone', es: 'ir' },
  { base: 'grow', past: 'grew', participle: 'grown', es: 'crecer' },
  { base: 'have', past: 'had', participle: 'had', es: 'tener' },
  { base: 'hear', past: 'heard', participle: 'heard', es: 'oír' },
  { base: 'hide', past: 'hid', participle: 'hidden', es: 'esconder' },
  { base: 'hit', past: 'hit', participle: 'hit', es: 'golpear' },
  { base: 'hold', past: 'held', participle: 'held', es: 'sostener' },
  { base: 'keep', past: 'kept', participle: 'kept', es: 'mantener' },
  { base: 'know', past: 'knew', participle: 'known', es: 'saber' },
  { base: 'lead', past: 'led', participle: 'led', es: 'liderar' },
  { base: 'leave', past: 'left', participle: 'left', es: 'dejar/irse' },
  { base: 'lend', past: 'lent', participle: 'lent', es: 'prestar' },
  { base: 'let', past: 'let', participle: 'let', es: 'dejar/permitir' },
  { base: 'lose', past: 'lost', participle: 'lost', es: 'perder' },
  { base: 'make', past: 'made', participle: 'made', es: 'hacer/fabricar' },
  { base: 'mean', past: 'meant', participle: 'meant', es: 'significar' },
  { base: 'meet', past: 'met', participle: 'met', es: 'conocer' },
  { base: 'pay', past: 'paid', participle: 'paid', es: 'pagar' },
  { base: 'put', past: 'put', participle: 'put', es: 'poner' },
  { base: 'read', past: 'read', participle: 'read', es: 'leer' },
  { base: 'run', past: 'ran', participle: 'run', es: 'correr' },
  { base: 'say', past: 'said', participle: 'said', es: 'decir' },
  { base: 'see', past: 'saw', participle: 'seen', es: 'ver' },
  { base: 'sell', past: 'sold', participle: 'sold', es: 'vender' },
  { base: 'send', past: 'sent', participle: 'sent', es: 'enviar' },
  { base: 'set', past: 'set', participle: 'set', es: 'establecer' },
  { base: 'show', past: 'showed', participle: 'shown', es: 'mostrar' },
  { base: 'sing', past: 'sang', participle: 'sung', es: 'cantar' },
  { base: 'sit', past: 'sat', participle: 'sat', es: 'sentarse' },
  { base: 'sleep', past: 'slept', participle: 'slept', es: 'dormir' },
  { base: 'speak', past: 'spoke', participle: 'spoken', es: 'hablar' },
  { base: 'spend', past: 'spent', participle: 'spent', es: 'gastar/pasar' },
  { base: 'stand', past: 'stood', participle: 'stood', es: 'estar de pie' },
  { base: 'steal', past: 'stole', participle: 'stolen', es: 'robar' },
  { base: 'swim', past: 'swam', participle: 'swum', es: 'nadar' },
  { base: 'take', past: 'took', participle: 'taken', es: 'tomar' },
  { base: 'teach', past: 'taught', participle: 'taught', es: 'enseñar' },
  { base: 'tell', past: 'told', participle: 'told', es: 'decir/contar' },
  { base: 'think', past: 'thought', participle: 'thought', es: 'pensar' },
  { base: 'throw', past: 'threw', participle: 'thrown', es: 'lanzar' },
  { base: 'understand', past: 'understood', participle: 'understood', es: 'entender' },
  { base: 'wake', past: 'woke', participle: 'woken', es: 'despertar' },
  { base: 'wear', past: 'wore', participle: 'worn', es: 'llevar puesto' },
  { base: 'win', past: 'won', participle: 'won', es: 'ganar' },
  { base: 'write', past: 'wrote', participle: 'written', es: 'escribir' },
]

type Mode = 'study' | 'quiz'
type QuizType = 'past' | 'participle' | 'mixed'

export default function IrregularVerbs() {
  const { state, dispatch } = useGame()
  const [mode, setMode] = useState<Mode>('study')
  const [quizType, setQuizType] = useState<QuizType>('mixed')
  const [quizIndex, setQuizIndex] = useState(0)
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [studyPage, setStudyPage] = useState(0)

  const shuffled = useMemo(() => [...VERBS].sort(() => Math.random() - 0.5).slice(0, 15), [mode])
  const STUDY_PER_PAGE = 10

  const studyVerbs = VERBS.slice(studyPage * STUDY_PER_PAGE, (studyPage + 1) * STUDY_PER_PAGE)
  const totalPages = Math.ceil(VERBS.length / STUDY_PER_PAGE)

  function getExpected(): string {
    const verb = shuffled[quizIndex]
    if (quizType === 'past') return verb.past
    if (quizType === 'participle') return verb.participle
    return Math.random() > 0.5 ? verb.past : verb.participle
  }

  const [expected, setExpected] = useState(() => quizType === 'mixed' ? '' : '')

  function startQuiz(type: QuizType) {
    setQuizType(type)
    setMode('quiz')
    setQuizIndex(0)
    setScore(0)
    setTotal(0)
    setInput('')
    setAnswered(false)
  }

  function checkAnswer() {
    const verb = shuffled[quizIndex]
    const exp = quizType === 'past' ? verb.past : quizType === 'participle' ? verb.participle : (total % 2 === 0 ? verb.past : verb.participle)
    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ')
    const userAnswer = normalize(input)
    const correct = normalize(exp) === userAnswer || exp.split('/').some(e => normalize(e) === userAnswer)
    setAnswered(true)
    setWasCorrect(correct)
    setExpected(exp)
    if (correct) {
      setScore((s) => s + 1)
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
    setTotal((t) => t + 1)
  }

  function nextQuestion() {
    if (quizIndex + 1 >= shuffled.length) {
      if (state.soundEnabled) playComplete()
      const xp = score * 2
      if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp })
      setMode('study') // back to menu
      return
    }
    setQuizIndex((i) => i + 1)
    setInput('')
    setAnswered(false)
    setWasCorrect(false)
  }

  if (mode === 'study') {
    return (
      <div className="irreg fade-in">
        <h2>📖 Verbos Irregulares</h2>
        <p className="muted">Los 69 verbos irregulares más importantes</p>

        {total > 0 && (
          <div className="irreg-result">
            <p>Último quiz: <strong>{score}/{total}</strong> ({Math.round(score/total*100)}%)</p>
            {score > 0 && <p className="muted">+{score * 2} XP ganados</p>}
          </div>
        )}

        <div className="irreg-quiz-buttons">
          <button className="btn-primary" onClick={() => startQuiz('past')}>
            🎯 Quiz: Past Simple
          </button>
          <button className="btn-primary" style={{ background: 'var(--blue)', boxShadow: '0 4px 0 #0e8fd8' }} onClick={() => startQuiz('participle')}>
            🎯 Quiz: Past Participle
          </button>
          <button className="btn-primary" style={{ background: 'var(--orange)', boxShadow: '0 4px 0 #cc7a00' }} onClick={() => startQuiz('mixed')}>
            🎯 Quiz: Mixto
          </button>
        </div>

        <h3 style={{ marginTop: '20px' }}>Tabla de verbos ({studyPage + 1}/{totalPages})</h3>
        <div className="irreg-table">
          <div className="irreg-row irreg-header">
            <span>Base</span><span>Past</span><span>Participle</span><span>ES</span>
          </div>
          {studyVerbs.map((v) => (
            <button key={v.base} className="irreg-row" onClick={() => speak(`${v.base}, ${v.past}, ${v.participle}`)}>
              <span>{v.base}</span>
              <span>{v.past}</span>
              <span>{v.participle}</span>
              <span className="muted">{v.es}</span>
            </button>
          ))}
        </div>
        <div className="irreg-pagination">
          <button className="btn-ghost" disabled={studyPage === 0} onClick={() => setStudyPage((p) => p - 1)}>← Anterior</button>
          <button className="btn-ghost" disabled={studyPage >= totalPages - 1} onClick={() => setStudyPage((p) => p + 1)}>Siguiente →</button>
        </div>
      </div>
    )
  }

  // Quiz mode
  const verb = shuffled[quizIndex]
  const asking = quizType === 'past' ? 'Past Simple' : quizType === 'participle' ? 'Past Participle' : (total % 2 === 0 ? 'Past Simple' : 'Past Participle')

  return (
    <div className="irreg fade-in">
      <div className="irreg-quiz-top">
        <span className="muted">{quizIndex + 1} / {shuffled.length}</span>
        <span className="irreg-quiz-score">✅ {score}</span>
      </div>

      <div className="irreg-quiz-card">
        <p className="muted">{asking} de:</p>
        <h2 className="irreg-quiz-word">{verb.base}</h2>
        <p className="muted">({verb.es})</p>
        <button className="speaker-btn" onClick={() => speak(verb.base)} style={{ margin: '8px auto' }}>🔊</button>
      </div>

      <input
        className="text-input"
        placeholder={`Escribe el ${asking}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={answered}
        onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) checkAnswer() }}
        autoFocus
      />

      {answered && (
        <div className={`irreg-feedback ${wasCorrect ? 'correct' : 'wrong'}`}>
          <strong>{wasCorrect ? '¡Correcto! ✅' : '❌ Incorrecto'}</strong>
          {!wasCorrect && <p>Respuesta correcta: <strong>{expected}</strong></p>}
        </div>
      )}

      {!answered ? (
        <button className="btn-check" disabled={!input.trim()} onClick={checkAnswer}>COMPROBAR</button>
      ) : (
        <button className="btn-primary" onClick={nextQuestion}>CONTINUAR</button>
      )}
    </div>
  )
}
