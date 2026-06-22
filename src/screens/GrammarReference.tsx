import { useState } from 'react'
import { UNITS } from '../data/lessons'
import { speak } from '../hooks/useSpeech'
import type { GrammarTip, CEFRLevel } from '../types'

interface Props {
  onExit: () => void
}

interface TipEntry {
  level: CEFRLevel
  tip: GrammarTip
}

// Recopila todas las notas de gramática de las lecciones
function collectTips(): TipEntry[] {
  const tips: TipEntry[] = []
  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      if (lesson.grammarTip) tips.push({ level: unit.level, tip: lesson.grammarTip })
    }
  }
  return tips
}

export default function GrammarReference({ onExit }: Props) {
  const tips = collectTips()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="app">
      <header className="topbar">
        <button className="link-btn" onClick={onExit}>
          ← Volver
        </button>
        <div className="tb-brand">📘 Gramática</div>
        <span style={{ width: 60 }} />
      </header>
      <main className="content">
        <div className="grammar-ref">
          <p className="muted section-sub">Repasa todas las reglas que has visto.</p>
          {tips.map((entry, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={`gr-card ${isOpen ? 'open' : ''}`}>
                <button className="gr-head" onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="gr-level">{entry.level}</span>
                  <span className="gr-title">{entry.tip.title}</span>
                  <span className="gr-chevron">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div className="gr-body">
                    <p className="gr-exp">{entry.tip.explanation}</p>
                    <div className="gr-examples">
                      {entry.tip.examples.map((ex, j) => (
                        <button key={j} className="gr-example" onClick={() => speak(ex.en)}>
                          <span className="ge-en">
                            {ex.en} <span className="ge-spk">🔊</span>
                          </span>
                          <span className="ge-es">{ex.es}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
