import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Volume2, X, RefreshCw, CheckCircle2, ArrowUp, ArrowDown, HelpCircle, Compass, Sparkles } from 'lucide-react'
import { soundSynthesizer } from '../utils/audioSynthesizer'
import { useHaptics } from '../hooks/useHaptics'

interface BlindModeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Question {
  id: number
  categoryKey: 'heritage' | 'gastronomy' | 'nature' | 'accessible'
  texts: Record<string, string>
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    categoryKey: 'heritage',
    texts: {
      es: '¿Te apasionan los monumentos históricos, conventos del siglo XVI y arquitectura esculpida en piedra sillar blanca?',
      en: 'Are you passionate about historic monuments, 16th-century convents, and architecture carved in white volcanic ashlar stone?',
      fr: 'Êtes-vous passionné par les monuments historiques et l’architecture sculptée en pierre de sillar volcanique blanche?',
      pt: 'Você gosta de monumentos históricos, conventos do século XVI e arquitetura esculpida em pedra sillar branca?',
      ja: '16世紀の修道院や白い火山岩（シジャール）で作られた歴史的建造物に興味はありますか？',
    },
  },
  {
    id: 2,
    categoryKey: 'gastronomy',
    texts: {
      es: '¿Te gustaría degustar la gastronomía tradicional arequipeña y rocoto relleno en picanterías ancestrales a la leña?',
      en: 'Would you like to taste traditional Arequipa gastronomy and stuffed rocoto in ancestral wood-fired picanterías?',
      fr: 'Souhaitez-vous goûter à la gastronomie traditionnelle d’Arequipa dans des picanterías ancestrales au feu de bois?',
      pt: 'Gostaria de experimentar a gastronomia tradicional de Arequipa e rocoto recheado em picanterias ancestrais?',
      ja: '伝統的なアニャシュアイコ料理やアrequipaの伝統的なピカンテリア（郷土料理店）を巡りたいですか？',
    },
  },
  {
    id: 3,
    categoryKey: 'nature',
    texts: {
      es: '¿Prefieres paisajes de naturaleza abierta como el Cañón del Colca, avistamiento de cóndores y volcanes?',
      en: 'Do you prefer open nature landscapes like Colca Canyon, condor watching, and active volcanoes?',
      fr: 'Prégérez-vous les paysages naturels ouverts comme le Canyon de Colca, l’observation des condors et les volcans?',
      pt: 'Prefere paisagens naturais como o Cânion do Colca, avistamento de condores e vulcões?',
      ja: 'コルカ渓谷やコンドルの飛翔、ミスティ火山などの自然風景を優先したいですか？',
    },
  },
  {
    id: 4,
    categoryKey: 'accessible',
    texts: {
      es: '¿Buscas espacios accesibles, miradores con brisa, plazoletas tranquilas y rutas sin escalones pronunciados?',
      en: 'Are you looking for accessible spaces, breezy viewpoints, quiet plazas, and routes without steep steps?',
      fr: 'Recherchez-vous des espaces accessibles, des belvédères aérés, des petites places paisibles et des parcours sans marches escarpées?',
      pt: 'Procura espaços acessíveis, mirantes com brisa, praças tranquilas e caminhos sem degraus íngremes?',
      ja: '段差が少なくアクセスしやすい広場や、涼しい風が吹く展望台のコースを希望しますか？',
    },
  },
]

const INTRO_TEXTS: Record<string, string> = {
  es: 'Bienvenido al Modo Interactivo No Visual. La pantalla se divide en dos zonas: Toca la mitad superior para responder NO, o la mitad inferior para responder SÍ. También puedes presionar Flecha Arriba para NO, o Flecha Abajo para SÍ.',
  en: 'Welcome to Non-Visual Interactive Mode. The screen is split in two: Touch top half to answer NO, or bottom half to answer YES. Or press Arrow Up for NO, Arrow Down for YES.',
  fr: 'Bienvenue sur le Mode Non-Visuel Interactif. L\'écran est divisé en deux: Touchez le haut pour NON, ou le bas pour OUI.',
  pt: 'Bem-vindo ao Modo Interativo Não-Visual. A tela está dividida em duas: Toque na metade superior para NÃO, ou na metade inferior para SIM.',
  ja: '非視覚インタラクティブモードへようこそ。画面の上半分をタップすると「いいえ」、下半分をタップすると「はい」になります。',
}

