import { useState } from 'react'

interface CulturalTip {
  id: string
  icon: string
  title: string
  country: string
  content: string
  doText: string
  dontText: string
}

const TIPS: CulturalTip[] = [
  { id: 'c1', icon: '🇬🇧', title: 'Small Talk sobre el tiempo', country: 'UK', content: 'Los británicos adoran hablar del tiempo. Es la forma más natural de iniciar una conversación con desconocidos. "Lovely weather today, isn\'t it?" funciona siempre.', doText: '"Bit chilly today, isn\'t it?" / "Looks like rain later."', dontText: 'No te sorprendas si alguien comenta el tiempo 5 veces al día.' },
  { id: 'c2', icon: '🇬🇧', title: 'El understatement británico', country: 'UK', content: 'Los británicos tienden a minimizar las cosas. Si dicen "not bad" probablemente significa que algo es bastante bueno. "A bit of a problem" puede significar un desastre total.', doText: '"How was the exam?" — "Not too bad, actually" (= fue genial)', dontText: 'No interpretes literalmente. "Interesting..." a menudo significa que no les gusta.' },
  { id: 'c3', icon: '🇺🇸', title: '"How are you?" es un saludo', country: 'USA', content: 'En EEUU, "How are you?" no es una pregunta real sobre tu estado. Es un saludo. La respuesta esperada es "Good, thanks!" o "Great, you?"', doText: '"Hey, how are you?" — "Good, thanks! How about you?"', dontText: 'No respondas con un monólogo sobre tus problemas. Es solo un saludo.' },
  { id: 'c4', icon: '🇺🇸', title: 'Propinas (Tipping)', country: 'USA', content: 'En EEUU las propinas son obligatorias en restaurantes (15-20%). Los camareros dependen de ellas. En UK, un 10% es generoso pero no obligatorio.', doText: 'USA: 18-20% en restaurantes. UK: 10-12% o redondear.', dontText: 'No dejes el restaurante sin propina en EEUU. Es considerado muy grosero.' },
  { id: 'c5', icon: '🇬🇧', title: 'La cola (Queue)', country: 'UK', content: 'Los británicos se toman MUY en serio las colas. Saltarse una cola (queue jumping) es uno de los peores crímenes sociales que puedes cometer.', doText: 'Espera tu turno pacientemente. "Is this the queue?" para confirmar.', dontText: 'NUNCA te cueles. Incluso si tienes prisa, es inaceptable.' },
  { id: 'c6', icon: '🇺🇸', title: 'Personal space & smiling', country: 'USA', content: 'Los estadounidenses sonríen mucho y son muy amistosos con desconocidos. Esto no significa que quieran ser tus amigos íntimos. Es simplemente cortesía social.', doText: 'Sonríe, sé amistoso, haz small talk en la cola del supermercado.', dontText: 'No confundas amabilidad con amistad profunda.' },
  { id: 'c7', icon: '🇬🇧', title: 'Sorry: la palabra mágica', country: 'UK', content: 'Los británicos dicen "sorry" constantemente: si alguien les pisa, si quieren pasar, si no han oído bien, si miran a alguien... Es automático.', doText: '"Sorry, could I just get past?" / "Sorry, what was that?"', dontText: 'No te disculpes si alguien te pisa en España, pero en UK sí deberías.' },
  { id: 'c8', icon: '🌍', title: 'Tabú: salario y edad', country: 'Global', content: 'En países anglófonos es muy maleducado preguntar cuánto gana alguien o su edad exacta. Estos son temas privados.', doText: '"What do you do for a living?" (pregunta aceptable sobre trabajo)', dontText: 'Nunca preguntes "How much do you earn?" ni "How old are you?" directamente.' },
  { id: 'c9', icon: '🇦🇺', title: 'El humor australiano', country: 'AUS', content: 'Los australianos usan mucho el sarcasmo y la auto-deprecación. Si te insultan suavemente, probablemente te están mostrando afecto. "You\'re alright" es un gran cumplido.', doText: 'Acepta las bromas con humor. "No worries, mate" resuelve todo.', dontText: 'No te ofendas si te llaman "mate" al instante o te toman el pelo.' },
  { id: 'c10', icon: '🇨🇦', title: 'Canadienses y cortesía', country: 'CAN', content: 'Los canadienses son famosos por ser extremadamente educados. "Eh?" al final de frases es su muletilla. Mantener la puerta abierta a la persona de detrás es sagrado.', doText: '"Thank you!" con frecuencia. Mantén puertas abiertas. Di "sorry" mucho.', dontText: 'No confundas Canadá con EEUU. Los canadienses se ofenden.' },
]

export default function CulturalTips() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="cultural fade-in">
      <h2>🌍 Tips Culturales</h2>
      <p className="muted">Entender la cultura para hablar como un nativo</p>

      <div className="cultural-list">
        {TIPS.map(tip => (
          <div key={tip.id} className="cultural-card" onClick={() => setExpandedId(expandedId === tip.id ? null : tip.id)}>
            <div className="cultural-header">
              <span className="cultural-icon">{tip.icon}</span>
              <div className="cultural-title">
                <strong>{tip.title}</strong>
                <span className="wt-level">{tip.country}</span>
              </div>
              <span className="wt-arrow">{expandedId === tip.id ? '▲' : '▼'}</span>
            </div>
            {expandedId === tip.id && (
              <div className="cultural-body fade-in">
                <p className="cultural-content">{tip.content}</p>
                <div className="wt-correct">
                  <span className="wt-label">✅ Hazlo así:</span>
                  <p>{tip.doText}</p>
                </div>
                <div className="wt-wrong">
                  <span className="wt-label">❌ Evita:</span>
                  <p>{tip.dontText}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
