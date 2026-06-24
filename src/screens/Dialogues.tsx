import { useState } from 'react'
import { speak } from '../hooks/useSpeech'
import { useGame } from '../context/GameContext'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'

interface Line {
  speaker: string
  text: string
  translation: string
}

interface DialogueData {
  id: string
  level: string
  title: string
  situation: string
  lines: Line[]
  questions: { question: string; options: string[]; answer: string }[]
}

const DIALOGUES: DialogueData[] = [
  {
    id: 'd1', level: 'A2', title: 'At the Coffee Shop',
    situation: 'Un cliente pide en una cafetería',
    lines: [
      { speaker: '☕ Barista', text: "Hi there! What can I get you?", translation: '¡Hola! ¿Qué le pongo?' },
      { speaker: '🧑 Customer', text: "Can I have a large latte, please?", translation: '¿Me pone un latte grande, por favor?' },
      { speaker: '☕ Barista', text: "Sure! Would you like any syrup with that?", translation: '¡Claro! ¿Quiere algún sirope?' },
      { speaker: '🧑 Customer', text: "Yes, vanilla please. And a blueberry muffin.", translation: 'Sí, vainilla por favor. Y un muffin de arándanos.' },
      { speaker: '☕ Barista', text: "That'll be six pounds fifty. Card or cash?", translation: 'Son seis con cincuenta. ¿Tarjeta o efectivo?' },
      { speaker: '🧑 Customer', text: "Card, please. Here you go.", translation: 'Tarjeta, por favor. Aquí tiene.' },
      { speaker: '☕ Barista', text: "Great. Your order will be ready at the end of the counter.", translation: 'Perfecto. Su pedido estará al final del mostrador.' },
    ],
    questions: [
      { question: 'What size drink did the customer order?', options: ['Small', 'Medium', 'Large', 'Extra large'], answer: 'Large' },
      { question: 'What flavour syrup did they choose?', options: ['Caramel', 'Hazelnut', 'Vanilla', 'Chocolate'], answer: 'Vanilla' },
      { question: 'How much did it cost?', options: ['£5.50', '£6.50', '£7.50', '£4.50'], answer: '£6.50' },
      { question: 'How did the customer pay?', options: ['Cash', 'Card', 'Phone', 'Voucher'], answer: 'Card' },
    ],
  },
  {
    id: 'd2', level: 'B1', title: 'Booking a Hotel',
    situation: 'Reservar una habitación de hotel por teléfono',
    lines: [
      { speaker: '🏨 Receptionist', text: "Good morning, Grand Hotel. How can I help you?", translation: 'Buenos días, Gran Hotel. ¿En qué puedo ayudarle?' },
      { speaker: '📞 Guest', text: "Hi, I'd like to book a double room for next weekend.", translation: 'Hola, me gustaría reservar una habitación doble para el próximo fin de semana.' },
      { speaker: '🏨 Receptionist', text: "Certainly. That would be Friday and Saturday night?", translation: '¿Sería viernes y sábado noche?' },
      { speaker: '📞 Guest', text: "Yes, two nights. Does the room include breakfast?", translation: 'Sí, dos noches. ¿La habitación incluye desayuno?' },
      { speaker: '🏨 Receptionist', text: "Breakfast is included. The rate is ninety-five pounds per night.", translation: 'El desayuno está incluido. El precio es 95 libras por noche.' },
      { speaker: '📞 Guest', text: "That sounds fine. Is there free Wi-Fi?", translation: 'Suena bien. ¿Hay Wi-Fi gratis?' },
      { speaker: '🏨 Receptionist', text: "Yes, complimentary Wi-Fi throughout the hotel. Can I take your name?", translation: 'Sí, Wi-Fi gratuito en todo el hotel. ¿Me dice su nombre?' },
    ],
    questions: [
      { question: 'What type of room does the guest want?', options: ['Single', 'Double', 'Twin', 'Suite'], answer: 'Double' },
      { question: 'How many nights?', options: ['One', 'Two', 'Three', 'Four'], answer: 'Two' },
      { question: 'Is breakfast included?', options: ['Yes', 'No', 'Only on weekdays', 'For extra cost'], answer: 'Yes' },
      { question: 'How much per night?', options: ['£75', '£85', '£95', '£105'], answer: '£95' },
    ],
  },
  {
    id: 'd3', level: 'B2', title: 'At the Doctor',
    situation: 'Visita al médico de cabecera',
    lines: [
      { speaker: '👨‍⚕️ Doctor', text: "Good morning. What seems to be the problem?", translation: 'Buenos días. ¿Qué le ocurre?' },
      { speaker: '🤒 Patient', text: "I've been feeling really tired lately and I have a persistent cough.", translation: 'Últimamente me siento muy cansado y tengo una tos persistente.' },
      { speaker: '👨‍⚕️ Doctor', text: "How long have you had these symptoms?", translation: '¿Cuánto tiempo lleva con estos síntomas?' },
      { speaker: '🤒 Patient', text: "About two weeks now. It started with a sore throat.", translation: 'Unas dos semanas. Empezó con dolor de garganta.' },
      { speaker: '👨‍⚕️ Doctor', text: "Have you been taking any medication?", translation: '¿Ha estado tomando algún medicamento?' },
      { speaker: '🤒 Patient', text: "Just some over-the-counter cough syrup, but it hasn't helped much.", translation: 'Solo un jarabe para la tos sin receta, pero no ha ayudado mucho.' },
      { speaker: '👨‍⚕️ Doctor', text: "I'll prescribe some antibiotics. Take one tablet twice a day for seven days.", translation: 'Le voy a recetar antibióticos. Tome una pastilla dos veces al día durante siete días.' },
      { speaker: '🤒 Patient', text: "Should I come back if it doesn't improve?", translation: '¿Debería volver si no mejora?' },
      { speaker: '👨‍⚕️ Doctor', text: "Yes, if you're not better within a week, make another appointment.", translation: 'Sí, si no mejora en una semana, pida otra cita.' },
    ],
    questions: [
      { question: 'How long has the patient had symptoms?', options: ['A few days', 'About two weeks', 'A month', 'Three days'], answer: 'About two weeks' },
      { question: 'What did the symptoms start with?', options: ['A headache', 'A sore throat', 'A fever', 'A stomachache'], answer: 'A sore throat' },
      { question: 'What does the doctor prescribe?', options: ['Cough syrup', 'Antibiotics', 'Painkillers', 'Vitamins'], answer: 'Antibiotics' },
      { question: 'How often should the patient take the tablet?', options: ['Once a day', 'Twice a day', 'Three times a day', 'Every 4 hours'], answer: 'Twice a day' },
    ],
  },
  {
    id: 'd4', level: 'C1', title: 'Job Negotiation',
    situation: 'Negociar condiciones laborales con RRHH',
    lines: [
      { speaker: '👔 HR', text: "We'd like to offer you the position. The starting salary is fifty-five thousand.", translation: 'Nos gustaría ofrecerle el puesto. El salario inicial es de 55.000.' },
      { speaker: '🧑‍💼 Candidate', text: "Thank you. I'm thrilled about the opportunity. However, given my experience, I was hoping for something closer to sixty-five.", translation: 'Gracias. Estoy encantado con la oportunidad. Sin embargo, dada mi experiencia, esperaba algo más cercano a 65.000.' },
      { speaker: '👔 HR', text: "I understand. We could meet in the middle at sixty, with a performance review after six months.", translation: 'Entiendo. Podríamos encontrarnos a medio camino en 60.000, con una revisión de rendimiento a los seis meses.' },
      { speaker: '🧑‍💼 Candidate', text: "That sounds reasonable. Could I also ask about remote work flexibility?", translation: 'Suena razonable. ¿Puedo preguntar también sobre flexibilidad de teletrabajo?' },
      { speaker: '👔 HR', text: "We offer a hybrid model—three days in the office and two from home.", translation: 'Ofrecemos un modelo híbrido: tres días en oficina y dos desde casa.' },
      { speaker: '🧑‍💼 Candidate', text: "Perfect. And what about professional development opportunities?", translation: '¿Y en cuanto a oportunidades de desarrollo profesional?' },
      { speaker: '👔 HR', text: "We provide an annual training budget of two thousand pounds and access to online courses.", translation: 'Proporcionamos un presupuesto anual de formación de 2.000 libras y acceso a cursos online.' },
      { speaker: '🧑‍💼 Candidate', text: "Excellent. I'd be happy to accept on those terms.", translation: 'Excelente. Estaré encantado de aceptar con esas condiciones.' },
    ],
    questions: [
      { question: 'What was the initial salary offer?', options: ['£50,000', '£55,000', '£60,000', '£65,000'], answer: '£55,000' },
      { question: 'What salary did they agree on?', options: ['£55,000', '£58,000', '£60,000', '£65,000'], answer: '£60,000' },
      { question: 'What is the remote work arrangement?', options: ['Fully remote', '3 office / 2 home', '4 office / 1 home', 'No remote work'], answer: '3 office / 2 home' },
      { question: 'What is the annual training budget?', options: ['£1,000', '£1,500', '£2,000', '£3,000'], answer: '£2,000' },
    ],
  },
]

