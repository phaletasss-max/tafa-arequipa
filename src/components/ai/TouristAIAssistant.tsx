import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, Send, X, Globe, Sparkles, User, RefreshCw, Key, PhoneCall, Compass, ShieldCheck, MapPin, Utensils } from 'lucide-react'
import { useFocusTrap } from '@/features/accessibility/hooks/useFocusTrap'
import { MOCK_LUGARES, MOCK_GASTRONOMIA } from '@/data/mockData'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  actionUrl?: string
}

// System Knowledge Base Context for Gemini AI
const DB_CONTEXT = `
SISTEMA DE INFORMACIÓN TURÍSTICA OFICIAL — TAFA AREQUIPA 2026:

1. CATÁLOGO REGIONAL DE ATRACTIVOS OFICIALES (MINCETUR / DIRCETUR):
${MOCK_LUGARES.map(l => `- ${l.nombre} (${l.distrito}, Categoría: ${l.categoria}): ${l.descripcion}. Horario oficial: ${l.horario}. Tarifa de ingreso: ${l.precio_entrada}. Fuente verificada: ${l.fuente}`).join('\n')}

2. GASTRONOMÍA & PICANTERÍAS TRADICIONALES ALIADAS:
${MOCK_GASTRONOMIA.map(g => `- ${g.nombre} (${g.distrito}, ${g.tipo}): ${g.descripcion}. Ubicación: ${g.ubicacion}. Rango de precios: ${g.precio_rango}`).join('\n')}

3. RUTA DEL SILLAR Y PROYECTOS ESTRATÉGICOS:
- Ruta del Sillar (Añashuayco, Cerro Colorado): Canteras activas con esculpido a mano en sillar volcánico.
- Petroglifos de Toro Muerto (Corire, Castilla): Más de 5,000 bloques volcánicos con arte rupestre pre-Inca.
- Valle de los Volcanes de Andagua (Castilla): Más de 80 conitos volcánicos extintos. Geoparque UNESCO.
- Cañón del Cotahuasi (La Unión): El cañón más profundo de la tierra (3,535 m).

4. PUNTOS TAFA & CÓDIGOS QR:
- Cada visita a un atractivo o picantería aliada validada mediante código QR en el local otorga +50 PUNTOS TAFA a la cuenta del turista.

5. ATENCIÓN Y RESERVAS OFICIALES:
- Todas las reservas de visitas, tours o picanterías se atienden por WhatsApp al +51 921 378 349 (https://wa.me/51921378349).
`

