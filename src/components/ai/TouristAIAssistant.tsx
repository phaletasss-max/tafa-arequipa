import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, Send, X, Globe, Sparkles, User, RefreshCw, Key, PhoneCall } from 'lucide-react'
import { useFocusTrap } from '@/features/accessibility/hooks/useFocusTrap'
import { MOCK_LUGARES, MOCK_GASTRONOMIA } from '@/data/mockData'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  actionUrl?: string
}

// System DB context payload for Gemini AI
const DB_CONTEXT = `
DATOS OFICIALES DE AREQUIPA (BASE DE DATOS TAFA):
RUTAS Y ATRACTIVOS:
${MOCK_LUGARES.map(l => `- ${l.nombre} (${l.distrito}, ${l.categoria}): ${l.descripcion}. Horario: ${l.horario}. Tarifa: ${l.precio_entrada}. Fuente: ${l.fuente}`).join('\n')}

GASTRONOMÍA Y PICANTERÍAS:
${MOCK_GASTRONOMIA.map(g => `- ${g.nombre} (${g.distrito}, ${g.tipo}): ${g.descripcion}. Ubicación: ${g.ubicacion}. Rango: ${g.precio_rango}`).join('\n')}

PROYECTOS REGIONALES 2026:
- Andagua, Toro Muerto, Cotahuasi, Pillones, Puerto Inka, Quilca, Salinas, Choqolaqa, Uzuña, Culebrillas.

RESERVAS Y CONTACTO ÚNICO OFICIAL:
Todas las reservaciones, tours y atención por WhatsApp se realizan directamente al número oficial: +51 921 378 349 (WhatsApp: https://wa.me/51921378349).
`

