import { useMemo } from 'react'
import { speak } from '../hooks/useSpeech'

interface DailyWord {
  en: string
  es: string
  ipa: string
  example: string
  exampleEs: string
  level: string
  tip: string
}

const DAILY_WORDS: DailyWord[] = [
  { en: 'serendipity', es: 'casualidad afortunada', ipa: '/ˌserənˈdɪpɪti/', example: 'Finding that book was pure serendipity.', exampleEs: 'Encontrar ese libro fue pura casualidad.', level: 'C2', tip: 'Viene del cuento "Los tres príncipes de Serendip"' },
  { en: 'procrastinate', es: 'procrastinar / postergar', ipa: '/prəˈkræstɪneɪt/', example: "Stop procrastinating and start studying!", exampleEs: '¡Deja de procrastinar y empieza a estudiar!', level: 'B2', tip: 'Del latín "pro" (adelante) + "crastinus" (mañana)' },
  { en: 'resilience', es: 'resiliencia / capacidad de recuperación', ipa: '/rɪˈzɪliəns/', example: 'Her resilience after the setback was admirable.', exampleEs: 'Su resiliencia después del revés fue admirable.', level: 'C1', tip: 'Muy usada en contextos de psicología y negocios' },
  { en: 'overwhelmed', es: 'abrumado / desbordado', ipa: '/ˌoʊvərˈwelmd/', example: "I'm feeling overwhelmed with all this work.", exampleEs: 'Me siento abrumado con todo este trabajo.', level: 'B2', tip: 'También se usa en sentido positivo: "overwhelmed with joy"' },
  { en: 'eloquent', es: 'elocuente', ipa: '/ˈeləkwənt/', example: 'She gave an eloquent speech at the ceremony.', exampleEs: 'Dio un discurso elocuente en la ceremonia.', level: 'C1', tip: 'Describe a alguien que habla de forma persuasiva y elegante' },
  { en: 'to thrive', es: 'prosperar / florecer', ipa: '/θraɪv/', example: 'Plants thrive in this warm climate.', exampleEs: 'Las plantas prosperan en este clima cálido.', level: 'B2', tip: 'Más fuerte que "survive": implica crecer con fuerza' },
  { en: 'ambivalent', es: 'ambivalente / indeciso', ipa: '/æmˈbɪvələnt/', example: "I'm ambivalent about moving to another city.", exampleEs: 'Estoy indeciso sobre mudarme a otra ciudad.', level: 'C1', tip: 'Tener sentimientos contradictorios sobre algo' },
  { en: 'to undermine', es: 'socavar / minar', ipa: '/ˌʌndərˈmaɪn/', example: 'His constant criticism undermined her confidence.', exampleEs: 'Sus críticas constantes socavaron su confianza.', level: 'C1', tip: 'Debilitar algo gradualmente, a menudo de forma sutil' },
  { en: 'quintessential', es: 'por excelencia', ipa: '/ˌkwɪntɪˈsenʃəl/', example: 'Tea is the quintessential British drink.', exampleEs: 'El té es la bebida británica por excelencia.', level: 'C2', tip: 'El ejemplo más perfecto o típico de algo' },
  { en: 'to stumble upon', es: 'encontrar por casualidad', ipa: '/ˈstʌmbl əˈpɒn/', example: 'I stumbled upon a great café in the old town.', exampleEs: 'Encontré por casualidad un café genial en el casco antiguo.', level: 'B2', tip: 'Literalmente "tropezar con" pero se usa para hallazgos casuales' },
  { en: 'meticulous', es: 'meticuloso / minucioso', ipa: '/məˈtɪkjʊləs/', example: 'She is meticulous about her work.', exampleEs: 'Es meticulosa con su trabajo.', level: 'C1', tip: 'Presta mucha atención a los detalles' },
  { en: 'to dwindle', es: 'menguar / disminuir', ipa: '/ˈdwɪndl/', example: 'Their savings dwindled over the years.', exampleEs: 'Sus ahorros menguaron con los años.', level: 'C2', tip: 'Reducirse gradualmente hasta casi desaparecer' },
  { en: 'candid', es: 'sincero / franco', ipa: '/ˈkændɪd/', example: 'Let me be candid with you about the situation.', exampleEs: 'Déjame ser sincero contigo sobre la situación.', level: 'C1', tip: 'Honestidad directa, sin filtro' },
  { en: 'to leverage', es: 'aprovechar / sacar partido', ipa: '/ˈlevərɪdʒ/', example: 'We should leverage our experience in this area.', exampleEs: 'Deberíamos aprovechar nuestra experiencia en esta área.', level: 'C1', tip: 'Muy usada en contextos de negocios' },
  { en: 'unprecedented', es: 'sin precedentes', ipa: '/ʌnˈpresɪdentɪd/', example: 'The pandemic caused unprecedented disruption.', exampleEs: 'La pandemia causó una disrupción sin precedentes.', level: 'C1', tip: 'Algo que nunca ha ocurrido antes' },
  { en: 'to flourish', es: 'florecer / prosperar', ipa: '/ˈflʌrɪʃ/', example: 'The arts flourished during the Renaissance.', exampleEs: 'Las artes florecieron durante el Renacimiento.', level: 'B2', tip: 'Crecer con éxito y vitalidad' },
  { en: 'nuance', es: 'matiz', ipa: '/ˈnjuːɑːns/', example: 'The nuances of his argument were lost in translation.', exampleEs: 'Los matices de su argumento se perdieron en la traducción.', level: 'C2', tip: 'Diferencia sutil pero importante' },
  { en: 'to reconcile', es: 'reconciliar / conciliar', ipa: '/ˈrekənsaɪl/', example: "It's hard to reconcile work and family life.", exampleEs: 'Es difícil conciliar trabajo y vida familiar.', level: 'C1', tip: 'Hacer que dos cosas opuestas coexistan' },
  { en: 'compelling', es: 'convincente / fascinante', ipa: '/kəmˈpelɪŋ/', example: 'The documentary was absolutely compelling.', exampleEs: 'El documental era absolutamente fascinante.', level: 'C1', tip: 'Algo que atrae tu atención y te convence' },
  { en: 'to tackle', es: 'abordar / enfrentarse a', ipa: '/ˈtækl/', example: 'We need to tackle this problem head-on.', exampleEs: 'Necesitamos abordar este problema de frente.', level: 'B2', tip: 'Enfrentarse a algo difícil con determinación' },
  { en: 'bewildered', es: 'desconcertado / perplejo', ipa: '/bɪˈwɪldərd/', example: 'She looked bewildered by all the noise.', exampleEs: 'Parecía desconcertada por todo el ruido.', level: 'C1', tip: 'Más fuerte que "confused": completamente perdido' },
  { en: 'to alleviate', es: 'aliviar / mitigar', ipa: '/əˈliːvieɪt/', example: 'This medicine will alleviate the pain.', exampleEs: 'Esta medicina aliviará el dolor.', level: 'C1', tip: 'Reducir algo negativo (dolor, estrés, pobreza)' },
  { en: 'plethora', es: 'plétora / gran cantidad', ipa: '/ˈpleθərə/', example: 'There is a plethora of options available.', exampleEs: 'Hay una plétora de opciones disponibles.', level: 'C2', tip: 'Un exceso o abundancia de algo' },
  { en: 'to encompass', es: 'abarcar / englobar', ipa: '/ɪnˈkʌmpəs/', example: 'The course encompasses all aspects of design.', exampleEs: 'El curso abarca todos los aspectos del diseño.', level: 'C1', tip: 'Incluir o contener muchas cosas' },
  { en: 'outweigh', es: 'superar / pesar más que', ipa: '/ˌaʊtˈweɪ/', example: 'The benefits outweigh the risks.', exampleEs: 'Los beneficios superan los riesgos.', level: 'C1', tip: 'Ser más importante o significativo que' },
  { en: 'to hinder', es: 'obstaculizar / dificultar', ipa: '/ˈhɪndər/', example: 'Bad weather hindered the rescue efforts.', exampleEs: 'El mal tiempo obstaculizó los esfuerzos de rescate.', level: 'C1', tip: 'Hacer algo más difícil o lento' },
  { en: 'ephemeral', es: 'efímero', ipa: '/ɪˈfemərəl/', example: 'Social media fame is often ephemeral.', exampleEs: 'La fama en redes sociales es a menudo efímera.', level: 'C2', tip: 'Algo que dura muy poco tiempo' },
  { en: 'to foster', es: 'fomentar / promover', ipa: '/ˈfɒstər/', example: 'We aim to foster creativity in children.', exampleEs: 'Pretendemos fomentar la creatividad en los niños.', level: 'C1', tip: 'Ayudar a que algo se desarrolle y crezca' },
  { en: 'intricate', es: 'intrincado / complejo', ipa: '/ˈɪntrɪkət/', example: 'The watch has an intricate mechanism.', exampleEs: 'El reloj tiene un mecanismo intrincado.', level: 'C1', tip: 'Con muchas partes pequeñas y complejas' },
  { en: 'to perpetuate', es: 'perpetuar', ipa: '/pərˈpetʃueɪt/', example: 'This policy perpetuates inequality.', exampleEs: 'Esta política perpetúa la desigualdad.', level: 'C2', tip: 'Hacer que algo (normalmente negativo) continúe indefinidamente' },
]

function getWordOfDay(): DailyWord {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_WORDS[dayOfYear % DAILY_WORDS.length]
}

export default function WordOfDay() {
  const word = useMemo(() => getWordOfDay(), [])

  return (
    <div className="wod fade-in">
      <div className="wod-card">
        <div className="wod-header">
          <span className="wod-badge">🌟 Palabra del Día</span>
          <span className="wod-level">{word.level}</span>
        </div>
        <button className="wod-word" onClick={() => speak(word.en, 'en-US', 0.8)}>
          <span className="wod-en">{word.en}</span>
          <span className="wod-ipa">{word.ipa}</span>
          <span className="wod-speaker">🔊</span>
        </button>
        <span className="wod-es">{word.es}</span>
        <div className="wod-example">
          <p className="wod-example-en">"{word.example}"</p>
          <p className="wod-example-es">{word.exampleEs}</p>
        </div>
        <div className="wod-tip">
          <span>💡 {word.tip}</span>
        </div>
      </div>
    </div>
  )
}