export default function BlindModeModal({ isOpen, onClose }: BlindModeModalProps) {
  const { i18n } = useTranslation()
  const { triggerYesHaptic, triggerNoHaptic, triggerAlertHaptic } = useHaptics()

  const [currentStep, setCurrentStep] = useState<number>(0) // 0: intro, 1..4: questions, 5: result
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [isPaused, setIsPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const activeLangCode = (i18n.language || 'es').toLowerCase().split('-')[0]

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const SPEECH_LANG_MAP: Record<string, string> = {
      es: 'es-PE',
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-BR',
      ja: 'ja-JP',
    }
    utterance.lang = SPEECH_LANG_MAP[activeLangCode] || 'es-PE'

    // Buscar voz nativa
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.lang.toLowerCase().startsWith(activeLangCode))
    if (match) utterance.voice = match

    window.speechSynthesis.speak(utterance)
    setAnnouncement(text)
  }, [activeLangCode])

  // Iniciar narración al abrir o cambiar de paso
  useEffect(() => {
    if (!isOpen) return

    if (currentStep === 0) {
      const introMsg = INTRO_TEXTS[activeLangCode] || INTRO_TEXTS.es
      speakText(introMsg)
    } else if (currentStep >= 1 && currentStep <= QUESTIONS.length) {
      const q = QUESTIONS[currentStep - 1]
      const qText = `Pregunta ${currentStep} de ${QUESTIONS.length}. ${q.texts[activeLangCode] || q.texts.es}`
      speakText(qText)
    } else if (currentStep > QUESTIONS.length) {
      // Generar perfil e itinerario narrado
      const summaryText = buildSpokenSummary(answers, activeLangCode)
      speakText(summaryText)
    }
  }, [isOpen, currentStep, activeLangCode, speakText, answers])

  // Manejo de Navegación por Teclado Exclusivo (WCAG 2.2 AAA Keyboard)
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleExit()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleAnswer(false)
      } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleAnswer(true)
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleRepeat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep])

  if (!isOpen) return null

  function handleAnswer(choice: boolean) {
    if (choice) {
      soundSynthesizer.playYesTone()
      triggerYesHaptic()
    } else {
      soundSynthesizer.playNoTone()
      triggerNoHaptic()
    }

    if (currentStep === 0) {
      setCurrentStep(1)
      return
    }

    if (currentStep >= 1 && currentStep <= QUESTIONS.length) {
      const currentQ = QUESTIONS[currentStep - 1]
      setAnswers(prev => ({ ...prev, [currentQ.categoryKey]: choice }))
      setCurrentStep(prev => prev + 1)
    }
  }

  function handleRepeat() {
    soundSynthesizer.playRepeatTone()
    if (currentStep === 0) {
      speakText(INTRO_TEXTS[activeLangCode] || INTRO_TEXTS.es)
    } else if (currentStep >= 1 && currentStep <= QUESTIONS.length) {
      const q = QUESTIONS[currentStep - 1]
      speakText(`Pregunta ${currentStep} de ${QUESTIONS.length}. ${q.texts[activeLangCode] || q.texts.es}`)
    } else {
      speakText(buildSpokenSummary(answers, activeLangCode))
    }
  }

  function handleExit() {
    soundSynthesizer.playExitTone()
    triggerAlertHaptic()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setCurrentStep(0)
    onClose()
  }

  function buildSpokenSummary(ans: Record<string, boolean>, lang: string): string {
    const isHeritage = ans.heritage ?? true
    const isGastro = ans.gastronomy ?? true
    const isNature = ans.nature ?? false

    let text = 'Hemos armado tu perfil turístico oficial de Arequipa. '
    if (isHeritage && isGastro) {
      text += 'Tu perfil ideal es Histórico y Gastronómico. Te recomendamos visitar la Plaza de Armas, el Monasterio de Santa Catalina y almorzar un Rocoto Relleno en Picantería La Nueva Palomino.'
    } else if (isNature) {
      text += 'Tu perfil es de Naturaleza y Aventura. Te recomendamos el Cañón del Colca en Cruz del Cóndor, la Ruta del Sillar en Añashuayco y las Cataratas de Pillones.'
    } else {
      text += 'Te recomendamos un recorrido tranquilo por el Centro Histórico de Arequipa, los claustros de la Compañía de Jesús y el Mirador de Yanahuara.'
    }

    text += ' Tu asistencia y perfil han sido guardados. Puedes tocar cualquier zona para finalizar.'
    return text
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden"
        role="application"
        aria-label="Modo Interactivo No Visual de Accesibilidad"
      >
        {/* Live Announcer para Lectores de Pantalla */}
        <div aria-live="assertive" className="sr-only" role="status">
          {announcement}
        </div>

        {/* Top Header Bar */}
        <div className="bg-[#111] px-6 py-4 flex items-center justify-between border-b border-white/20 z-20">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="font-extrabold font-outfit text-sm text-amber-400 uppercase tracking-wider">
              Modo No Visual (Audio-Guía)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRepeat}
              title="Repetir audio"
              className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 text-white border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Repetir (R)</span>
            </button>
            <button
              onClick={handleExit}
              title="Salir del Modo No Visual"
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 text-white shadow-lg"
            >
              <X className="w-4 h-4" />
              <span>Salir (Esc)</span>
            </button>
          </div>
        </div>

        {/* ── ZONA GIGANTE SUPERIOR (OPCIÓN "NO") — Alto Contraste Negro #050505 ── */}
        <button
          onClick={() => handleAnswer(false)}
          className="flex-1 bg-[#080808] hover:bg-[#141414] active:bg-[#222] transition-colors border-b-4 border-amber-400/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer group focus:outline-none focus:ring-4 focus:ring-amber-400"
          aria-label="Responder NO (Mitad Superior de la pantalla)"
        >
          <div className="space-y-3 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform">
              <ArrowUp className="w-8 h-8 text-gray-300" />
            </div>
            <span className="text-4xl md:text-6xl font-extrabold font-outfit text-white tracking-widest block uppercase">
              NO
            </span>
            <span className="text-xs md:text-sm text-gray-400 block font-semibold">
              (Tocar Mitad Superior o Presionar Flecha Arriba ↑)
            </span>
          </div>
        </button>

        {/* Center Prompt Banner */}
        <div className="bg-amber-400 text-black px-6 py-4 text-center font-extrabold font-outfit text-sm md:text-base border-y-2 border-black flex items-center justify-center gap-3 z-10 shadow-2xl">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>
            {currentStep === 0
              ? 'Toca cualquier mitad para iniciar el cuestionario por voz'
              : currentStep <= QUESTIONS.length
              ? `Pregunta ${currentStep} de ${QUESTIONS.length}: ${QUESTIONS[currentStep - 1].texts[activeLangCode] || QUESTIONS[currentStep - 1].texts.es}`
              : '¡Perfil Turístico Generado! Toca para salir.'}
          </span>
        </div>

        {/* ── ZONA GIGANTE INFERIOR (OPCIÓN "SÍ") — Alto Contraste Amarillo #FFD700 ── */}
        <button
          onClick={() => handleAnswer(true)}
          className="flex-1 bg-[#FFD700] hover:bg-[#ffdf33] active:bg-[#e6c200] transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer group text-black focus:outline-none focus:ring-4 focus:ring-black"
          aria-label="Responder SÍ (Mitad Inferior de la pantalla)"
        >
          <div className="space-y-3 pointer-events-none">
            <span className="text-4xl md:text-6xl font-extrabold font-outfit text-black tracking-widest block uppercase">
              SÍ
            </span>
            <div className="w-16 h-16 rounded-full bg-black/10 border-2 border-black/30 flex items-center justify-center mx-auto text-black group-hover:scale-110 transition-transform">
              <ArrowDown className="w-8 h-8 text-black" />
            </div>
            <span className="text-xs md:text-sm text-black/80 block font-bold">
              (Tocar Mitad Inferior o Presionar Flecha Abajo ↓ / Enter)
            </span>
          </div>
        </button>

      </div>
    </AnimatePresence>
  )
}
