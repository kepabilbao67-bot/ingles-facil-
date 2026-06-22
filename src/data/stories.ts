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
  {
    id: 's4',
    level: 'A2',
    title: 'At the Airport',
    emoji: '🛫',
    summary: 'Una pasajera hace el check-in para su vuelo.',
    lines: [
      { speaker: 'Agent', en: 'Good morning! Can I see your passport, please?', es: '¡Buenos días! ¿Me enseña su pasaporte, por favor?' },
      { speaker: 'Lucy', en: 'Here you are. I have a flight to Madrid.', es: 'Aquí tiene. Tengo un vuelo a Madrid.' },
      { speaker: 'Agent', en: 'Perfect. Do you have any bags to check in?', es: 'Perfecto. ¿Tiene maletas que facturar?' },
      { speaker: 'Lucy', en: 'Yes, just one suitcase.', es: 'Sí, solo una maleta.' },
      { speaker: 'Agent', en: 'Great. Here is your boarding pass. Gate 12.', es: 'Genial. Aquí tiene su tarjeta de embarque. Puerta 12.' },
      { speaker: 'Lucy', en: 'Thank you! What time does boarding start?', es: '¡Gracias! ¿A qué hora empieza el embarque?' },
    ],
    questions: [
      {
        question: '¿A dónde viaja Lucy?',
        options: ['Madrid', 'Barcelona', 'Roma', 'Lisboa'],
        answer: 'Madrid',
      },
      {
        question: '¿Cuántas maletas factura?',
        options: ['ninguna', 'una', 'dos', 'tres'],
        answer: 'una',
      },
      {
        question: '¿Cuál es su puerta de embarque?',
        options: ['Puerta 2', 'Puerta 12', 'Puerta 20', 'Puerta 21'],
        answer: 'Puerta 12',
      },
    ],
  },
  {
    id: 's5',
    level: 'B1',
    title: 'The Job Interview',
    emoji: '💼',
    summary: 'David tiene una entrevista de trabajo.',
    lines: [
      { speaker: 'Manager', en: 'Thanks for coming. Tell me about yourself.', es: 'Gracias por venir. Háblame de ti.' },
      { speaker: 'David', en: 'I am a graphic designer with five years of experience.', es: 'Soy diseñador gráfico con cinco años de experiencia.' },
      { speaker: 'Manager', en: 'Why do you want to work here?', es: '¿Por qué quieres trabajar aquí?' },
      { speaker: 'David', en: 'I admire your company and I want to grow with your team.', es: 'Admiro vuestra empresa y quiero crecer con vuestro equipo.' },
      { speaker: 'Manager', en: 'What are your strengths?', es: '¿Cuáles son tus puntos fuertes?' },
      { speaker: 'David', en: 'I am creative, organized, and I work well under pressure.', es: 'Soy creativo, organizado y trabajo bien bajo presión.' },
    ],
    questions: [
      {
        question: '¿Cuál es la profesión de David?',
        options: ['profesor', 'diseñador gráfico', 'médico', 'ingeniero'],
        answer: 'diseñador gráfico',
      },
      {
        question: '¿Cuántos años de experiencia tiene?',
        options: ['dos', 'tres', 'cinco', 'diez'],
        answer: 'cinco',
      },
      {
        question: '¿Cuál NO es un punto fuerte que menciona?',
        options: ['creativo', 'organizado', 'puntual', 'trabaja bajo presión'],
        answer: 'puntual',
      },
    ],
  },
  {
    id: 's6',
    level: 'A1',
    title: 'Shopping for Clothes',
    emoji: '👕',
    summary: 'Una clienta compra una camiseta en una tienda.',
    lines: [
      { speaker: 'Clerk', en: 'Hi! Can I help you?', es: '¡Hola! ¿Puedo ayudarte?' },
      { speaker: 'Sara', en: 'Yes, I like this t-shirt. How much is it?', es: 'Sí, me gusta esta camiseta. ¿Cuánto cuesta?' },
      { speaker: 'Clerk', en: "It's fifteen dollars.", es: 'Cuesta quince dólares.' },
      { speaker: 'Sara', en: 'Do you have it in blue?', es: '¿La tienes en azul?' },
      { speaker: 'Clerk', en: 'Yes, here you are. The fitting room is over there.', es: 'Sí, aquí tienes. El probador está allí.' },
      { speaker: 'Sara', en: 'Perfect, I will take it!', es: '¡Perfecto, me la llevo!' },
    ],
    questions: [
      {
        question: '¿Qué quiere comprar Sara?',
        options: ['unos zapatos', 'una camiseta', 'un abrigo', 'un sombrero'],
        answer: 'una camiseta',
      },
      {
        question: '¿Cuánto cuesta?',
        options: ['cinco dólares', 'quince dólares', 'cincuenta dólares', 'diez dólares'],
        answer: 'quince dólares',
      },
      {
        question: '¿De qué color la quiere?',
        options: ['rojo', 'verde', 'azul', 'negro'],
        answer: 'azul',
      },
    ],
  },
  {
    id: 's7',
    level: 'B2',
    title: 'A Job Well Done',
    emoji: '📊',
    summary: 'Una jefa felicita a su equipo tras un proyecto.',
    lines: [
      { speaker: 'Boss', en: 'I wanted to thank you all for your hard work.', es: 'Quería agradeceros a todos vuestro gran esfuerzo.' },
      { speaker: 'Mark', en: 'It was a real team effort.', es: 'Fue un verdadero trabajo en equipo.' },
      { speaker: 'Boss', en: 'We met the deadline despite the challenges.', es: 'Cumplimos el plazo a pesar de las dificultades.' },
      { speaker: 'Mark', en: 'Moreover, the client was extremely satisfied.', es: 'Además, el cliente quedó muy satisfecho.' },
      { speaker: 'Boss', en: "Exactly. Let's keep up this momentum next quarter.", es: 'Exacto. Mantengamos este ritmo el próximo trimestre.' },
    ],
    questions: [
      {
        question: '¿Por qué felicita la jefa al equipo?',
        options: ['por llegar tarde', 'por su gran esfuerzo', 'por irse pronto', 'por discutir'],
        answer: 'por su gran esfuerzo',
      },
      {
        question: '¿Cómo quedó el cliente?',
        options: ['enfadado', 'indiferente', 'muy satisfecho', 'confundido'],
        answer: 'muy satisfecho',
      },
    ],
  },
]
