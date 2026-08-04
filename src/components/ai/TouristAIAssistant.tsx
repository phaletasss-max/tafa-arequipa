import { useState } from 'react'
import { Bot, Send, X, Globe, Sparkles, User, RefreshCw, Key } from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export default function TouristAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [language, setLanguage] = useState<'es' | 'en' | 'fr' | 'de'>('es')
  const [inputMsg, setInputMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '¡Hola! Soy tu asistente de viaje inteligente Arequipa360°. Puedo recomendarte itinerarios personalizados, lugares accesibles, picanterías tradicionales y consejos sobre el mal de altura. ¿En qué te puedo orientar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  async function handleSend(customText?: string) {
    const query = customText || inputMsg
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    if (!customText) setInputMsg('')
    setLoading(true)

    // Si el usuario ingresó una API key de Gemini, hacer la llamada real a Gemini API
    if (apiKey.trim()) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Eres el Asistente Turístico Inteligente oficial de Arequipa360° (TAFA). Responde de forma concisa, útil y hospitalaria en idioma ${language}. Conoces la Plaza de Armas, Catedral, Santa Catalina, Colca, Añashuayco, Cotahuasi, Picanterías, accesibilidad WCAG y teléfonos de emergencia POLTUR (054-201258). Pregunta del turista: ${query}`
              }]
            }]
          })
        })
        const data = await res.json()
        const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude obtener respuesta de Gemini API.'
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
        setLoading(false)
        return
      } catch (e) {
        console.warn('Fallback a respuestas contextuales locales:', e)
      }
    }

    // Respuestas contextuales inteligentes fallback (sin API key)
    setTimeout(() => {
      let reply = ''
      const q = query.toLowerCase()

      if (q.includes('días') || q.includes('itinerario') || q.includes('dias') || q.includes('rutas')) {
        reply = language === 'en' 
          ? 'Recommended 3-day itinerary: Day 1: Plaza de Armas, Cathedral & Santa Catalina Monastery. Day 2: Añashuayco Sillar Route & Yanahuara Picantería. Day 3: Colca Canyon & Cruz del Cóndor.'
          : 'Itinerario recomendado de 3 días: Día 1: Plaza de Armas, Catedral y Monasterio de Santa Catalina. Día 2: Ruta del Sillar Añashuayco y picantería en Yanahuara. Día 3: Excursión al Cañón del Colca y Cruz del Cóndor.'
      } else if (q.includes('accesible') || q.includes('silla') || q.includes('rampa')) {
        reply = language === 'en'
          ? 'Accessible spots with ramps and WCAG 2.1 compliance: Monasterio de Santa Catalina, Plaza de Armas & Catedral, and La Nueva Palomino restaurant.'
          : 'Atractivos con accesibilidad motriz comprobada (rampas y baños adaptados): Monasterio de Santa Catalina, Plaza de Armas, Catedral de Arequipa y restaurante La Nueva Palomino.'
      } else if (q.includes('soroche') || q.includes('altura') || q.includes('salud') || q.includes('seguridad')) {
        reply = language === 'en'
          ? 'Arequipa is at 2,335m and Colca at 3,630m. Rest 4 hours upon arrival, drink coca tea, and keep hydration. POLTUR Police Emergency Hotline: (054) 201258.'
          : 'Arequipa se encuentra a 2,335 msnm y el Colca a 3,630 msnm. Descansa 4 horas al llegar, toma té de coca y mantén hidratación. Policía de Turismo POLTUR: (054) 201258.'
      } else if (q.includes('comer') || q.includes('picanter') || q.includes('comida') || q.includes('rocoto')) {
        reply = language === 'en'
          ? 'Top traditional Picanterías: La Nueva Palomino (Yanahuara), La Capitana (Paucarpata), and Chicha by Gastón Acurio (Cercado). Must try: Rocoto Relleno and Chupe de Camarones.'
          : 'Picanterías recomendadas: La Nueva Palomino en Yanahuara, La Capitana en Paucarpata y Chicha por Gastón Acurio en el Cercado. Platos imperdibles: Rocoto Relleno, Adobo de Domingo y Chupe de Camarones.'
      } else {
        reply = language === 'en'
          ? `Thank you for your question. Arequipa360° offers verified official data on over 20 attractions, traditional food, and 24/7 tourism assistance.`
          : `Gracias por tu consulta. En Arequipa360° cuentas con inventarios oficiales verificados por DIRCETUR y MINCETUR, mapa interactivo y señalética digital por código QR en los principales monumentos.`
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
      setLoading(false)
    }, 700)
  }

  return (
    <>
      {/* Botón flotante Asistente AI - Ubicado arriba del botón QR para evitar colisión con AccessibilityBar */}
      <div className="fixed bottom-20 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          title="Asistente de Viaje Inteligente Gemini AI"
          className="bg-tafa-dark hover:bg-black text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-white/20"
        >
          <Bot className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Asistente AI</span>
        </button>
      </div>

      {/* Ventana de Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-tafa-dark border border-white/20 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[520px] text-white animate-scale-up">

          {/* Chat Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm font-outfit flex items-center gap-1.5">
                  Asistente AI Arequipa360°
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-gray-400">Gemini 3.6 Flash · Multilingüe</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Configurar Gemini API Key"
                className="text-gray-400 hover:text-amber-400 p-1"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Configuración de API Key si activa */}
          {showKeyInput && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-xs space-y-2">
              <div className="font-semibold text-amber-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Clave API de Gemini (Opcional):
              </div>
              <input
                type="password"
                placeholder="Pega tu Gemini API Key aquí..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
          )}

          {/* Selector de Idioma */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Idioma:
            </span>
            <div className="flex gap-1">
              {(['es', 'en', 'fr', 'de'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded-md font-semibold uppercase text-[10px] ${language === lang ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mensajes Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-tafa-volcán text-white rounded-br-none' : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="block text-[9px] text-gray-400 text-right mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-amber-400 text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generando sugerencia de viaje...</span>
              </div>
            )}
          </div>

          {/* Sugerencias Rápidas */}
          <div className="p-2 bg-black/30 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('¿Qué itinerario me recomiendas para 3 días?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Itinerario 3 días
            </button>
            <button
              onClick={() => handleSend('¿Qué lugares son accesibles para silla de ruedas?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Rutas Accesibles
            </button>
            <button
              onClick={() => handleSend('¿Qué picanterías tradicionales debo visitar?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Picanterías
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pregunta a la AI sobre Arequipa..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  )
}
