import { useState } from 'react'
import { useGame } from '../context/GameContext'

interface Props {
  onClose: () => void
}

const PLANS = [
  { id: 'monthly', label: 'Mensual', price: '4,99 €', per: '/mes', save: '' },
  { id: 'yearly', label: 'Anual', price: '39,99 €', per: '/año', save: 'AHORRA 33%' },
]

const BENEFITS = [
  { icon: '🤖', text: 'Tutor de IA ilimitado (Claude)' },
  { icon: '❤️', text: 'Vidas ilimitadas, sin esperas' },
  { icon: '🚫', text: 'Sin anuncios' },
  { icon: '📚', text: 'Todas las lecciones y unidades' },
  { icon: '📊', text: 'Estadísticas avanzadas de progreso' },
  { icon: '🎯', text: 'Repasos personalizados ilimitados' },
]

export default function Premium({ onClose }: Props) {
  const { state, dispatch } = useGame()
  const [plan, setPlan] = useState('yearly')
  const [purchasing, setPurchasing] = useState(false)

  if (state.isPremium) {
    return (
      <div className="premium-active fade-in">
        <div className="premium-crown">👑</div>
        <h1>¡Eres Premium!</h1>
        <p className="muted">Disfrutas de todas las ventajas. ¡Gracias por tu apoyo! 🦊</p>
        <button className="btn-primary" onClick={onClose}>
          VOLVER
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            if (confirm('¿Cancelar Premium? (solo en esta demo)')) dispatch({ type: 'CANCEL_PREMIUM' })
          }}
        >
          Cancelar suscripción
        </button>
      </div>
    )
  }

  function purchase() {
    setPurchasing(true)
    const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) || ''
    if (apiBase) {
      // Producción: crear sesión de pago real en Stripe y redirigir
      fetch(`${apiBase}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, origin: window.location.origin }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.url) window.location.href = data.url
          else throw new Error(data.error || 'No se pudo iniciar el pago')
        })
        .catch((e) => {
          alert('Error al iniciar el pago: ' + (e?.message || e))
          setPurchasing(false)
        })
      return
    }
    // Demo: activación simulada (sin cobro real)
    setTimeout(() => {
      dispatch({ type: 'GO_PREMIUM' })
      setPurchasing(false)
    }, 900)
  }

  return (
    <div className="premium fade-in">
      <button className="close-btn premium-close" onClick={onClose}>
        ✕
      </button>
      <div className="premium-hero">
        <div className="premium-crown">👑</div>
        <h1>LinguaFox Premium</h1>
        <p>Aprende sin límites y más rápido</p>
      </div>

      <div className="benefits">
        {BENEFITS.map((b) => (
          <div key={b.text} className="benefit">
            <span className="benefit-icon">{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      <div className="plans">
        {PLANS.map((p) => (
          <button
            key={p.id}
            className={`plan ${plan === p.id ? 'selected' : ''}`}
            onClick={() => setPlan(p.id)}
          >
            {p.save && <span className="plan-save">{p.save}</span>}
            <span className="plan-label">{p.label}</span>
            <span className="plan-price">{p.price}</span>
            <span className="plan-per">{p.per}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary gold" disabled={purchasing} onClick={purchase}>
        {purchasing ? 'Procesando…' : 'EMPEZAR PRUEBA GRATIS DE 7 DÍAS'}
      </button>
      <p className="premium-fine muted">
        Cancela cuando quieras. Pago seguro. (Demo: integra Stripe o Google Play Billing para
        cobrar de verdad.)
      </p>
    </div>
  )
}
