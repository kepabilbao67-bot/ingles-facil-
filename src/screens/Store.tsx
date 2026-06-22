import { useGame, MAX_HEARTS } from '../context/GameContext'
import { useT } from '../i18n'

const GEM_PACKS = [
  { id: 'p1', gems: 200, price: '0,99 €', emoji: '💎' },
  { id: 'p2', gems: 600, price: '2,49 €', emoji: '💎💎', best: false },
  { id: 'p3', gems: 1500, price: '4,99 €', emoji: '💎💎💎', best: true },
]

export default function Store() {
  const { state, dispatch } = useGame()
  const t = useT()

  function buyPack(amount: number) {
    // Demo: añade gemas directamente. En producción, conectar a Stripe
    // (pago único) o Google Play Billing para packs consumibles.
    dispatch({ type: 'BUY_GEMS', amount })
    alert(`¡Has conseguido ${amount} 💎! (demo, sin cobro real)`)
  }

  return (
    <div className="store fade-in">
      <div className="store-balance">
        <span>{t('your_balance')}</span>
        <strong>💎 {state.gems}</strong>
      </div>

      {/* Gastar gemas */}
      <h3 className="store-h3">{t('redeem_gems')}</h3>
      <div className="store-items">
        <div className="store-item">
          <span className="si-emoji">❤️</span>
          <span className="si-info">
            <strong>{t('refill_lives')}</strong>
            <small>Rellena tus {MAX_HEARTS} corazones</small>
          </span>
          <button
            className="si-btn"
            disabled={state.gems < 50 || state.hearts >= MAX_HEARTS || state.isPremium}
            onClick={() => dispatch({ type: 'BUY_HEARTS' })}
          >
            {state.isPremium ? '∞' : '50 💎'}
          </button>
        </div>

        <div className="store-item">
          <span className="si-emoji">🧊</span>
          <span className="si-info">
            <strong>{t('streak_freeze')}</strong>
            <small>Salva tu racha si fallas un día (tienes {state.streakFreezes}/3)</small>
          </span>
          <button
            className="si-btn"
            disabled={state.gems < 200 || state.streakFreezes >= 3}
            onClick={() => dispatch({ type: 'BUY_STREAK_FREEZE' })}
          >
            200 💎
          </button>
        </div>
      </div>

      {/* Comprar gemas */}
      <h3 className="store-h3">{t('get_more_gems')}</h3>
      <div className="gem-packs">
        {GEM_PACKS.map((p) => (
          <button key={p.id} className={`gem-pack ${p.best ? 'best' : ''}`} onClick={() => buyPack(p.gems)}>
            {p.best && <span className="gp-best">MEJOR VALOR</span>}
            <span className="gp-emoji">{p.emoji}</span>
            <span className="gp-gems">{p.gems} gemas</span>
            <span className="gp-price">{p.price}</span>
          </button>
        ))}
      </div>

      <p className="muted store-note">
        Los pagos son una demo. Para cobrar de verdad, conecta Stripe (web) o Google Play Billing (Android).
      </p>
    </div>
  )
}
