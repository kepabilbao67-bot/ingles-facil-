import { useState } from 'react'

interface GrammarTopic {
  id: string
  title: string
  level: string
  icon: string
  formula: string
  explanation: string
  examples: { en: string; es: string }[]
  commonMistake?: string
}

const TOPICS: GrammarTopic[] = [
  {
    id: 'g1', title: 'Present Simple', level: 'A1-A2', icon: '🔵',
    formula: 'Subject + verb (+ s/es for he/she/it)',
    explanation: 'Para hábitos, rutinas, verdades generales y estados permanentes.',
    examples: [
      { en: 'I work from home.', es: 'Trabajo desde casa.' },
      { en: 'She lives in London.', es: 'Ella vive en Londres.' },
      { en: 'Water boils at 100°C.', es: 'El agua hierve a 100°C.' },
    ],
    commonMistake: '❌ "She work" → ✅ "She works" (add -s for he/she/it)',
  },
  {
    id: 'g2', title: 'Present Continuous', level: 'A1-A2', icon: '🟢',
    formula: 'Subject + am/is/are + verb-ing',
    explanation: 'Para acciones que ocurren ahora mismo o son temporales.',
    examples: [
      { en: "I'm reading a book right now.", es: 'Estoy leyendo un libro ahora.' },
      { en: 'She is working from home this week.', es: 'Está trabajando desde casa esta semana.' },
    ],
    commonMistake: '❌ "I reading" → ✅ "I am reading" (need am/is/are)',
  },
  {
    id: 'g3', title: 'Past Simple', level: 'A2-B1', icon: '🟣',
    formula: 'Subject + verb-ed (regular) / irregular form',
    explanation: 'Para acciones completadas en el pasado en un momento específico.',
    examples: [
      { en: 'I visited Paris last year.', es: 'Visité París el año pasado.' },
      { en: 'She went to the cinema yesterday.', es: 'Fue al cine ayer.' },
    ],
    commonMistake: '❌ "I goed" → ✅ "I went" (go is irregular!)',
  },
  {
    id: 'g4', title: 'Present Perfect', level: 'B1-B2', icon: '🟡',
    formula: 'Subject + have/has + past participle',
    explanation: 'Para experiencias de vida, acciones recientes con efecto presente, o con since/for.',
    examples: [
      { en: 'I have been to Japan twice.', es: 'He estado en Japón dos veces.' },
      { en: 'She has lived here since 2010.', es: 'Vive aquí desde 2010.' },
      { en: "I've just finished my homework.", es: 'Acabo de terminar mis deberes.' },
    ],
    commonMistake: '❌ "I have went" → ✅ "I have gone" (use past participle, not past simple)',
  },
  {
    id: 'g5', title: 'Future: Will vs Going to', level: 'A2-B1', icon: '🔮',
    formula: 'Will + verb / am-is-are + going to + verb',
    explanation: 'Will: decisiones espontáneas, predicciones, promesas. Going to: planes decididos, evidencia visible.',
    examples: [
      { en: "I'll help you with that. (spontaneous)", es: 'Te ayudaré con eso.' },
      { en: "I'm going to study medicine. (planned)", es: 'Voy a estudiar medicina.' },
      { en: "Look at those clouds. It's going to rain. (evidence)", es: 'Mira esas nubes. Va a llover.' },
    ],
    commonMistake: '❌ "I will going" → ✅ "I am going to" OR "I will go"',
  },
  {
    id: 'g6', title: 'Conditionals (0, 1, 2, 3)', level: 'B1-C1', icon: '🔀',
    formula: '0: If + present → present\n1: If + present → will\n2: If + past → would\n3: If + past perfect → would have',
    explanation: 'Condicional 0: verdades. 1: posible/probable. 2: hipotético presente. 3: hipotético pasado (imposible).',
    examples: [
      { en: 'If you heat ice, it melts. (0)', es: 'Si calientas hielo, se derrite.' },
      { en: 'If it rains, I will stay home. (1)', es: 'Si llueve, me quedaré en casa.' },
      { en: 'If I were rich, I would travel. (2)', es: 'Si fuera rico, viajaría.' },
      { en: 'If I had studied, I would have passed. (3)', es: 'Si hubiera estudiado, habría aprobado.' },
    ],
  },
  {
    id: 'g7', title: 'Passive Voice', level: 'B2-C1', icon: '🔄',
    formula: 'Subject + be + past participle (+ by agent)',
    explanation: 'Cuando el receptor de la acción es más importante que quien la realiza.',
    examples: [
      { en: 'The cake was made by my grandmother.', es: 'El pastel fue hecho por mi abuela.' },
      { en: 'English is spoken worldwide.', es: 'El inglés se habla en todo el mundo.' },
      { en: 'The report is being written now.', es: 'El informe se está escribiendo ahora.' },
    ],
  },
  {
    id: 'g8', title: 'Reported Speech', level: 'B2-C1', icon: '💬',
    formula: 'Subject + said/told + (that) + backshifted tense',
    explanation: 'Transmitir lo que alguien dijo. Los tiempos "retroceden" un paso.',
    examples: [
      { en: '"I am tired" → She said she was tired.', es: '"Estoy cansada" → Dijo que estaba cansada.' },
      { en: '"I will come" → He said he would come.', es: '"Vendré" → Dijo que vendría.' },
      { en: '"Did you go?" → She asked if I had gone.', es: '"¿Fuiste?" → Preguntó si había ido.' },
    ],
  },
  {
    id: 'g9', title: 'Relative Clauses', level: 'B1-B2', icon: '🔗',
    formula: 'who (people) / which (things) / that (both) / where (places) / whose (possession)',
    explanation: 'Para dar información extra sobre un sustantivo.',
    examples: [
      { en: 'The woman who lives next door is a doctor.', es: 'La mujer que vive al lado es médica.' },
      { en: 'The book which I read was excellent.', es: 'El libro que leí era excelente.' },
      { en: "That's the restaurant where we met.", es: 'Ese es el restaurante donde nos conocimos.' },
    ],
  },
  {
    id: 'g10', title: 'Modal Verbs', level: 'A2-B2', icon: '⚙️',
    formula: 'Subject + modal + base verb (no "to", no conjugation)',
    explanation: 'Can (ability), must (obligation), should (advice), might (possibility), would (hypothetical).',
    examples: [
      { en: 'You should see a doctor.', es: 'Deberías ver a un médico.' },
      { en: 'She might come to the party.', es: 'Puede que venga a la fiesta.' },
      { en: 'You must not park here.', es: 'No debes aparcar aquí.' },
    ],
    commonMistake: '❌ "She can to swim" → ✅ "She can swim" (no "to" after modals)',
  },
]

