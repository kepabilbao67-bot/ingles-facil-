import type { SRSCard, VocabItem } from './types'

// Implementacion del algoritmo SuperMemo-2 (SM-2) para repeticion espaciada.
// quality: 0-5 (calidad de la respuesta del usuario)
//   5 = perfecto, 3 = correcto con dificultad, <3 = fallo

const DAY = 24 * 60 * 60 * 1000

export function createCard(item: VocabItem): SRSCard {
  return {
    en: item.en,
    es: item.es,
    ipa: item.ipa,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    dueDate: Date.now(),
    lastReviewed: 0,
  }
}

export function reviewCard(card: SRSCard, quality: number): SRSCard {
  const next: SRSCard = { ...card }
  next.lastReviewed = Date.now()

  if (quality < 3) {
    // Fallo: reiniciar repeticiones, revisar de nuevo pronto
    next.repetitions = 0
    next.interval = 1
  } else {
    next.repetitions += 1
    if (next.repetitions === 1) {
      next.interval = 1
    } else if (next.repetitions === 2) {
      next.interval = 6
    } else {
      next.interval = Math.round(next.interval * next.easeFactor)
    }
    // Ajustar factor de facilidad
    next.easeFactor = Math.max(
      1.3,
      next.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )
  }

  next.dueDate = Date.now() + next.interval * DAY
  return next
}

export function getDueCards(srs: Record<string, SRSCard>): SRSCard[] {
  const now = Date.now()
  return Object.values(srs)
    .filter((c) => c.dueDate <= now)
    .sort((a, b) => a.dueDate - b.dueDate)
}

export function masteryLevel(card: SRSCard): 'new' | 'learning' | 'review' | 'mastered' {
  if (card.repetitions === 0) return 'new'
  if (card.repetitions < 2) return 'learning'
  if (card.interval >= 21) return 'mastered'
  return 'review'
}