export default function Dialogues() {
  const { state, dispatch } = useGame()
  const [dialogueIdx, setDialogueIdx] = useState(0)
  const [phase, setPhase] = useState<'read' | 'quiz' | 'done'>('read')
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const dialogue = DIALOGUES[dialogueIdx]

  function startQuiz() { setPhase('quiz'); setQIdx(0); setScore(0); setAnswered(false); setSelected(null) }

  function answer(opt: string) {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    if (opt === dialogue.questions[qIdx].answer) {
      setScore(s => s + 1)
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
  }

  function next() {
    if (qIdx + 1 >= dialogue.questions.length) {
      setPhase('done')
      const xp = score * 3
      if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp })
      if (state.soundEnabled) playComplete()
    } else {
      setQIdx(i => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  function nextDialogue() {
    setDialogueIdx(i => (i + 1) % DIALOGUES.length)
    setPhase('read')
    setQIdx(0)
    setScore(0)
    setAnswered(false)
    setSelected(null)
  }

  if (phase === 'done') {
    return (
      <div className="dialogues fade-in">
        <div className="reading-done">
          <span className="big-emoji">🎭</span>
          <h2>¡Diálogo completado!</h2>
          <p>{score}/{dialogue.questions.length} correctas</p>
          <p className="muted">+{score * 3} XP</p>
          <button className="btn-primary" onClick={nextDialogue}>SIGUIENTE DIÁLOGO</button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const q = dialogue.questions[qIdx]
    return (
      <div className="dialogues fade-in">
        <div className="dial-quiz">
          <p className="muted">Pregunta {qIdx + 1}/{dialogue.questions.length}</p>
          <h3 className="reading-q">{q.question}</h3>
          <div className="choice-grid">
            {q.options.map(opt => {
              const isCorrect = opt === q.answer
              const cls = answered ? (isCorrect ? 'choice correct' : selected === opt ? 'choice wrong' : 'choice') : `choice ${selected === opt ? 'selected' : ''}`
              return <button key={opt} className={cls} disabled={answered} onClick={() => answer(opt)}>{opt}</button>
            })}
          </div>
          {answered && <button className={`btn-primary ${selected === q.answer ? '' : 'btn-danger'}`} onClick={next}>CONTINUAR</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="dialogues fade-in">
      <div className="dial-header">
        <span className="reading-level">{dialogue.level}</span>
        <h3>{dialogue.title}</h3>
      </div>
      <p className="muted dial-situation">📍 {dialogue.situation}</p>

      <div className="dial-lines">
        {dialogue.lines.map((line, i) => (
          <button key={i} className="dial-line" onClick={() => speak(line.text, 'en-US', 0.9)}>
            <span className="dial-speaker">{line.speaker}</span>
            <span className="dial-text">{line.text}</span>
            <span className="dial-translation">{line.translation}</span>
          </button>
        ))}
      </div>

      <div className="dial-actions">
        <button className="btn-primary" onClick={startQuiz}>RESPONDER PREGUNTAS</button>
        <button className="btn-ghost" onClick={nextDialogue}>Siguiente diálogo →</button>
      </div>
    </div>
  )
}