export default function GrammarReference() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="grammar-ref fade-in">
      <h2>📐 Referencia Gramatical</h2>
      <p className="muted">Todo lo que necesitas saber, nivel por nivel</p>

      <div className="gr-list">
        {TOPICS.map(topic => (
          <div key={topic.id} className="gr-card" onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}>
            <div className="gr-header">
              <span className="gr-icon">{topic.icon}</span>
              <div className="gr-title">
                <strong>{topic.title}</strong>
                <span className="wt-level">{topic.level}</span>
              </div>
              <span className="wt-arrow">{expandedId === topic.id ? '▲' : '▼'}</span>
            </div>
            {expandedId === topic.id && (
              <div className="gr-body fade-in">
                <div className="gr-formula">
                  <span className="wt-label">📋 Fórmula:</span>
                  <p className="gr-formula-text">{topic.formula}</p>
                </div>
                <p className="gr-explanation">{topic.explanation}</p>
                <div className="gr-examples">
                  <span className="wt-label">📝 Ejemplos:</span>
                  {topic.examples.map((ex, i) => (
                    <div key={i} className="gr-example">
                      <p className="gr-ex-en">{ex.en}</p>
                      <p className="gr-ex-es">{ex.es}</p>
                    </div>
                  ))}
                </div>
                {topic.commonMistake && (
                  <div className="gr-mistake">
                    <span className="wt-label">⚠️ Error común:</span>
                    <p>{topic.commonMistake}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
