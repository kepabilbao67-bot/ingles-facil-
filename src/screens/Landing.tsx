interface Props {
  onStart: () => void
}

const FEATURES = [
  { icon: '🤖', title: 'Tutor de IA', desc: 'Conversa con un tutor inteligente que te corrige al instante.' },
  { icon: '🎮', title: 'Aprende jugando', desc: 'Rachas, ligas, XP y logros que te enganchan cada día.' },
  { icon: '🗣️', title: 'Pronunciación', desc: 'Practica hablando y recibe feedback con tu micrófono.' },
  { icon: '🧠', title: 'Memoria duradera', desc: 'Repetición espaciada para no olvidar lo aprendido.' },
  { icon: '📖', title: 'Historias reales', desc: 'Lee y escucha diálogos de situaciones cotidianas.' },
  { icon: '📈', title: 'De A1 a C1', desc: 'Un camino completo, desde cero hasta nivel experto.' },
]

const STEPS = [
  { n: '1', text: 'Haz el test de nivel en 1 minuto' },
  { n: '2', text: 'Practica 5 min al día con lecciones cortas' },
  { n: '3', text: 'Conversa con el tutor de IA y mejora rápido' },
]

export default function Landing({ onStart }: Props) {
  return (
    <div className="landing">
      {/* HERO */}
      <header className="lp-hero">
        <div className="lp-fox">🦊</div>
        <h1 className="lp-title">
          Aprende inglés <span>de verdad</span>
        </h1>
        <p className="lp-subtitle">
          La app divertida con tutor de IA, lecciones cortas y un método que funciona. Empieza gratis hoy.
        </p>
        <button className="btn-primary lp-cta" onClick={onStart}>
          EMPEZAR GRATIS
        </button>
        <p className="lp-note">Sin tarjeta · Funciona en el móvil · 5 min al día</p>
      </header>

      {/* SOCIAL PROOF */}
      <div className="lp-proof">
        <div>
          <strong>+10.000</strong>
          <span>estudiantes</span>
        </div>
        <div>
          <strong>4.8 ★</strong>
          <span>valoración</span>
        </div>
        <div>
          <strong>A1–C1</strong>
          <span>todos los niveles</span>
        </div>
      </div>

      {/* FEATURES */}
      <section className="lp-section">
        <h2 className="lp-h2">Todo lo que necesitas</h2>
        <div className="lp-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="lp-feature">
              <span className="lp-feature-icon">{f.icon}</span>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section">
        <h2 className="lp-h2">Cómo funciona</h2>
        <div className="lp-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="lp-step">
              <span className="lp-step-num">{s.n}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section">
        <h2 className="lp-h2">Empieza gratis, mejora con Premium</h2>
        <div className="lp-pricing">
          <div className="lp-plan">
            <h3>Gratis</h3>
            <span className="lp-price">0 €</span>
            <ul>
              <li>✓ Todas las lecciones básicas</li>
              <li>✓ Historias y ligas</li>
              <li>✓ 5 mensajes de tutor al día</li>
            </ul>
            <button className="btn-ghost" onClick={onStart}>
              Empezar
            </button>
          </div>
          <div className="lp-plan featured">
            <span className="lp-badge">POPULAR</span>
            <h3>👑 Premium</h3>
            <span className="lp-price">
              4,99 € <small>/mes</small>
            </span>
            <ul>
              <li>✓ Tutor de IA ilimitado</li>
              <li>✓ Vidas infinitas, sin anuncios</li>
              <li>✓ Todo el contenido (A1–C1)</li>
            </ul>
            <button className="btn-primary gold" onClick={onStart}>
              Prueba 7 días gratis
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final">
        <h2>¿List@ para hablar inglés? 🚀</h2>
        <button className="btn-primary lp-cta" onClick={onStart}>
          CREAR MI CUENTA GRATIS
        </button>
      </section>

      <footer className="lp-footer">
        <span>🦊 LinguaFox</span>
        <small>Hecho con cariño para hispanohablantes</small>
      </footer>
    </div>
  )
}