export default function TouristAIAssistant() {
  const { t } = useTranslation(['common', 'forms', 'modals'])
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('AQ.Ab8RN6KDcnN1xKp1jaom9qxdE6_zT1itZ9na3qe7amMLQkot7g')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [language, setLanguage] = useState<'es' | 'en' | 'fr' | 'de'>('es')
  const [inputMsg, setInputMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: t('modals:ai_welcome_message'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const chatInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  // Focus trap for the chat modal
  const focusTrapRef = useFocusTrap({
    isOpen,
    onClose: () => setIsOpen(false),
    initialFocusRef: chatInputRef as React.RefObject<HTMLElement>,
  })

  // Auto-scroll to latest message and announce to screen readers
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

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    if (!customText) setInputMsg('')
    setLoading(true)

    // Consulta real a la API de Gemini con context de la base de datos
    if (apiKey.trim()) {
      try {
        const promptText = `
${DB_CONTEXT}

Rol: Eres la Inteligencia Artificial experta en turismo de Arequipa (TAFA AI). Responde de forma concisa (máximo 3 párrafos), clara y hospitalaria en idioma ${language}. Utiliza ÚNICAMENTE datos reales de la base de datos arriba compartida. Si el usuario pregunta por reservas o teléfonos, indícale que toda reserva se gestiona vía WhatsApp al 921 378 349.

Pregunta del usuario: ${query}
`
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }]
          })
        })
        const data = await res.json()
        const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || t('modals:ai_fallback_message')
        
        const isBookingRelated = query.toLowerCase().includes('reser') || query.toLowerCase().includes('tour') || query.toLowerCase().includes('contacto') || query.toLowerCase().includes('precio')

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionUrl: isBookingRelated ? 'https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20reservar%20una%20experiencia/visita.' : undefined,
        }])
        setLoading(false)
        return
      } catch (e) {
        console.warn('Error en llamada a Gemini API, usando respuesta contextual con DB:', e)
      }
    }

    // Respuestas contextuales basadas en la base de datos
    setTimeout(() => {
      let reply = ''
      const q = query.toLowerCase()

      if (q.includes('reser') || q.includes('tour') || q.includes('contacto') || q.includes('whatsapp')) {
        reply = t('modals:ai_booking_reply')
      } else if (q.includes('días') || q.includes('itinerario') || q.includes('dias') || q.includes('rutas')) {
        reply = t('modals:ai_itinerary_reply')
      } else {
        reply = t('modals:ai_catalog_reply')
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionUrl: 'https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20informacion%20o%20reservar.'
      }])
      setLoading(false)
    }, 600)
  }

  return (
    <>
      {/* Botón flotante Asistente AI - Ubicado arriba del botón QR para evitar colisión con AccessibilityBar */}
      <div className="fixed bottom-20 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          title={t('modals:ai_assistant_title')}
          aria-label={t('modals:ai_assistant_title')}
          aria-haspopup="dialog"
          className="bg-tafa-dark hover:bg-black text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-white/20"
        >
          <Bot className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">{t('common:ai_assistant')}</span>
        </button>
      </div>

      {/* Ventana de Chat Modal */}
      {isOpen && (
        <div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('modals:ai_chat_title')}
          className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-tafa-dark border border-white/20 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[520px] text-white animate-scale-up"
          tabIndex={-1}
        >

          {/* Chat Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm font-outfit flex items-center gap-1.5">
                  {t('modals:ai_chat_title')}
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-gray-400">{t('modals:ai_chat_subtitle')}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                title={t('modals:configure_api_key')}
                aria-label={t('modals:configure_api_key')}
                aria-expanded={showKeyInput}
                className="text-gray-400 hover:text-amber-400 p-1"
              >
                <Key className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t('common:cancel')}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Configuración de API Key si activa */}
          {showKeyInput && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-xs space-y-2">
              <div className="font-semibold text-amber-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> {t('modals:gemini_api_key_label')}
              </div>
              <input
                type="password"
                placeholder={t('modals:gemini_api_key_placeholder')}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
          )}

          {/* Selector de Idioma */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> {t('modals:language_label')}:
            </span>
            <div className="flex gap-1">
              {(['es', 'en', 'fr', 'de'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  aria-pressed={language === lang}
                  aria-label={`${lang.toUpperCase()}`}
                  className={`px-2 py-0.5 rounded-md font-semibold uppercase text-[10px] ${language === lang ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Screen reader live announcer for new AI messages */}
          <div
            ref={announcerRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
          />

          {/* Mensajes Chat Body */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 text-xs"
            role="log"
            aria-label={t('modals:ai_chat_title')}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30" aria-hidden="true">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-tafa-volcán text-white rounded-br-none' : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('modals:book_whatsapp_cta')}
                      className="mt-2.5 inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-black font-bold px-3 py-1.5 rounded-full text-[11px] no-underline shadow-md transition-transform hover:scale-105"
                    >
                      <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                      {t('modals:book_whatsapp_cta')}
                    </a>
                  )}
                  <span className="block text-[9px] text-gray-400 text-right mt-1" aria-hidden="true">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-amber-400 text-xs p-2" role="status" aria-live="assertive">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>{t('modals:generating_trip_suggestion')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas */}
          <div className="p-2 bg-black/30 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('¿Qué itinerario me recomiendas para 3 días?')}
              aria-label={t('modals:quick_prompt_itinerary')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_itinerary')}
            </button>
            <button
              onClick={() => handleSend('¿Qué lugares son accesibles para silla de ruedas?')}
              aria-label={t('modals:quick_prompt_accessible')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_accessible')}
            </button>
            <button
              onClick={() => handleSend('¿Qué picanterías tradicionales debo visitar?')}
              aria-label={t('modals:quick_prompt_gastronomy')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_gastronomy')}
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
            role="search"
          >
            <label htmlFor="tafa-ai-chat-input" className="sr-only">
              {t('modals:direct_ai_input_placeholder')}
            </label>
            <input
              ref={chatInputRef}
              id="tafa-ai-chat-input"
              type="text"
              placeholder="Pregunta a la AI sobre Arequipa..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              aria-autocomplete="none"
              className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              aria-label={t('modals:send_message')}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

        </div>
      )}
    </>
  )
}
