import { useMemo, useState } from 'react'
import { speak } from '../hooks/useSpeech'
import { useGame } from '../context/GameContext'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'

interface Passage {
  id: string
  level: string
  title: string
  text: string
  questions: { question: string; options: string[]; answer: string }[]
}

const PASSAGES: Passage[] = [
  {
    id: 'r1',
    level: 'A2',
    title: 'A Day at the Park',
    text: "Last Saturday, Maria went to the park with her dog, Buddy. The weather was sunny and warm. She sat on a bench and read her book while Buddy played with other dogs. After two hours, they walked to a café nearby. Maria ordered a coffee and a sandwich. Buddy drank some water. It was a perfect day.",
    questions: [
      { question: 'Who did Maria go to the park with?', options: ['Her friend', 'Her dog', 'Her sister', 'Her mother'], answer: 'Her dog' },
      { question: 'What was the weather like?', options: ['Rainy and cold', 'Sunny and warm', 'Cloudy and windy', 'Snowy'], answer: 'Sunny and warm' },
      { question: 'What did Maria do at the park?', options: ['She played football', 'She read a book', 'She swam in the lake', 'She took photos'], answer: 'She read a book' },
      { question: 'Where did they go after the park?', options: ['Home', 'A café', 'A shop', 'The cinema'], answer: 'A café' },
    ],
  },
  {
    id: 'r2',
    level: 'B1',
    title: 'The Job Interview',
    text: "Tom had a job interview at a marketing company yesterday. He woke up early, put on his best suit, and took the train to the city centre. He arrived fifteen minutes before the scheduled time. The interviewer asked him about his experience and his strengths. Tom felt nervous at first, but he soon relaxed and answered confidently. At the end, the interviewer said they would contact him within a week. Tom left feeling optimistic.",
    questions: [
      { question: 'What type of company was the interview at?', options: ['A tech company', 'A marketing company', 'A hospital', 'A school'], answer: 'A marketing company' },
      { question: 'How did Tom get to the interview?', options: ['By car', 'By bus', 'By train', 'On foot'], answer: 'By train' },
      { question: 'How did Tom feel at first?', options: ['Confident', 'Angry', 'Nervous', 'Bored'], answer: 'Nervous' },
      { question: 'When would they contact Tom?', options: ['The same day', 'Within a week', 'In a month', 'Never'], answer: 'Within a week' },
    ],
  },
  {
    id: 'r3',
    level: 'B2',
    title: 'Remote Work Revolution',
    text: "The global shift towards remote work has fundamentally transformed how companies operate. While some employees appreciate the flexibility and lack of commute, others struggle with isolation and the blurring of boundaries between work and personal life. Studies suggest that a hybrid model—combining office days with remote days—may offer the best of both worlds. However, companies must invest in proper communication tools and establish clear expectations to make this model work effectively. The debate continues, but one thing is clear: the traditional nine-to-five office culture will never be quite the same again.",
    questions: [
      { question: 'What is the main topic of this passage?', options: ['A new office building', 'The shift to remote work', 'A company going bankrupt', 'New communication tools'], answer: 'The shift to remote work' },
      { question: 'What do some employees struggle with?', options: ['Too much money', 'Isolation and blurred boundaries', 'Too many holidays', 'Commuting'], answer: 'Isolation and blurred boundaries' },
      { question: 'What model is suggested as optimal?', options: ['Fully remote', 'Fully in-office', 'A hybrid model', 'Four-day week'], answer: 'A hybrid model' },
      { question: 'What must companies invest in?', options: ['New offices', 'Communication tools and clear expectations', 'More employees', 'Company cars'], answer: 'Communication tools and clear expectations' },
    ],
  },
  {
    id: 'r4',
    level: 'C1',
    title: 'The Paradox of Choice',
    text: "Psychologist Barry Schwartz argues that having too many options can paradoxically lead to less satisfaction rather than more. When faced with an overwhelming number of choices, people often experience decision paralysis, anxiety about making the wrong choice, and regret after making a decision. This phenomenon, known as the 'paradox of choice,' suggests that constraints and limitations can actually enhance our well-being. In an era of unlimited options—from streaming services with thousands of titles to dating apps with endless profiles—perhaps learning to embrace 'good enough' rather than endlessly pursuing 'the best' is the key to contentment.",
    questions: [
      { question: "What does Schwartz argue about too many options?", options: ['They always make us happier', 'They can lead to less satisfaction', 'They are always bad', 'They have no effect'], answer: 'They can lead to less satisfaction' },
      { question: "What is 'decision paralysis'?", options: ['Making fast decisions', 'Being unable to decide due to too many options', 'Always choosing the first option', 'Letting others decide'], answer: 'Being unable to decide due to too many options' },
      { question: 'What can enhance our well-being according to the text?', options: ['More options', 'Constraints and limitations', 'More money', 'Social media'], answer: 'Constraints and limitations' },
      { question: "What does the author suggest as a key to contentment?", options: ["Always pursuing 'the best'", "Embracing 'good enough'", 'Avoiding all choices', 'Following trends'], answer: "Embracing 'good enough'" },
    ],
  },
  {
    id: 'r5',
    level: 'C2',
    title: 'The Ethics of Artificial Intelligence',
    text: "As artificial intelligence systems become increasingly sophisticated, society faces profound ethical dilemmas that demand urgent attention. The question of algorithmic bias—where AI systems perpetuate or even amplify existing societal prejudices—has become particularly pressing. Furthermore, the opacity of many machine learning models, often referred to as the 'black box' problem, raises fundamental questions about accountability. If an autonomous vehicle makes a decision that results in harm, who bears responsibility: the programmer, the manufacturer, or the algorithm itself? These are not merely hypothetical scenarios; they are challenges we must grapple with today, lest we find ourselves governed by systems whose decision-making processes we neither understand nor can meaningfully contest.",
    questions: [
      { question: 'What is algorithmic bias?', options: ['AI systems that work perfectly', 'AI systems that perpetuate societal prejudices', 'A programming language', 'A type of computer virus'], answer: 'AI systems that perpetuate societal prejudices' },
      { question: "What is the 'black box' problem?", options: ['A broken computer', 'The opacity of machine learning models', 'A storage device', 'A type of AI'], answer: 'The opacity of machine learning models' },
      { question: 'What example is given about accountability?', options: ['A chatbot giving wrong answers', 'An autonomous vehicle causing harm', 'A website crashing', 'A robot cooking badly'], answer: 'An autonomous vehicle causing harm' },
      { question: "What does 'lest' mean in this context?", options: ['Because', 'For fear that / in order to prevent', 'Although', 'Since'], answer: 'For fear that / in order to prevent' },
    ],
  },
]

