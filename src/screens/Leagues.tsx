import { useMemo } from 'react'
import { useGame } from '../context/GameContext'

// Liga semanal simulada (offline). Genera oponentes "bot" de forma
// determinista segun la semana, para crear sensacion de competicion.
const BOT_NAMES = [
  'Carlos', 'Sofia', 'Liam', 'Emma', 'Mateo', 'Olivia', 'Hugo', 'Lucia',
  'Noah', 'Valentina', 'Leo', 'Martina', 'Daniel', 'Paula', 'Bruno',
]

const TIERS = [
  { name: 'Bronce', emoji: '🥉', color: '#cd7f32' },
  { name: 'Plata', emoji: '🥈', color: '#9eaab5' },
  { name: 'Oro', emoji: '🥇', color: '#ffc800' },
  { name: 'Diamante', emoji: '💎', color: '#1cb0f6' },
]

// PRNG simple y determinista (mulberry32)
function seededRandom(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

interface Row {
  name: string
  xp: number
  isPlayer: boolean
}

export default function Leagues() {
  const { state } = useGame()

  const { rows, tier } = useMemo(() => {
    const seed = hashStr(state.weekKey || 'week')
    const rand = seededRandom(seed)
    // tier basado en XP total acumulada
    const tierIndex = Math.min(TIERS.length - 1, Math.floor(state.xp / 300))
    const bots: Row[] = BOT_NAMES.map((name) => ({
      name,
      // XP de bot influenciado por el tier (mas alto = rivales mas fuertes)
      xp: Math.floor(rand() * (120 + tierIndex * 80)) + tierIndex * 30,
      isPlayer: false,
    }))
    const all: Row[] = [
      ...bots,
      { name: state.name || 'Tú', xp: state.weeklyXp, isPlayer: true },
    ].sort((a, b) => b.xp - a.xp)
    return { rows: all, tier: TIERS[tierIndex] }
  }, [state.weekKey, state.weeklyXp, state.xp, state.name])

  const playerRank = rows.findIndex((r) => r.isPlayer) + 1

  return (
    <div className="leagues fade-in">
      <div className="league-banner" style={{ background: tier.color }}>
        <span className="league-emoji">{tier.emoji}</span>
        <div>
          <h2>Liga {tier.name}</h2>
          <p>Estás en el puesto #{playerRank} esta semana</p>
        </div>
      </div>

      <div className="league-legend">
        <span className="promo">⬆️ Top 3 ascienden</span>
        <span className="muted">Se reinicia cada lunes</span>
      </div>

      <div className="ranking">
        {rows.map((row, i) => {
          const rank = i + 1
          const zone = rank <= 3 ? 'promote' : rank >= rows.length - 2 ? 'demote' : ''
          return (
            <div
              key={row.name + i}
              className={`rank-row ${row.isPlayer ? 'me' : ''} ${zone}`}
            >
              <span className="rank-num">{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span>
              <span className="rank-avatar">{row.isPlayer ? '🦊' : '🧑'}</span>
              <span className="rank-name">{row.name}</span>
              <span className="rank-xp">{row.xp} XP</span>
            </div>
          )
        })}
      </div>

      {state.weeklyXp === 0 && (
        <p className="muted league-hint">¡Completa lecciones para ganar XP y subir en la liga! 🚀</p>
      )}
    </div>
  )
}
