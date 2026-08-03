import { useState, useEffect } from 'react'
import { Eye, Type, Volume2, ShieldAlert, Sparkles } from 'lucide-react'

interface AccessibilityBarProps {
  onFilterAccessibility?: (accType: 'motriz' | 'auditiva' | 'visual' | null) => void
}

export default function AccessibilityBar({ onFilterAccessibility }: AccessibilityBarProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSizeLevel, setFontSizeLevel] = useState(0) // 0: Normal, 1: Grande (+15%), 2: Extra grande (+30%)
  const [activeAccFilter, setActiveAccFilter] = useState<'motriz' | 'auditiva' | 'visual' | null>(null)
  const [speaking, setSpeaking] = useState(false)

  // Aplicar modo Alto Contraste al DOM
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('wcag-high-contrast')
    } else {
      document.body.classList.remove('wcag-high-contrast')
    }
  }, [highContrast])

  // Aplicar tamaño de fuente global
  useEffect(() => {
    const scales = ['100%', '115%', '130%']
    document.documentElement.style.fontSize = scales[fontSizeLevel]
  }, [fontSizeLevel])

  function toggleAccFilter(type: 'motriz' | 'auditiva' | 'visual') {
    const next = activeAccFilter === type ? null : type
    setActiveAccFilter(next)
    if (onFilterAccessibility) onFilterAccessibility(next)
  }

  function readScreenSummary() {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura de voz (Speech Synthesis).')
      return
    }

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const text = "Bienvenido a Descubre Arequipa, portal de turismo inteligente e inclusivo. Ofrecemos información oficial sobre la Plaza de Armas, el Monasterio de Santa Catalina, el Cañón del Colca y picanterías tradicionales, con filtros de accesibilidad motriz, auditiva y audiorutas."
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-PE'
    utterance.onend = () => setSpeaking(false)

    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <aside
      aria-label="Barra de Accesibilidad Universal WCAG 2.1"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-tafa-dark/95 backdrop-blur-xl text-white p-2.5 rounded-full border border-white/20 shadow-2xl transition-all hover:border-tafa-volcán"
    >
      {/* Botón Lector de Pantalla / Audio Resumen */}
      <button
        onClick={readScreenSummary}
        title="Escuchar resumen de la página (Audioruta)"
        aria-label="Escuchar resumen en audio de la página"
        className={`p-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          speaking ? 'bg-tafa-volcán text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <Volume2 className="w-4 h-4" />
        <span className="hidden md:inline">{speaking ? 'Detener Audio' : 'Audioruta'}</span>
      </button>

      {/* Control Tamaño de Fuente */}
      <button
        onClick={() => setFontSizeLevel((prev) => (prev + 1) % 3)}
        title="Cambiar tamaño de fuente (+A / Normal)"
        aria-label="Cambiar tamaño de texto"
        className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
      >
        <Type className="w-4 h-4" />
        <span>{fontSizeLevel === 0 ? 'A' : fontSizeLevel === 1 ? 'A+' : 'A++'}</span>
      </button>

      {/* Modo Alto Contraste (WCAG AAA) */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        title="Modo Alto Contraste WCAG AAA"
        aria-label="Activar o desactivar alto contraste"
        className={`p-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden md:inline">{highContrast ? 'Contraste Alto' : 'Contraste'}</span>
      </button>

      <div className="w-[1px] h-6 bg-white/20 my-auto" />

      {/* Filtros de Infraestructura Inclusiva */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleAccFilter('motriz')}
          title="Filtro: Accesibilidad Motriz (Rampas / Baños adaptados)"
          aria-label="Filtrar por accesibilidad motriz"
          className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
            activeAccFilter === 'motriz' ? 'bg-tafa-andino text-white ring-2 ring-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
        >
          ♿ Motriz
        </button>

        <button
          onClick={() => toggleAccFilter('auditiva')}
          title="Filtro: Discapacidad Auditiva (Lengua de Señas / Subtítulos)"
          aria-label="Filtrar por accesibilidad auditiva"
          className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
            activeAccFilter === 'auditiva' ? 'bg-tafa-cielo text-white ring-2 ring-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
        >
          🧏 Auditiva
        </button>

        <button
          onClick={() => toggleAccFilter('visual')}
          title="Filtro: Baja Visión / Ceguera (Audiorutas / Relieve)"
          aria-label="Filtrar por audiorutas y baja visión"
          className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
            activeAccFilter === 'visual' ? 'bg-purple-600 text-white ring-2 ring-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
        >
          👁️ Audiorutas
        </button>
      </div>
    </aside>
  )
}