export default function TouristAIAssistant() {
  const { t, i18n } = useTranslation(['common', 'forms', 'modals'])
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [inputMsg, setInputMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '¡Hola! Soy TAFA AI, tu asistente experto e inteligente en Arequipa. Puedo ayudarte con itinerarios de 1 a 3 días, recomendaciones de picanterías tradicionales, rutas del sillar, accesibilidad y puntos QR.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const chatInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  const focusTrapRef = useFocusTrap({
    isOpen,
    onClose: () => setIsOpen(false),
    initialFocusRef: chatInputRef as React.RefObject<HTMLElement>,
  })

  // Permite abrir el asistente desde otras secciones (p. ej. el CTA "Asistente
  // IA" del hero, que antes saltaba a una sección mock ya retirada).
  useEffect(() => {
    const abrir = () => setIsOpen(true)
    window.addEventListener('tafa_open_ai', abrir)
    return () => window.removeEventListener('tafa_open_ai', abrir)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 1) {
      const last = messages[messages.length - 1]
      if (last.sender === 'ai' && announcerRef.current) {
        announcerRef.current.textContent = last.text
      }
    }
  }, [messages])

  async function handleSend(customText?: string) {
    const query = customText || inputMsg
    if (!query.trim()) return

    const currentLang = (i18n.language || 'es').toLowerCase()

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    if (!customText) setInputMsg('')
    setLoading(true)

    // Intento 1: Consulta a la API de Gemini 1.5 Flash
    const effectiveKey = apiKey.trim()
    if (effectiveKey) {
      try {
        const promptText = `
${DB_CONTEXT}

Rol: Eres la Inteligencia Artificial turística oficial de Arequipa (TAFA AI). Responde de forma servicial, hospitalaria, clara y estructurada en idioma ${currentLang}.
Utiliza la información del contexto arriba proporcionado. Responde detalladamente en 2 o 3 párrafos cortos. Si la pregunta involucra reservas o itinerarios, menciona que pueden escribir al WhatsApp oficial +51 921 378 349.

Pregunta del turista: ${query}
`
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        })
        const data = await res.json()
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (aiText) {
          const isBooking = query.toLowerCase().includes('reser') || query.toLowerCase().includes('tour') || query.toLowerCase().includes('contacto') || query.toLowerCase().includes('whatsapp')
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionUrl: isBooking ? 'https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20consultar%20experiencias%20tur%C3%ADsticas.' : undefined,
          }])
          setLoading(false)
          return
        }
      } catch (e) {
        console.warn('Error llamando a Gemini API:', e)
      }
    }

    // Motor Inteligente de Respuesta Local (NLP Patterns)
    setTimeout(() => {
      let reply = ''
      const q = query.toLowerCase()

      if (q.includes('días') || q.includes('dias') || q.includes('itinerario') || q.includes('recomiend')) {
        reply = `Te sugiero este itinerario recomendado para explorar Arequipa:\n\n• Día 1: Centro Histórico — Plaza de Armas, Basílica Catedral y Monasterio de Santa Catalina. Almuerzo en picantería tradicional de Yanahuara (Rocoto Relleno).\n• Día 2: Ruta del Sillar en Añashuayco (Cerro Colorado) y Mirador de Yanahuara al atardecer.\n• Día 3: Excursión al Cañón del Colca (Mirador Cruz del Cóndor) para avistar el vuelo del cóndor andino.`
      } else if (q.includes('picanter') || q.includes('comida') || q.includes('gastronom') || q.includes('comer') || q.includes('plato')) {
        reply = `En Arequipa la gastronomía es Patrimonio Cultural. Te recomiendo visitar:\n\n1. La Nueva Palomino (Yanahuara): Picantería tradicional (Rocoto Relleno, Chicha de Jora, Chupe de Camarones).\n2. Sol de Mayo (Yanahuara): Fundado en 1903 con amplios jardines y platos típicos.\n3. La Lucila (Sachaca): Picantería ancestral con cocina a la leña y cuy chactado.`
      } else if (q.includes('accesib') || q.includes('silla') || q.includes('discapacidad')) {
        reply = `Arequipa cuenta con atractivos con buena accesibilidad física:\n\n• Plaza de Armas y arquerías: Rampas planas y piso de granito nivelado.\n• Monasterio de Santa Catalina: Calles principales de piedra accesibles y personal de asistencia.\n• Centro Interpretativo Mundo Alpaca: Instalaciones de un solo nivel adaptadas.`
      } else if (q.includes('puntos') || q.includes('qr') || q.includes('ganar')) {
        reply = `¡En TAFA ganas +50 PUNTOS por cada atractivo o picantería aliada que visites! Solo debes escanear el código QR instalado físicamente en el local y confirmar tu asistencia desde tu celular.`
      } else if (q.includes('reser') || q.includes('tour') || q.includes('whatsapp') || q.includes('contacto')) {
        reply = `Para reservar tours oficiales, guiados o solicitar atención personalizada, puedes comunicarte directamente con nuestro centro oficial vía WhatsApp al +51 921 378 349.`
      } else {
        reply = `Arequipa ofrece patrimonio histórico único construido en sillar volcánico blanco, el imponente Cañón del Colca, la Ruta del Sillar en Añashuayco y una gastronomía de renombre internacional. ¿Deseas consultar sobre algún lugar específico como la Catedral, Santa Catalina o la gastronomía?`
      }

      const isBooking = q.includes('reser') || q.includes('tour') || q.includes('contacto') || q.includes('whatsapp')

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionUrl: isBooking ? 'https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20consultar%20experiencias.' : undefined,
      }])
      setLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Botón Flotante Asistente AI TAFA */}
      <div className="fixed bottom-20 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          title="Abrir Asistente AI Arequipa"
          aria-label="Abrir Asistente AI Arequipa"
          className="bg-tafa-dark hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-amber-400/40"
        >
          <Bot className="w-5 h-5 text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">Asistente AI Arequipa</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Ventana Modal del Asistente IA */}
      {isOpen && (
        <div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label="Asistente IA de Turismo Arequipa"
          className="fixed bottom-24 left-6 z-50 w-[400px] max-w-[calc(100vw-48px)] bg-slate-900 border border-white/20 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[540px] text-white animate-scale-up"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/40">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-sm font-outfit flex items-center gap-1.5 text-white">
                  TAFA AI — Guía de Arequipa
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-gray-400">Inteligencia Turística Oficial</div>
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

          {/* Configuración opcional de Gemini API Key */}
          {showKeyInput && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-xs space-y-2">
              <div className="font-semibold text-amber-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Clave Gemini API (Opcional)
              </div>
              <input
                type="password"
                placeholder="Pega tu API Key de Google Gemini..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Chat Messages Log */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 text-xs"
            role="log"
          >
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
                <div className={`max-w-[82%] p-3.5 rounded-2xl ${msg.sender === 'user' ? 'bg-tafa-volcán text-white rounded-br-none font-medium' : 'bg-white/10 text-gray-100 border border-white/10 rounded-bl-none'}`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-full text-[11px] no-underline shadow-md transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-white" />
                      <span>Contactar WhatsApp (+51 921 378 349)</span>
                    </a>
                  )}
                  <span className="block text-[9px] text-gray-400 text-right mt-1.5">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-amber-400 text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generando respuesta inteligente sobre Arequipa...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas de Preguntas */}
          <div className="p-2 bg-black/40 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('¿Qué itinerario me recomiendas para 3 días en Arequipa?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full whitespace-nowrap border border-white/10"
            >
              🗓️ Itinerario 3 Días
            </button>
            <button
              onClick={() => handleSend('¿Qué picanterías tradicionales debo visitar?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full whitespace-nowrap border border-white/10"
            >
              🥘 Gastronomía
            </button>
            <button
              onClick={() => handleSend('¿Cómo gano puntos con los códigos QR?')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full whitespace-nowrap border border-white/10"
            >
              ⭐ Puntos QR
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
          >
            <input
              ref={chatInputRef}
              type="text"
              placeholder="Pregunta sobre lugares, rutas, comida o puntos..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-black/60 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400 placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black p-2.5 rounded-2xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