function getTodayPassageIdx(): number {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return dayOfYear % PASSAGES.length
}

export default function ReadingComprehension() {
  const { state, dispatch } = useGame()
  const [passageIdx, setPassageIdx] = useState(getTodayPassageIdx())
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showText, setShowText] = useState(true)

  const passage = PASSAGES[passageIdx]
  const question = passage.questions[questionIdx]

  function handleAnswer(opt: string) {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    if (opt === question.answer) {
      setScore((s) => s + 1)
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
  }

  function next() {
    if (questionIdx + 1 >= passage.questions.length) {
      setFinished(true)
      const xp = score * 3
      if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp })
      if (state.soundEnabled) playComplete()
    } else {
      setQuestionIdx((i) => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  function nextPassage() {
    setPassageIdx((i) => (i + 1) % PASSAGES.length)
    setQuestionIdx(0)
    setScore(0)
    setFinished(false)
    setAnswered(false)
    setSelected(null)
    setShowText(true)
  }

  if (finished) {
    const total = passage.questions.length
    const pct = Math.round((score / total) * 100)
    return (
      <div className="reading fade-in">
        <div className="reading-done">
          <span className="big-emoji">{pct >= 75 ? '🌟' : pct >= 50 ? '👍' : '📖'}</span>
          <h2>Lectura completada</h2>
          <p>{score}/{total} respuestas correctas ({pct}%)</p>
          <p className="muted">+{score * 3} XP ganados</p>
          <button className="btn-primary" onClick={nextPassage}>
            SIGUIENTE LECTURA
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="reading fade-in">
      <div className="reading-header">
        <span className="reading-level">{passage.level}</span>
        <h3>{passage.title}</h3>
      </div>

      {showText ? (
        <div className="reading-text-container">
          <div className="reading-text">
            <p>{passage.text}</p>
          </div>
          <button className="reading-listen" onClick={() => speak(passage.text, 'en-US', 0.85)}>
            🔊 Escuchar texto
          </button>
          <button className="btn-primary" onClick={() => setShowText(false)}>
            RESPONDER PREGUNTAS
          </button>
        </div>
      ) : (
        <div className="reading-questions">
          <div className="reading-progress muted">
            Pregunta {questionIdx + 1} / {passage.questions.length}
          </div>
          <h3 className="reading-q">{question.question}</h3>
          <div className="choice-grid">
            {question.options.map((opt) => {
              const isCorrect = opt === question.answer
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
          {answered && (
            <button className={`btn-primary ${selected === question.answer ? '' : 'btn-danger'}`} onClick={next}>
              CONTINUAR
            </button>
          )}
          <button className="btn-ghost" onClick={() => setShowText(true)}>
            📖 Releer el texto
          </button>
        </div>
      )}
    </div>
  )
}
