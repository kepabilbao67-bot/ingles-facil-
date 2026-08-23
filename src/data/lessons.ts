import type { LanguageCode, Lesson } from '@/types/learning';

const ENGLISH_LESSONS: readonly Lesson[] = [
  {
    id: 'basico-1',
    title: 'Básico 1',
    description: 'Saludos y expresiones esenciales',
    language: 'en',
    words: [
      { id: 'hello', source: 'hello', translation: 'hola' },
      { id: 'goodbye', source: 'goodbye', translation: 'adiós' },
      { id: 'please', source: 'please', translation: 'por favor' },
      { id: 'thank-you', source: 'thank you', translation: 'gracias' },
      { id: 'yes', source: 'yes', translation: 'sí' },
      { id: 'no', source: 'no', translation: 'no' },
    ],
  },
  {
    id: 'basico-2',
    title: 'Básico 2',
    description: 'Objetos y palabras cotidianas',
    language: 'en',
    words: [
      { id: 'water', source: 'water', translation: 'agua' },
      { id: 'bread', source: 'bread', translation: 'pan' },
      { id: 'house', source: 'house', translation: 'casa' },
      { id: 'dog', source: 'dog', translation: 'perro' },
      { id: 'cat', source: 'cat', translation: 'gato' },
      { id: 'book', source: 'book', translation: 'libro' },
    ],
  },
  {
    id: 'viajes',
    title: 'Viajes',
    description: 'Vocabulario para moverte por el mundo',
    language: 'en',
    words: [
      { id: 'airport', source: 'airport', translation: 'aeropuerto' },
      { id: 'ticket', source: 'ticket', translation: 'billete' },
      { id: 'train', source: 'train', translation: 'tren' },
      { id: 'beach', source: 'beach', translation: 'playa' },
      { id: 'map', source: 'map', translation: 'mapa' },
      { id: 'suitcase', source: 'suitcase', translation: 'maleta' },
    ],
  },
  { id: 'familia', title: 'Familia', description: 'Habla de las personas cercanas', language: 'en', words: [{id:'mother',source:'mother',translation:'madre'},{id:'father',source:'father',translation:'padre'},{id:'sister',source:'sister',translation:'hermana'},{id:'brother',source:'brother',translation:'hermano'},{id:'family',source:'family',translation:'familia'},{id:'child',source:'child',translation:'niño o niña'}] },
  { id: 'comida', title: 'Comida', description: 'Pide y comprende lo esencial', language: 'en', words: [{id:'breakfast',source:'breakfast',translation:'desayuno'},{id:'lunch',source:'lunch',translation:'almuerzo'},{id:'dinner',source:'dinner',translation:'cena'},{id:'restaurant',source:'restaurant',translation:'restaurante'},{id:'coffee',source:'coffee',translation:'café'},{id:'menu',source:'menu',translation:'menú'}] },
  { id: 'ciudad', title: 'La ciudad', description: 'Lugares útiles y orientación', language: 'en', words: [{id:'street',source:'street',translation:'calle'},{id:'square',source:'square',translation:'plaza'},{id:'station',source:'station',translation:'estación'},{id:'hotel',source:'hotel',translation:'hotel'},{id:'hospital',source:'hospital',translation:'hospital'},{id:'pharmacy',source:'pharmacy',translation:'farmacia'}] },
  { id: 'tiempo', title: 'El tiempo', description: 'Organiza momentos del día', language: 'en', words: [{id:'today',source:'today',translation:'hoy'},{id:'tomorrow',source:'tomorrow',translation:'mañana'},{id:'yesterday',source:'yesterday',translation:'ayer'},{id:'morning',source:'morning',translation:'mañana (parte del día)'},{id:'afternoon',source:'afternoon',translation:'tarde'},{id:'night',source:'night',translation:'noche'}] },
  { id: 'estudio', title: 'Estudio y trabajo', description: 'Vocabulario para aprender y trabajar', language: 'en', words: [{id:'teacher',source:'teacher',translation:'profesor o profesora'},{id:'student',source:'student',translation:'estudiante'},{id:'school',source:'school',translation:'escuela'},{id:'work',source:'work',translation:'trabajo'},{id:'office',source:'office',translation:'oficina'},{id:'computer',source:'computer',translation:'ordenador'}] },
] as const;

