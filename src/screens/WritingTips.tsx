import { useState } from 'react'

interface WritingTip {
  id: string
  category: string
  icon: string
  title: string
  wrong: string
  correct: string
  explanation: string
  level: string
}

const TIPS: WritingTip[] = [
  // Common Spanish-speaker mistakes
  { id: 'w1', category: 'Falsos amigos', icon: '⚠️', title: 'Actually ≠ Actualmente', wrong: 'Actually, I live in Madrid.', correct: 'Currently, I live in Madrid.', explanation: '"Actually" = "en realidad". "Currently" = "actualmente". "Actually, I don\'t agree" = "En realidad, no estoy de acuerdo".', level: 'B1' },
  { id: 'w2', category: 'Falsos amigos', icon: '⚠️', title: 'Sensible ≠ Sensible', wrong: 'She is very sensible, she cries easily.', correct: 'She is very sensitive, she cries easily.', explanation: '"Sensible" en inglés = "sensato/prudente". "Sensitive" = "sensible" en español.', level: 'B1' },
  { id: 'w3', category: 'Falsos amigos', icon: '⚠️', title: 'Assist ≠ Asistir', wrong: 'I will assist the concert tonight.', correct: 'I will attend the concert tonight.', explanation: '"Assist" = "ayudar". "Attend" = "asistir/acudir a". Un "assistant" es un ayudante.', level: 'B1' },
  { id: 'w4', category: 'Falsos amigos', icon: '⚠️', title: 'Embarassed ≠ Embarazada', wrong: 'My sister is embarrassed. The baby is due in March.', correct: 'My sister is pregnant. The baby is due in March.', explanation: '"Embarrassed" = "avergonzado". "Pregnant" = "embarazada". ¡Error clásico!', level: 'A2' },
  { id: 'w5', category: 'Falsos amigos', icon: '⚠️', title: 'Pretend ≠ Pretender', wrong: 'I pretend to finish this project today.', correct: 'I intend to finish this project today.', explanation: '"Pretend" = "fingir". "Intend" = "pretender/tener la intención".', level: 'B1' },
  // Grammar mistakes
  { id: 'w6', category: 'Gramática', icon: '📐', title: "It's vs Its", wrong: 'The dog wagged it\'s tail.', correct: 'The dog wagged its tail.', explanation: '"It\'s" = "it is" o "it has". "Its" (sin apóstrofe) = posesivo. "Its tail" = "su cola".', level: 'B1' },
  { id: 'w7', category: 'Gramática', icon: '📐', title: 'Their / There / They\'re', wrong: 'Their going to there house.', correct: "They're going to their house.", explanation: '"They\'re" = "they are". "Their" = posesivo. "There" = lugar. Truco: "they\'re" siempre se puede expandir a "they are".', level: 'A2' },
  { id: 'w8', category: 'Gramática', icon: '📐', title: 'Much vs Many', wrong: 'I don\'t have much friends.', correct: "I don't have many friends.", explanation: '"Much" = incontables (water, time, money). "Many" = contables (friends, books, cars). "How much water?" vs "How many books?"', level: 'A2' },
  { id: 'w9', category: 'Gramática', icon: '📐', title: 'Since vs For', wrong: 'I have lived here since 5 years.', correct: 'I have lived here for 5 years.', explanation: '"Since" = punto en el tiempo (since 2020, since Monday). "For" = duración (for 5 years, for 2 hours).', level: 'B1' },
  { id: 'w10', category: 'Gramática', icon: '📐', title: 'Make vs Do', wrong: 'I need to make my homework.', correct: 'I need to do my homework.', explanation: '"Do" = tareas, actividades (do homework, do exercise, do the dishes). "Make" = crear algo (make a cake, make a decision, make a mistake).', level: 'B1' },
  // Style & register
  { id: 'w11', category: 'Estilo', icon: '✨', title: 'Evita "very"', wrong: 'The movie was very good and very interesting.', correct: 'The movie was excellent and fascinating.', explanation: 'En vez de "very + adj", usa un adjetivo más preciso: very good → excellent, very bad → terrible, very big → enormous, very small → tiny.', level: 'B2' },
  { id: 'w12', category: 'Estilo', icon: '✨', title: 'Evita empezar con "I think"', wrong: 'I think that climate change is a problem.', correct: 'It is widely acknowledged that climate change poses a significant threat.', explanation: 'En escritura formal/académica, evita "I think". Usa: "It is evident that...", "Research suggests...", "One could argue..."', level: 'C1' },
  { id: 'w13', category: 'Estilo', icon: '✨', title: 'Conectores variados', wrong: 'I like coffee. And I like tea. And I like juice.', correct: 'I enjoy coffee. Furthermore, I appreciate tea as well as juice.', explanation: 'Varía tus conectores: also, moreover, furthermore, in addition, besides, what\'s more, not only... but also...', level: 'B2' },
  { id: 'w14', category: 'Estilo', icon: '✨', title: 'Passive para formalidad', wrong: 'People say that the economy is improving.', correct: 'It is said that the economy is improving.', explanation: 'La pasiva impersonal da un tono más formal y objetivo: "It is believed...", "It has been reported...", "It is widely known..."', level: 'C1' },
  // Pronunciation-related spelling
  { id: 'w15', category: 'Ortografía', icon: '📝', title: 'Would have, NOT would of', wrong: 'I would of gone if I had known.', correct: 'I would have gone if I had known.', explanation: 'Error muy común en nativos también. "Would\'ve" suena como "would of" pero se escribe "would have". Lo mismo con could/should.', level: 'B2' },
  { id: 'w16', category: 'Ortografía', icon: '📝', title: 'Lose vs Loose', wrong: 'I don\'t want to loose my keys.', correct: "I don't want to lose my keys.", explanation: '"Lose" (/luːz/) = perder. "Loose" (/luːs/) = suelto/flojo. "I lose things" vs "a loose screw".', level: 'B1' },
  { id: 'w17', category: 'Ortografía', icon: '📝', title: 'Then vs Than', wrong: 'She is taller then me.', correct: 'She is taller than me.', explanation: '"Than" = comparaciones (bigger than, more than). "Then" = tiempo/secuencia (and then, back then). Truco: thAN = comparación.', level: 'A2' },
  { id: 'w18', category: 'Ortografía', icon: '📝', title: 'Affect vs Effect', wrong: 'The weather effected my mood.', correct: 'The weather affected my mood.', explanation: '"Affect" = verbo (influir en). "Effect" = sustantivo (resultado). "The rain affects me" → "The effect of rain on me".', level: 'B2' },
  // Prepositions
  { id: 'w19', category: 'Preposiciones', icon: '🔗', title: 'Depend ON (not of)', wrong: 'It depends of the situation.', correct: 'It depends on the situation.', explanation: 'En español "depende de" pero en inglés "depends ON". También: interested IN, good AT, different FROM.', level: 'B1' },
  { id: 'w20', category: 'Preposiciones', icon: '🔗', title: 'Arrive IN/AT (not to)', wrong: 'We arrived to the airport.', correct: 'We arrived at the airport.', explanation: '"Arrive at" = lugar específico (airport, school). "Arrive in" = ciudad/país (arrive in London). Nunca "arrive to".', level: 'A2' },
]

