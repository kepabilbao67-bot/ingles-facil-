import { useState } from 'react'
import { useGame } from '../context/GameContext'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function StreakCalendar() {
  const { state } = useGame()
  const active = new Set(state.activeDays)
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const firstDay = new Date(view.year, view.month, 1)
  // lunes = 0
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function shift(delta: number) {
    let m = view.month + delta
    let y = view.year
    if (m < 0) {
      m = 11
      y--
    } else if (m > 11) {
      m = 0
      y++
    }
    setView({ year: y, month: m })
  }

  const activeThisMonth = cells.filter(
    (d) => d && active.has(dateKey(view.year, view.month, d))
  ).length

  return (
    <div className="streak-cal">
      <div className="sc-header">
        <button className="sc-nav" onClick={() => shift(-1)}>
          ‹
        </button>
        <span className="sc-month">
          {MONTHS[view.month]} {view.year}
        </span>
        <button className="sc-nav" onClick={() => shift(1)}>
          ›
        </button>
      </div>
      <div className="sc-weekdays">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="sc-wd">
            {w}
          </span>
        ))}
      </div>
      <div className="sc-grid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="sc-cell empty" />
          const key = dateKey(view.year, view.month, d)
          const isActive = active.has(key)
          const isToday = key === todayKey
          return (
            <span key={i} className={`sc-cell ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}>
              {isActive ? '🔥' : d}
            </span>
          )
        })}
      </div>
      <p className="sc-summary muted">
        {activeThisMonth} {activeThisMonth === 1 ? 'día activo' : 'días activos'} este mes
      </p>
    </div>
  )
}
