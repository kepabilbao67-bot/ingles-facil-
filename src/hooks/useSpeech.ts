import { useCallback, useEffect, useRef, useState } from 'react'

// ---- Texto a voz (listening) ----
export function speak(text: string, lang = 'en-US', rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  utter.rate = rate
  // Intenta elegir una voz en ingles
  const voices = window.speechSynthesis.getVoices()
  const enVoice = voices.find((v) => v.lang.startsWith('en'))
  if (enVoice) utter.voice = enVoice
  window.speechSynthesis.speak(utter)
}

export function useTTS() {
  useEffect(() => {
    // Forzar carga de voces
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
    }
  }, [])
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  return { speak, supported }
}

// ---- Reconocimiento de voz (speaking) ----
type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

export interface SpeechResult {
  transcript: string
  score: number // 0-100 similitud
}

function getRecognition(): SpeechRecognitionLike | null {
  const w = window as any
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition
  if (!SR) return null
  return new SR()
}

// Similitud simple basada en palabras coincidentes + distancia
function similarity(target: string, said: string): number {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean)
  const a = norm(target)
  const b = norm(said)
  if (a.length === 0) return 0
  let matches = 0
  const used = new Array(b.length).fill(false)
  for (const word of a) {
    const idx = b.findIndex((w, i) => !used[i] && w === word)
    if (idx >= 0) {
      matches++
      used[idx] = true
    }
  }
  return Math.round((matches / a.length) * 100)
}

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(() => {
    const rec = getRecognition()
    setSupported(!!rec)
  }, [])

  const listen = useCallback((target: string): Promise<SpeechResult> => {
    return new Promise((resolve, reject) => {
      const rec = getRecognition()
      if (!rec) {
        reject(new Error('Reconocimiento de voz no soportado'))
        return
      }
      recRef.current = rec
      rec.lang = 'en-US'
      rec.continuous = false
      rec.interimResults = false
      setListening(true)

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript as string
        resolve({ transcript, score: similarity(target, transcript) })
      }
      rec.onerror = (e: any) => {
        reject(new Error(e.error || 'error'))
      }
      rec.onend = () => {
        setListening(false)
      }
      try {
        rec.start()
      } catch (err) {
        reject(err as Error)
      }
    })
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  return { listen, stop, listening, supported }
}