const CATEGORIES = ['Todos', 'Falsos amigos', 'Gramática', 'Estilo', 'Ortografía', 'Preposiciones']

export default function WritingTips() {
  const [category, setCategory] = useState('Todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = category === 'Todos' ? TIPS : TIPS.filter((t) => t.category === category)

  return (
    <div className="writing-tips fade-in">
      <h2>📝 Tips de Escritura</h2>
      <p className="muted">Errores comunes de hispanohablantes y cómo evitarlos</p>

      <div className="wt-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`wt-cat ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="wt-list">
        {filtered.map((tip) => (
          <div key={tip.id} className="wt-card" onClick={() => setExpandedId(expandedId === tip.id ? null : tip.id)}>
            <div className="wt-card-header">
              <span className="wt-icon">{tip.icon}</span>
              <div className="wt-card-title">
                <strong>{tip.title}</strong>
                <span className="wt-level">{tip.level}</span>
              </div>
              <span className="wt-arrow">{expandedId === tip.id ? '▲' : '▼'}</span>
            </div>
            {expandedId === tip.id && (
              <div className="wt-card-body fade-in">
                <div className="wt-wrong">
                  <span className="wt-label">❌ Incorrecto:</span>
                  <p>{tip.wrong}</p>
                </div>
                <div className="wt-correct">
                  <span className="wt-label">✅ Correcto:</span>
                  <p>{tip.correct}</p>
                </div>
                <div className="wt-explanation">
                  <span className="wt-label">💡 Explicación:</span>
                  <p>{tip.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
