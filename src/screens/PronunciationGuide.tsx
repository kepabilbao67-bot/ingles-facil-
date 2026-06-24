import { useState } from 'react'
import { speak } from '../hooks/useSpeech'

interface SoundPair {
  symbol: string
  example: string
  word: string
  tip: string
}

const CONSONANTS: SoundPair[] = [
  { symbol: '/θ/', example: 'think', word: 'think, three, math', tip: 'Pon la lengua entre los dientes y sopla' },
  { symbol: '/ð/', example: 'this', word: 'this, that, mother', tip: 'Como /θ/ pero con vibración' },
  { symbol: '/ʃ/', example: 'she', word: 'she, ship, nation', tip: 'Como "shhh" para pedir silencio' },
  { symbol: '/ʒ/', example: 'measure', word: 'measure, vision, garage', tip: 'Como /ʃ/ pero con vibración' },
  { symbol: '/tʃ/', example: 'church', word: 'church, watch, nature', tip: 'Como "ch" en español pero más fuerte' },
  { symbol: '/dʒ/', example: 'judge', word: 'judge, age, bridge', tip: 'Como /tʃ/ pero con vibración' },
  { symbol: '/r/', example: 'red', word: 'red, very, car', tip: 'No toques el paladar con la lengua (diferente al español)' },
  { symbol: '/w/', example: 'we', word: 'we, water, away', tip: 'Redondea los labios como si fueras a silbar' },
  { symbol: '/ŋ/', example: 'sing', word: 'sing, king, long', tip: 'La "ng" suena por la nariz, sin la "g" final' },
  { symbol: '/h/', example: 'hello', word: 'hello, happy, behind', tip: 'Una aspiración suave, como empañar un cristal' },
]

const VOWELS: SoundPair[] = [
  { symbol: '/iː/', example: 'see', word: 'see, tree, beach', tip: 'Estira los labios, sonido largo' },
  { symbol: '/ɪ/', example: 'sit', word: 'sit, big, fish', tip: 'Más corta y relajada que /iː/' },
  { symbol: '/æ/', example: 'cat', word: 'cat, hat, bad', tip: 'Abre mucho la boca, entre "a" y "e"' },
  { symbol: '/ʌ/', example: 'cup', word: 'cup, but, love', tip: 'Sonido corto y central, boca relajada' },
  { symbol: '/ɑː/', example: 'car', word: 'car, father, heart', tip: 'Abre bien la boca, sonido largo' },
  { symbol: '/ɔː/', example: 'door', word: 'door, four, more', tip: 'Redondea los labios, sonido largo' },
  { symbol: '/ʊ/', example: 'book', word: 'book, good, put', tip: 'Labios redondeados, corta' },
  { symbol: '/uː/', example: 'too', word: 'too, blue, food', tip: 'Como /ʊ/ pero más larga y tensa' },
  { symbol: '/ə/', example: 'about', word: 'about, banana, sofa', tip: 'Schwa: el sonido más común del inglés, muy relajado' },
  { symbol: '/ɜː/', example: 'bird', word: 'bird, word, nurse', tip: 'Labios neutros, lengua centrada, sonido largo' },
]

const DIPHTHONGS: SoundPair[] = [
  { symbol: '/eɪ/', example: 'day', word: 'day, make, rain', tip: 'Empieza en "e" y desliza hacia "i"' },
  { symbol: '/aɪ/', example: 'my', word: 'my, time, like', tip: 'Empieza en "a" abierta y desliza a "i"' },
  { symbol: '/ɔɪ/', example: 'boy', word: 'boy, coin, enjoy', tip: 'Empieza en "o" y desliza a "i"' },
  { symbol: '/aʊ/', example: 'how', word: 'how, out, town', tip: 'Empieza en "a" y desliza a "u"' },
  { symbol: '/əʊ/', example: 'go', word: 'go, home, phone', tip: 'Empieza en schwa y desliza a "u"' },
  { symbol: '/ɪə/', example: 'ear', word: 'ear, near, here', tip: 'De "i" corta a schwa' },
  { symbol: '/eə/', example: 'air', word: 'air, care, there', tip: 'De "e" a schwa' },
  { symbol: '/ʊə/', example: 'tour', word: 'tour, sure, pure', tip: 'De "u" corta a schwa' },
]

export default function PronunciationGuide() {
  const [tab, setTab] = useState<'consonants' | 'vowels' | 'diphthongs'>('vowels')

  const data = tab === 'consonants' ? CONSONANTS : tab === 'vowels' ? VOWELS : DIPHTHONGS

  return (
    <div className="pronunciation fade-in">
      <h2>🗣️ Guía de Pronunciación</h2>
      <p className="muted">Toca cada sonido para escucharlo</p>

      <div className="pron-tabs">
        <button className={`pron-tab ${tab === 'vowels' ? 'active' : ''}`} onClick={() => setTab('vowels')}>
          Vocales
        </button>
        <button className={`pron-tab ${tab === 'consonants' ? 'active' : ''}`} onClick={() => setTab('consonants')}>
          Consonantes
        </button>
        <button className={`pron-tab ${tab === 'diphthongs' ? 'active' : ''}`} onClick={() => setTab('diphthongs')}>
          Diptongos
        </button>
      </div>

      <div className="pron-grid">
        {data.map((sound) => (
          <button
            key={sound.symbol}
            className="pron-card"
            onClick={() => speak(sound.example, 'en-US', 0.7)}
          >
            <span className="pron-symbol">{sound.symbol}</span>
            <span className="pron-example">"{sound.example}"</span>
            <span className="pron-words">{sound.word}</span>
            <span className="pron-tip">💡 {sound.tip}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