const FRENCH_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Bases 1', description: 'Saludos y expresiones esenciales', language: 'fr', words: [{ id:'bonjour',source:'bonjour',translation:'hola'},{id:'aurevoir',source:'au revoir',translation:'adiós'},{id:'silvousplait',source:"s'il vous plaît",translation:'por favor'},{id:'merci',source:'merci',translation:'gracias'},{id:'oui',source:'oui',translation:'sí'},{id:'non',source:'non',translation:'no'}] },
  { id: 'basico-2', title: 'Bases 2', description: 'Objetos y palabras cotidianas', language: 'fr', words: [{id:'eau',source:'eau',translation:'agua'},{id:'pain',source:'pain',translation:'pan'},{id:'maison',source:'maison',translation:'casa'},{id:'chien',source:'chien',translation:'perro'},{id:'chat',source:'chat',translation:'gato'},{id:'livre',source:'livre',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'fr', words: [{id:'aeroport',source:'aéroport',translation:'aeropuerto'},{id:'billet',source:'billet',translation:'billete'},{id:'train',source:'train',translation:'tren'},{id:'plage',source:'plage',translation:'playa'},{id:'carte',source:'carte',translation:'mapa'},{id:'valise',source:'valise',translation:'maleta'}] },
  { id: 'familia', title: 'Familia', description: 'Habla de las personas cercanas', language: 'fr', words: [{id:'mere',source:'mère',translation:'madre'},{id:'pere',source:'père',translation:'padre'},{id:'soeur',source:'sœur',translation:'hermana'},{id:'frere',source:'frère',translation:'hermano'},{id:'famille',source:'famille',translation:'familia'},{id:'enfant',source:'enfant',translation:'niño o niña'}] },
  { id: 'comida', title: 'Comida', description: 'Pide y comprende lo esencial', language: 'fr', words: [{id:'petitdejeuner',source:'petit-déjeuner',translation:'desayuno'},{id:'dejeuner',source:'déjeuner',translation:'almuerzo'},{id:'diner',source:'dîner',translation:'cena'},{id:'restaurant',source:'restaurant',translation:'restaurante'},{id:'cafe',source:'café',translation:'café'},{id:'menu',source:'menu',translation:'menú'}] },
  { id: 'ciudad', title: 'La ciudad', description: 'Lugares útiles y orientación', language: 'fr', words: [{id:'rue',source:'rue',translation:'calle'},{id:'place',source:'place',translation:'plaza'},{id:'gare',source:'gare',translation:'estación'},{id:'hotel',source:'hôtel',translation:'hotel'},{id:'hopital',source:'hôpital',translation:'hospital'},{id:'pharmacie',source:'pharmacie',translation:'farmacia'}] },
  { id: 'tiempo', title: 'El tiempo', description: 'Organiza momentos del día', language: 'fr', words: [{id:'aujourdhui',source:"aujourd'hui",translation:'hoy'},{id:'demain',source:'demain',translation:'mañana'},{id:'hier',source:'hier',translation:'ayer'},{id:'matin',source:'matin',translation:'mañana (parte del día)'},{id:'apresmidi',source:'après-midi',translation:'tarde'},{id:'nuit',source:'nuit',translation:'noche'}] },
  { id: 'estudio', title: 'Estudio y trabajo', description: 'Vocabulario para aprender y trabajar', language: 'fr', words: [{id:'professeur',source:'professeur',translation:'profesor o profesora'},{id:'eleve',source:'élève',translation:'estudiante'},{id:'ecole',source:'école',translation:'escuela'},{id:'travail',source:'travail',translation:'trabajo'},{id:'bureau',source:'bureau',translation:'oficina'},{id:'ordinateur',source:'ordinateur',translation:'ordenador'}] },
] as const;

const ITALIAN_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Básico 1', description: 'Saludos y expresiones esenciales', language: 'it', words: [{ id:'ciao',source:'ciao',translation:'hola'},{id:'arrivederci',source:'arrivederci',translation:'adiós'},{id:'perfavore',source:'per favore',translation:'por favor'},{id:'grazie',source:'grazie',translation:'gracias'},{id:'si',source:'sì',translation:'sí'},{id:'no',source:'no',translation:'no'}] },
  { id: 'basico-2', title: 'Básico 2', description: 'Objetos y palabras cotidianas', language: 'it', words: [{id:'acqua',source:'acqua',translation:'agua'},{id:'pane',source:'pane',translation:'pan'},{id:'casa',source:'casa',translation:'casa'},{id:'cane',source:'cane',translation:'perro'},{id:'gatto',source:'gatto',translation:'gato'},{id:'libro',source:'libro',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'it', words: [{id:'aeroporto',source:'aeroporto',translation:'aeropuerto'},{id:'biglietto',source:'biglietto',translation:'billete'},{id:'treno',source:'treno',translation:'tren'},{id:'spiaggia',source:'spiaggia',translation:'playa'},{id:'mappa',source:'mappa',translation:'mapa'},{id:'valigia',source:'valigia',translation:'maleta'}] },
  { id: 'familia', title: 'Familia', description: 'Habla de las personas cercanas', language: 'it', words: [{id:'madre',source:'madre',translation:'madre'},{id:'padre',source:'padre',translation:'padre'},{id:'sorella',source:'sorella',translation:'hermana'},{id:'fratello',source:'fratello',translation:'hermano'},{id:'famiglia',source:'famiglia',translation:'familia'},{id:'bambino',source:'bambino',translation:'niño'}] },
  { id: 'comida', title: 'Comida', description: 'Pide y comprende lo esencial', language: 'it', words: [{id:'colazione',source:'colazione',translation:'desayuno'},{id:'pranzo',source:'pranzo',translation:'almuerzo'},{id:'cena',source:'cena',translation:'cena'},{id:'ristorante',source:'ristorante',translation:'restaurante'},{id:'caffe',source:'caffè',translation:'café'},{id:'menu',source:'menù',translation:'menú'}] },
  { id: 'ciudad', title: 'La ciudad', description: 'Lugares útiles y orientación', language: 'it', words: [{id:'strada',source:'strada',translation:'calle'},{id:'piazza',source:'piazza',translation:'plaza'},{id:'stazione',source:'stazione',translation:'estación'},{id:'albergo',source:'albergo',translation:'hotel'},{id:'ospedale',source:'ospedale',translation:'hospital'},{id:'farmacia',source:'farmacia',translation:'farmacia'}] },
  { id: 'tiempo', title: 'El tiempo', description: 'Organiza momentos del día', language: 'it', words: [{id:'oggi',source:'oggi',translation:'hoy'},{id:'domani',source:'domani',translation:'mañana'},{id:'ieri',source:'ieri',translation:'ayer'},{id:'mattina',source:'mattina',translation:'mañana (parte del día)'},{id:'pomeriggio',source:'pomeriggio',translation:'tarde'},{id:'notte',source:'notte',translation:'noche'}] },
  { id: 'estudio', title: 'Estudio y trabajo', description: 'Vocabulario para aprender y trabajar', language: 'it', words: [{id:'insegnante',source:'insegnante',translation:'profesor o profesora'},{id:'studente',source:'studente',translation:'estudiante'},{id:'scuola',source:'scuola',translation:'escuela'},{id:'lavoro',source:'lavoro',translation:'trabajo'},{id:'ufficio',source:'ufficio',translation:'oficina'},{id:'computer',source:'computer',translation:'ordenador'}] },
] as const;

const GERMAN_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Básico 1', description: 'Saludos y expresiones esenciales', language: 'de', words: [{ id:'hallo',source:'hallo',translation:'hola'},{id:'aufwiedersehen',source:'auf Wiedersehen',translation:'adiós'},{id:'bitte',source:'bitte',translation:'por favor'},{id:'danke',source:'danke',translation:'gracias'},{id:'ja',source:'ja',translation:'sí'},{id:'nein',source:'nein',translation:'no'}] },
  { id: 'basico-2', title: 'Básico 2', description: 'Objetos y palabras cotidianas', language: 'de', words: [{id:'wasser',source:'Wasser',translation:'agua'},{id:'brot',source:'Brot',translation:'pan'},{id:'haus',source:'Haus',translation:'casa'},{id:'hund',source:'Hund',translation:'perro'},{id:'katze',source:'Katze',translation:'gato'},{id:'buch',source:'Buch',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'de', words: [{id:'flughafen',source:'Flughafen',translation:'aeropuerto'},{id:'fahrkarte',source:'Fahrkarte',translation:'billete'},{id:'zug',source:'Zug',translation:'tren'},{id:'strand',source:'Strand',translation:'playa'},{id:'karte',source:'Karte',translation:'mapa'},{id:'koffer',source:'Koffer',translation:'maleta'}] },
  { id: 'familia', title: 'Familia', description: 'Habla de las personas cercanas', language: 'de', words: [{id:'mutter',source:'Mutter',translation:'madre'},{id:'vater',source:'Vater',translation:'padre'},{id:'schwester',source:'Schwester',translation:'hermana'},{id:'bruder',source:'Bruder',translation:'hermano'},{id:'familie',source:'Familie',translation:'familia'},{id:'kind',source:'Kind',translation:'niño o niña'}] },
  { id: 'comida', title: 'Comida', description: 'Pide y comprende lo esencial', language: 'de', words: [{id:'fruehstueck',source:'Frühstück',translation:'desayuno'},{id:'mittagessen',source:'Mittagessen',translation:'almuerzo'},{id:'abendessen',source:'Abendessen',translation:'cena'},{id:'restaurant',source:'Restaurant',translation:'restaurante'},{id:'kaffee',source:'Kaffee',translation:'café'},{id:'speisekarte',source:'Speisekarte',translation:'menú'}] },
  { id: 'ciudad', title: 'La ciudad', description: 'Lugares útiles y orientación', language: 'de', words: [{id:'strasse',source:'Straße',translation:'calle'},{id:'platz',source:'Platz',translation:'plaza'},{id:'bahnhof',source:'Bahnhof',translation:'estación'},{id:'hotel',source:'Hotel',translation:'hotel'},{id:'krankenhaus',source:'Krankenhaus',translation:'hospital'},{id:'apotheke',source:'Apotheke',translation:'farmacia'}] },
  { id: 'tiempo', title: 'El tiempo', description: 'Organiza momentos del día', language: 'de', words: [{id:'heute',source:'heute',translation:'hoy'},{id:'morgen-zukunft',source:'morgen',translation:'mañana'},{id:'gestern',source:'gestern',translation:'ayer'},{id:'morgen-tag',source:'Morgen',translation:'mañana (parte del día)'},{id:'nachmittag',source:'Nachmittag',translation:'tarde'},{id:'nacht',source:'Nacht',translation:'noche'}] },
  { id: 'estudio', title: 'Estudio y trabajo', description: 'Vocabulario para aprender y trabajar', language: 'de', words: [{id:'lehrer',source:'Lehrer',translation:'profesor'},{id:'schueler',source:'Schüler',translation:'estudiante'},{id:'schule',source:'Schule',translation:'escuela'},{id:'arbeit',source:'Arbeit',translation:'trabajo'},{id:'buero',source:'Büro',translation:'oficina'},{id:'computer',source:'Computer',translation:'ordenador'}] },
] as const;

const PORTUGUESE_LESSONS: readonly Lesson[] = [
  { id: 'basico-1', title: 'Básico 1', description: 'Saludos y expresiones esenciales', language: 'pt', words: [{ id:'ola',source:'olá',translation:'hola'},{id:'adeus',source:'adeus',translation:'adiós'},{id:'porfavor',source:'por favor',translation:'por favor'},{id:'obrigado',source:'obrigado',translation:'gracias'},{id:'sim',source:'sim',translation:'sí'},{id:'nao',source:'não',translation:'no'}] },
  { id: 'basico-2', title: 'Básico 2', description: 'Objetos y palabras cotidianas', language: 'pt', words: [{id:'agua',source:'água',translation:'agua'},{id:'pao',source:'pão',translation:'pan'},{id:'casa',source:'casa',translation:'casa'},{id:'cao',source:'cão',translation:'perro'},{id:'gato',source:'gato',translation:'gato'},{id:'livro',source:'livro',translation:'libro'}] },
  { id: 'viajes', title: 'Viajes', description: 'Vocabulario para moverte por el mundo', language: 'pt', words: [{id:'aeroporto',source:'aeroporto',translation:'aeropuerto'},{id:'bilhete',source:'bilhete',translation:'billete'},{id:'comboio',source:'comboio',translation:'tren'},{id:'praia',source:'praia',translation:'playa'},{id:'mapa',source:'mapa',translation:'mapa'},{id:'mala',source:'mala',translation:'maleta'}] },
  { id: 'familia', title: 'Familia', description: 'Habla de las personas cercanas', language: 'pt', words: [{id:'mae',source:'mãe',translation:'madre'},{id:'pai',source:'pai',translation:'padre'},{id:'irma',source:'irmã',translation:'hermana'},{id:'irmao',source:'irmão',translation:'hermano'},{id:'familia',source:'família',translation:'familia'},{id:'crianca',source:'criança',translation:'niño o niña'}] },
  { id: 'comida', title: 'Comida', description: 'Pide y comprende lo esencial', language: 'pt', words: [{id:'pequenoalmoco',source:'pequeno-almoço',translation:'desayuno'},{id:'almoco',source:'almoço',translation:'almuerzo'},{id:'jantar',source:'jantar',translation:'cena'},{id:'restaurante',source:'restaurante',translation:'restaurante'},{id:'cafe',source:'café',translation:'café'},{id:'menu',source:'menu',translation:'menú'}] },
  { id: 'ciudad', title: 'La ciudad', description: 'Lugares útiles y orientación', language: 'pt', words: [{id:'rua',source:'rua',translation:'calle'},{id:'praca',source:'praça',translation:'plaza'},{id:'estacao',source:'estação',translation:'estación'},{id:'hotel',source:'hotel',translation:'hotel'},{id:'hospital',source:'hospital',translation:'hospital'},{id:'farmacia',source:'farmácia',translation:'farmacia'}] },
  { id: 'tiempo', title: 'El tiempo', description: 'Organiza momentos del día', language: 'pt', words: [{id:'hoje',source:'hoje',translation:'hoy'},{id:'amanha',source:'amanhã',translation:'mañana'},{id:'ontem',source:'ontem',translation:'ayer'},{id:'manha-dia',source:'manhã',translation:'mañana (parte del día)'},{id:'tarde',source:'tarde',translation:'tarde'},{id:'noite',source:'noite',translation:'noche'}] },
  { id: 'estudio', title: 'Estudio y trabajo', description: 'Vocabulario para aprender y trabajar', language: 'pt', words: [{id:'professor',source:'professor',translation:'profesor'},{id:'estudante',source:'estudante',translation:'estudiante'},{id:'escola',source:'escola',translation:'escuela'},{id:'trabalho',source:'trabalho',translation:'trabajo'},{id:'escritorio',source:'escritório',translation:'oficina'},{id:'computador',source:'computador',translation:'ordenador'}] },
] as const;

export const LESSONS_BY_LANGUAGE: Readonly<Record<LanguageCode, readonly Lesson[]>> = {
  en: ENGLISH_LESSONS,
  es: [],
  fr: FRENCH_LESSONS,
  it: ITALIAN_LESSONS,
  de: GERMAN_LESSONS,
  pt: PORTUGUESE_LESSONS,
};
export const LESSONS: readonly Lesson[] = [
  ...ENGLISH_LESSONS,
  ...FRENCH_LESSONS,
  ...ITALIAN_LESSONS,
  ...GERMAN_LESSONS,
  ...PORTUGUESE_LESSONS,
];

export function getLessonById(id: string | undefined, language: LanguageCode = 'en'): Lesson | undefined {
  return id ? LESSONS_BY_LANGUAGE[language].find((lesson) => lesson.id === id) : undefined;
}

export function getLessonsByLanguage(language: LanguageCode): readonly Lesson[] {
  return LESSONS_BY_LANGUAGE[language] ?? [];
}

export function getProgressKey(language: LanguageCode, lessonId: string): string { return `${language}:${lessonId}`; }
