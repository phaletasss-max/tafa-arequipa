import { useState } from 'react'
import { QrCode, Volume2, Globe, ShieldCheck, X, Sparkles } from 'lucide-react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  qrId?: string
}

const mockQRPoints: Record<string, { nombre: string; lugar: string; descEs: string; descEn: string; audioUrl: string }> = {
  'QR-PLAZA-01': {
    nombre: 'Catedral de Arequipa - Fachada Principal',
    lugar: 'Plaza de Armas',
    descEs: 'Construida enteramente en piedra de sillar blanco volcánico en 1621. Es una de las 70 iglesias del mundo autorizadas para desplegar el estandarte del Vaticano.',
    descEn: 'Built entirely of white volcanic sillar stone in 1621. It is one of only 70 churches in the world authorized to display the Vatican flag.',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg',
  },
  'QR-SANTA-01': {
    nombre: 'Claustro de los Naranjos - Monasterio de Santa Catalina',
    lugar: 'Monasterio de Santa Catalina',
    descEs: 'Fundado en 1579. Tres pino-naranjos simbolizan la vida eterna. Los muros en azul añil se obtenían de pigmentos traídos de la selva peruana.',
    descEn: 'Founded in 1579. Three orange trees symbolize eternal life. Indigo blue walls were tinted with natural pigments from the Peruvian jungle.',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg',
  },
  'QR-COLCA-01': {
    nombre: 'Mirador Cruz del Cóndor - Cañón del Colca',
    lugar: 'Chivay / Yanque',
    descEs: 'Punto geográfico estratégico a 3,280 msnm donde las corrientes térmicas matutinas permiten el planeo de la ave voladora más grande del planeta.',
    descEn: 'Strategic viewpoint at 3,280 meters above sea level where morning thermal updrafts carry the Andean Condor into flight.',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg',
  },
}

export default function QRModal({ isOpen, onClose, qrId = 'QR-PLAZA-01' }: QRModalProps) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [playingAudio, setPlayingAudio] = useState(false)

  if (!isOpen) return null

  const point = mockQRPoints[qrId] || mockQRPoints['QR-PLAZA-01']

  function toggleAudio() {
    if (!('speechSynthesis' in window)) return
    if (playingAudio) {
      window.speechSynthesis.cancel()
      setPlayingAudio(false)
    } else {
      const text = lang === 'es' ? point.descEs : point.descEn
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'es' ? 'es-PE' : 'en-US'
      utterance.onend = () => setPlayingAudio(false)
      setPlayingAudio(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-tafa-dark border border-white/20 rounded-[36px] max-w-md w-full p-8 text-white relative shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-tafa-volcán/20 text-tafa-volcán border border-tafa-volcán/40 flex items-center justify-center text-2xl">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-tafa-volcán flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Señalética Digital QR Registrada
            </span>
            <h3 className="text-xl font-bold font-outfit text-white">
              {point.lugar}
            </h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Punto de Información {qrId}
          </div>
          <div className="text-base font-semibold text-white mb-2">{point.nombre}</div>

          {/* Toggle Idioma */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Idioma / Language:
            </span>
            <div className="flex bg-black/40 rounded-full p-0.5 border border-white/10">
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${lang === 'es' ? 'bg-tafa-volcán text-white' : 'text-gray-400'}`}
              >
                Español
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${lang === 'en' ? 'bg-tafa-volcán text-white' : 'text-gray-400'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Texto descriptivo contextual */}
        <p className="text-gray-200 text-sm leading-relaxed mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
          {lang === 'es' ? point.descEs : point.descEn}
        </p>

        {/* Reproductor de Audioruta */}
        <button
          onClick={toggleAudio}
          className={`w-full py-3.5 rounded-full font-outfit text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
            playingAudio ? 'bg-tafa-volcán text-white animate-pulse' : 'bg-white text-black hover:bg-tafa-volcán hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{playingAudio ? 'Detener Audioruta' : 'Reproducir Audioruta en Voz'}</span>
        </button>
      </div>
    </div>
  )
}
