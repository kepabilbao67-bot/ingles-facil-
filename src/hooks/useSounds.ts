// Sound effects using Web Audio API (no external files needed)
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export function playCorrect() {
  playTone(523.25, 0.1, 'sine', 0.25) // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.25), 80) // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.3), 160) // G5
}

export function playWrong() {
  playTone(200, 0.15, 'sawtooth', 0.2)
  setTimeout(() => playTone(180, 0.2, 'sawtooth', 0.15), 100)
}

export function playComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.25), i * 120)
  })
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.1)
}

export function playStreak() {
  const notes = [440, 554.37, 659.25, 880] // A4, C#5, E5, A5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'triangle', 0.2), i * 100)
  })
}

export function playLevelUp() {
  const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 100)
  })
}
