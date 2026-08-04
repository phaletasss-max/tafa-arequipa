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
      es: '¿Te apasionan los monumentos históricos, conventos del siglo XVI y la arquitectura esculpida en piedra sillar volcánica blanca?',
      en: 'Are you passionate about historic monuments, 16th-century convents, and white volcanic ashlar architecture?',
      fr: 'Êtes-vous passionné par les monuments historiques et l’architecture sculptée en sillar blanc?',
      pt: 'Você gosta de monumentos históricos, conventos do século XVI e arquitetura em pedra sillar branca?',
      ja: '16世紀の修道院や白い火山岩（シジャール）で作られた歴史的建造物に興味はありますか？',
    },
  },
  {
    id: 2,
    categoryKey: 'gastronomy',
    texts: {
      es: '¿Te gustaría degustar la gastronomía tradicional arequipeña y rocoto relleno en picanterías ancestrales a la leña?',
      en: 'Would you like to taste traditional Arequipa gastronomy and stuffed rocoto in wood-fired picanterías?',
      fr: 'Souhaitez-vous goûter à la gastronomie traditionnelle d’Arequipa dans des picanterías au feu de bois?',
      pt: 'Gostaria de experimentar a gastronomia tradicional de Arequipa e rocoto recheado em picanterias?',
      ja: '伝統的なアニャシュアイコ料理やアrequipaの伝統的なピカンテリア（郷土料理店）を巡りたいですか？',
    },
  },
  {
    id: 3,
    categoryKey: 'nature',
    texts: {
      es: '¿Prefieres paisajes de naturaleza abierta como el Cañón del Colca, avistamiento de cóndores y volcanes?',
      en: 'Do you prefer open nature landscapes like Colca Canyon, condor watching, and active volcanoes?',
      fr: 'Prégérez-vous les paysages naturels ouverts comme le Canyon de Colca et les volcans?',
      pt: 'Prefere paisagens naturais como o Cânion do Colca, avistamento de condores e vulcões?',
      ja: 'コルカ渓谷やコンドルの飛翔、ミスティ火山などの自然風景を優先したいですか？',
    },
  },
  {
    id: 4,
    categoryKey: 'accessible',
    texts: {
      es: '¿Buscas espacios accesibles, miradores con brisa, plazoletas tranquilas y rutas sin escalones pronunciados?',
      en: 'Are you looking for accessible spaces, breezy viewpoints, quiet plazas, and step-free routes?',
      fr: 'Recherchez-vous des espaces accessibles, des belvédères aérés et des parcours sans marches escarpées?',
      pt: 'Procura espaços acessíveis, mirantes com brisa, praças tranquilas e caminhos sem degraus íngremes?',
      ja: '段差が少なくアクセスしやすい広場や、涼しい風が吹く展望台のコースを希望しますか？',
    },
  },
]

const INTRO_VOICE_HEAD: Record<string, string> = {
  es: 'Modo No Visual Activado. Toca arriba para NO, o abajo para SÍ. ',
  en: 'Non-Visual Mode Active. Touch top for NO, or bottom for YES. ',
  fr: 'Mode Non-Visuel Activé. Touchez le haut pour NON, ou le bas pour OUI. ',
  pt: 'Modo Não-Visual Ativado. Toque no topo para NÃO, ou na parte inferior para SIM. ',
  ja: '非視覚モード起動。上をタップすると「いいえ」、下をタップすると「はい」になります。',
}

export default function BlindModeModal({ isOpen, onClose }: BlindModeModalProps) {
  const { i18n } = useTranslation()
  const { triggerYesHaptic, triggerNoHaptic, triggerAlertHaptic } = useHaptics()

  const [currentStep, setCurrentStep] = useState<number>(1) // Inicia automáticamente en Pregunta 1
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
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

  // Al abrir el modal: Suena chime de entrada y narra la guía + Pregunta 1 automáticamente
  useEffect(() => {
    if (!isOpen) return

    soundSynthesizer.playEntranceTone()
    setCurrentStep(1)

    const head = INTRO_VOICE_HEAD[activeLangCode] || INTRO_VOICE_HEAD.es
    const q1 = QUESTIONS[0]
    const fullIntroMsg = `${head} Pregunta 1 de ${QUESTIONS.length}: ${q1.texts[activeLangCode] || q1.texts.es}`
    speakText(fullIntroMsg)
  }, [isOpen, activeLangCode, speakText])

  // Cambios de paso subsiguientes (Preguntas 2..4 y Resultado final)
  const speakStep = useCallback((step: number, choicePrefix = '') => {
    if (step >= 1 && step <= QUESTIONS.length) {
      const q = QUESTIONS[step - 1]
      const qText = `${choicePrefix} Pregunta ${step} de ${QUESTIONS.length}: ${q.texts[activeLangCode] || q.texts.es}`
      speakText(qText)
    } else if (step > QUESTIONS.length) {
      const summaryText = `${choicePrefix} ${buildSpokenSummary(answers, activeLangCode)}`
      speakText(summaryText)
    }
  }, [activeLangCode, speakText, answers])

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

    const choiceLabel = choice ? 'Respuesta SÍ.' : 'Respuesta NO.'

    if (currentStep >= 1 && currentStep <= QUESTIONS.length) {
      const currentQ = QUESTIONS[currentStep - 1]
      const nextStep = currentStep + 1
      setAnswers(prev => ({ ...prev, [currentQ.categoryKey]: choice }))
      setCurrentStep(nextStep)
      speakStep(nextStep, choiceLabel)
    }
  }

  function handleRepeat() {
    soundSynthesizer.playRepeatTone()
    speakStep(currentStep)
  }

  function handleExit() {
    soundSynthesizer.playExitTone()
    triggerAlertHaptic()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setCurrentStep(1)
    onClose()
  }

  function buildSpokenSummary(ans: Record<string, boolean>, lang: string): string {
    const isHeritage = ans.heritage ?? true
    const isGastro = ans.gastronomy ?? true
    const isNature = ans.nature ?? false

    let text = 'Perfil de viajero generado con éxito. '
    if (isHeritage && isGastro) {
      text += 'Tu perfil es Histórico y Gastronómico. Te recomendamos visitar la Plaza de Armas, Monasterio de Santa Catalina y degustar un Rocoto Relleno en Picantería La Nueva Palomino.'
    } else if (isNature) {
      text += 'Tu perfil es Naturaleza y Aventura. Te recomendamos explorar el Cañón del Colca en Cruz del Cóndor y la Ruta del Sillar en Añashuayco.'
    } else {
      text += 'Te recomendamos un recorrido tranquilo por el Centro Histórico de Arequipa y el Mirador de Yanahuara.'
    }

    text += ' Tu asistencia y preferencias están guardadas.'
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
              Modo No Visual (Audio-Guía Activa)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRepeat}
              title="Repetir audio"
              className="bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-white border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Repetir (R)</span>
            </button>
            <button
              onClick={handleExit}
              title="Salir del Modo No Visual"
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-white shadow-lg"
            >
              <X className="w-4 h-4" />
              <span>Salir (Esc)</span>
            </button>
          </div>
        </div>

        {/* ── ZONA GIGANTE SUPERIOR (OPCIÓN "NO") — Alto Contraste Negro #080808 ── */}
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
            {currentStep <= QUESTIONS.length
              ? `Pregunta ${currentStep} de ${QUESTIONS.length}: ${QUESTIONS[currentStep - 1].texts[activeLangCode] || QUESTIONS[currentStep - 1].texts.es}`
              : '¡Perfil Turístico Generado! Toca arriba o abajo para salir.'}
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
