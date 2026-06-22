import type { Story } from '../types'

// Historias graduadas por nivel para practicar lectura y comprension.
export const STORIES: Story[] = [
  {
    id: 's1',
    level: 'A1',
    title: 'A New Friend',
    emoji: '🤝',
    summary: 'Dos personas se conocen en una cafetería.',
    lines: [
      { speaker: 'Tom', en: 'Hello! My name is Tom.', es: '¡Hola! Mi nombre es Tom.' },
      { speaker: 'Ana', en: 'Hi Tom! I am Ana. Nice to meet you.', es: 'Hola Tom. Soy Ana. Encantada de conocerte.' },
      { speaker: 'Tom', en: 'Nice to meet you too. How are you?', es: 'Encantado yo también. ¿Cómo estás?' },
      { speaker: 'Ana', en: 'I am fine, thank you. And you?', es: 'Estoy bien, gracias. ¿Y tú?' },
      { speaker: 'Tom', en: 'I am great! Do you want a coffee?', es: '¡Estoy genial! ¿Quieres un café?' },
      { speaker: 'Ana', en: 'Yes, please. Thank you!', es: 'Sí, por favor. ¡Gracias!' },
    ],
    questions: [
      {
        question: '¿Cómo se llama la chica?',
        options: ['Ana', 'Tom', 'Sara', 'Lucy'],
        answer: 'Ana',
      },
      {
        question: '¿Qué ofrece Tom a Ana?',
        options: ['un té', 'un café', 'agua', 'un libro'],
        answer: 'un café',
      },
    ],
  },
  {
    id: 's2',
    level: 'A2',
    title: 'At the Restaurant',
    emoji: '🍝',
    summary: 'Una clienta pide la cena en un restaurante.',
    lines: [
      { speaker: 'Waiter', en: 'Good evening! Are you ready to order?', es: '¡Buenas noches! ¿Está lista para pedir?' },
      { speaker: 'Maria', en: "Yes, I would like the pasta, please.", es: 'Sí, me gustaría la pasta, por favor.' },
      { speaker: 'Waiter', en: 'Great choice. Anything to drink?', es: 'Excelente elección. ¿Algo de beber?' },
      { speaker: 'Maria', en: 'A glass of water, please.', es: 'Un vaso de agua, por favor.' },
      { speaker: 'Waiter', en: 'Of course. The food will be ready soon.', es: 'Por supuesto. La comida estará lista pronto.' },
      { speaker: 'Maria', en: 'Thank you. Can I have the bill later?', es: 'Gracias. ¿Me trae la cuenta después?' },
    ],
    questions: [
      {
        question: '¿Qué pidió María de comer?',
        options: ['pizza', 'pasta', 'ensalada', 'sopa'],
        answer: 'pasta',
      },
      {
        question: '¿Qué pidió para beber?',
        options: ['vino', 'agua', 'café', 'zumo'],
        answer: 'agua',
      },
    ],
  },
  {
    id: 's3',
    level: 'B1',
    title: 'A Trip to London',
    emoji: '🏰',
    summary: 'Jack le cuenta a Emma su viaje a Londres.',
    lines: [
      { speaker: 'Emma', en: 'Hi Jack! How was your weekend?', es: 'Hola Jack. ¿Qué tal tu fin de semana?' },
      { speaker: 'Jack', en: 'Amazing! I traveled to London with my family.', es: '¡Increíble! Viajé a Londres con mi familia.' },
      { speaker: 'Emma', en: 'Wow! What did you do there?', es: '¡Vaya! ¿Qué hicisteis allí?' },
      { speaker: 'Jack', en: 'We visited Big Ben and took a boat on the river.', es: 'Visitamos el Big Ben y dimos un paseo en barco por el río.' },
      { speaker: 'Emma', en: 'That sounds fantastic. Was the weather good?', es: 'Suena fantástico. ¿Hizo buen tiempo?' },
      { speaker: 'Jack', en: 'It rained a lot, but we still had a great time!', es: 'Llovió mucho, ¡pero aún así lo pasamos genial!' },
    ],
    questions: [
      {
        question: '¿A dónde viajó Jack?',
        options: ['París', 'Londres', 'Nueva York', 'Roma'],
        answer: 'Londres',
      },
      {
        question: '¿Cómo estuvo el tiempo?',
        options: ['soleado', 'nevado', 'llovió mucho', 'con viento'],
        answer: 'llovió mucho',
      },
      {
        question: '¿Qué hicieron en el río?',
        options: ['nadar', 'pescar', 'pasear en barco', 'correr'],
        answer: 'pasear en barco',
      },
    ],
  },
]
