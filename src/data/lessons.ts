import type { Unit } from '../types'

// Contenido pedagogico de ejemplo (A1-A2). Facilmente ampliable.
export const UNITS: Unit[] = [
  {
    id: 'u1',
    level: 'A1',
    title: 'Saludos y Basico',
    description: 'Aprende a saludar y presentarte',
    color: '#58cc02',
    lessons: [
      {
        id: 'u1l1',
        unitId: 'u1',
        title: 'Saludos',
        icon: '👋',
        vocab: [
          { en: 'hello', es: 'hola', ipa: '/həˈloʊ/' },
          { en: 'goodbye', es: 'adiós', ipa: '/ˌɡʊdˈbaɪ/' },
          { en: 'good morning', es: 'buenos días', ipa: '/ɡʊd ˈmɔːrnɪŋ/' },
          { en: 'thank you', es: 'gracias', ipa: '/ˈθæŋk juː/' },
          { en: 'please', es: 'por favor', ipa: '/pliːz/' },
        ],
        exercises: [
          {
            id: 'e1',
            type: 'multipleChoice',
            prompt: 'Selecciona la traducción correcta',
            question: 'hello',
            audioText: 'hello',
            options: ['adiós', 'hola', 'gracias', 'por favor'],
            answer: 'hola',
          },
          {
            id: 'e2',
            type: 'listen',
            prompt: 'Escucha y selecciona lo que oíste',
            audioText: 'thank you',
            options: ['thank you', 'good morning', 'goodbye', 'please'],
            answer: 'thank you',
          },
          {
            id: 'e3',
            type: 'translate',
            prompt: 'Traduce esta frase',
            sourceText: 'Buenos días',
            audioText: 'good morning',
            wordBank: ['good', 'morning', 'night', 'hello'],
            answerWords: ['good', 'morning'],
          },
          {
            id: 'e4',
            type: 'speak',
            prompt: 'Pronuncia esta palabra',
            audioText: 'thank you',
            translation: 'gracias',
          },
          {
            id: 'e5',
            type: 'match',
            prompt: 'Empareja las palabras',
            pairs: [
              { en: 'hello', es: 'hola' },
              { en: 'goodbye', es: 'adiós' },
              { en: 'please', es: 'por favor' },
              { en: 'thank you', es: 'gracias' },
            ],
          },
        ],
      },
      {
        id: 'u1l2',
        unitId: 'u1',
        title: 'Presentarse',
        icon: '🙋',
        vocab: [
          { en: 'my name is', es: 'mi nombre es', ipa: '/maɪ neɪm ɪz/' },
          { en: 'nice to meet you', es: 'encantado de conocerte' },
          { en: 'how are you?', es: '¿cómo estás?' },
          { en: 'I am fine', es: 'estoy bien' },
          { en: 'and you?', es: '¿y tú?' },
        ],
        exercises: [
          {
            id: 'e1',
            type: 'multipleChoice',
            prompt: 'Selecciona la traducción correcta',
            question: 'how are you?',
            audioText: 'how are you',
            options: ['¿cómo estás?', '¿quién eres?', '¿dónde vives?', '¿qué hora es?'],
            answer: '¿cómo estás?',
          },
          {
            id: 'e2',
            type: 'fillBlank',
            prompt: 'Completa la oración',
            sentence: 'My ___ is Anna.',
            audioText: 'My name is Anna',
            options: ['name', 'dog', 'house', 'food'],
            answer: 'name',
            translation: 'Mi nombre es Anna.',
          },
          {
            id: 'e3',
            type: 'translate',
            prompt: 'Traduce esta frase',
            sourceText: 'Estoy bien',
            audioText: 'I am fine',
            wordBank: ['I', 'am', 'fine', 'you', 'are'],
            answerWords: ['I', 'am', 'fine'],
          },
          {
            id: 'e4',
            type: 'speak',
            prompt: 'Pronuncia esta frase',
            audioText: 'nice to meet you',
            translation: 'encantado de conocerte',
          },
        ],
      },
    ],
  },
  {
    id: 'u2',
    level: 'A1',
    title: 'Familia y Personas',
    description: 'Vocabulario de la familia',
    color: '#1cb0f6',
    lessons: [
      {
        id: 'u2l1',
        unitId: 'u2',
        title: 'La Familia',
        icon: '👨‍👩‍👧',
        vocab: [
          { en: 'mother', es: 'madre', ipa: '/ˈmʌðər/' },
          { en: 'father', es: 'padre', ipa: '/ˈfɑːðər/' },
          { en: 'sister', es: 'hermana', ipa: '/ˈsɪstər/' },
          { en: 'brother', es: 'hermano', ipa: '/ˈbrʌðər/' },
          { en: 'child', es: 'niño/a', ipa: '/tʃaɪld/' },
        ],
        exercises: [
          {
            id: 'e1',
            type: 'multipleChoice',
            prompt: 'Selecciona la traducción correcta',
            question: 'mother',
            audioText: 'mother',
            options: ['padre', 'madre', 'hermana', 'hijo'],
            answer: 'madre',
          },
          {
            id: 'e2',
            type: 'listen',
            prompt: 'Escucha y selecciona lo que oíste',
            audioText: 'brother',
            options: ['brother', 'mother', 'father', 'sister'],
            answer: 'brother',
          },
          {
            id: 'e3',
            type: 'match',
            prompt: 'Empareja las palabras',
            pairs: [
              { en: 'mother', es: 'madre' },
              { en: 'father', es: 'padre' },
              { en: 'sister', es: 'hermana' },
              { en: 'brother', es: 'hermano' },
            ],
          },
          {
            id: 'e4',
            type: 'translate',
            prompt: 'Traduce esta frase',
            sourceText: 'Mi hermana',
            audioText: 'my sister',
            wordBank: ['my', 'sister', 'brother', 'your'],
            answerWords: ['my', 'sister'],
          },
        ],
      },
    ],
  },
  {
    id: 'u3',
    level: 'A2',
    title: 'Comida y Restaurante',
    description: 'Pide comida como un nativo',
    color: '#ff9600',
    lessons: [
      {
        id: 'u3l1',
        unitId: 'u3',
        title: 'En el Restaurante',
        icon: '🍽️',
        vocab: [
          { en: 'water', es: 'agua', ipa: '/ˈwɔːtər/' },
          { en: 'the bill', es: 'la cuenta', ipa: '/ðə bɪl/' },
          { en: 'menu', es: 'menú', ipa: '/ˈmenjuː/' },
          { en: "I would like", es: 'me gustaría', ipa: '/aɪ wʊd laɪk/' },
          { en: 'delicious', es: 'delicioso', ipa: '/dɪˈlɪʃəs/' },
        ],
        exercises: [
          {
            id: 'e1',
            type: 'fillBlank',
            prompt: 'Completa la oración',
            sentence: 'Can I have the ___, please?',
            audioText: 'Can I have the bill please',
            options: ['bill', 'car', 'book', 'phone'],
            answer: 'bill',
            translation: '¿Me trae la cuenta, por favor?',
          },
          {
            id: 'e2',
            type: 'translate',
            prompt: 'Traduce esta frase',
            sourceText: 'Me gustaría agua',
            audioText: 'I would like water',
            wordBank: ['I', 'would', 'like', 'water', 'food', 'want'],
            answerWords: ['I', 'would', 'like', 'water'],
          },
          {
            id: 'e3',
            type: 'speak',
            prompt: 'Pronuncia esta frase',
            audioText: 'The food is delicious',
            translation: 'La comida está deliciosa',
          },
          {
            id: 'e4',
            type: 'multipleChoice',
            prompt: 'Selecciona la traducción correcta',
            question: 'menu',
            audioText: 'menu',
            options: ['cuenta', 'menú', 'mesa', 'plato'],
            answer: 'menú',
          },
        ],
      },
    ],
  },
]

export function getLessonById(id: string) {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === id)
    if (lesson) return { lesson, unit }
  }
  return null
}

export function allLessonsFlat() {
  return UNITS.flatMap((u) => u.lessons.map((l) => ({ lesson: l, unit: u })))
}
