import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Send, Bot, MapPin, Compass, Clock, Utensils, Award, Accessibility } from 'lucide-react'

export default function DirectAIConversation() {
  const { t } = useTranslation(['modals'])
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; details?: any }>>([
    {
      sender: 'user',
      text: t('modals:direct_ai_prompt_example'),
    },
    {
      sender: 'ai',
      text: t('modals:direct_ai_response_example'),
      details: {
        time: t('modals:direct_ai_detail_time'),
        route: t('modals:direct_ai_detail_route'),
        restaurants: t('modals:direct_ai_detail_restaurants'),
        points: t('modals:direct_ai_detail_points'),
        accessibility: t('modals:direct_ai_detail_accessibility'),
      },
    },
  ])

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll and announce new AI messages to screen readers
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 2) {
      const last = messages[messages.length - 1]
      if (last.sender === 'ai' && announcerRef.current) {
        announcerRef.current.textContent = last.text
      }
    }
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      let reply = t('modals:direct_ai_default_reply')
      let details: any = null

      const q = userMsg.toLowerCase()
      if (q.includes('vegetarian') || q.includes('food') || q.includes('restaurant')) {
        reply = t('modals:direct_ai_food_reply')
        details = {
          restaurants: 'La Capitana & La Nueva Palomino',
          points: '+50 Puntos TAFA',
          accessibility: 'Motriz Adaptada',
        }
      } else if (q.includes('wheelchair') || q.includes('accessible')) {
        reply = t('modals:direct_ai_accessibility_reply')
        details = {
          accessibility: 'Wheelchair Ramps & Adapted Restrooms',
          points: '+100 Puntos TAFA',
        }
      } else {
        reply = t('modals:direct_ai_ecosystem_reply')
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, details }])
    }, 600)
  }

  return (
    <section id="ia-conversacion" className="bg-[#0f141c] text-white py-28 px-6 border-t border-white/10">
      <div className="max-w-[1000px] mx-auto">

        <div className="text-center max-w-[700px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Bot className="w-4 h-4" /> {t('modals:direct_ai_badge')}
          </div>
          <h2 className="font-outfit text-3xl md:text-5xl font-bold tracking-tight">
            {t('modals:direct_ai_title')}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            {t('modals:direct_ai_description')}
          </p>
        </div>

        {/* Conversation Body */}
        <div
          className="bg-tafa-dark border border-white/15 rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl"
          role="log"
          aria-label={t('modals:direct_ai_title')}
        >
          {/* Screen reader live announcer */}
          <div
            ref={announcerRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
          />
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed ${m.sender === 'user' ? 'bg-tafa-volcán text-white rounded-br-none' : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'}`}>
                <p className="font-outfit">{m.text}</p>

                {/* Rich Details Card if AI response */}
                {m.details && (
                  <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {m.details.time && (
                      <div className="flex items-center gap-2 text-amber-300 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Clock className="w-4 h-4 shrink-0" aria-hidden="true" /> {m.details.time}
                      </div>
                    )}
                    {m.details.route && (
                      <div className="flex items-center gap-2 text-tafa-cielo font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Compass className="w-4 h-4 shrink-0" aria-hidden="true" /> {m.details.route}
                      </div>
                    )}
                    {m.details.restaurants && (
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Utensils className="w-4 h-4 shrink-0" aria-hidden="true" /> {m.details.restaurants}
                      </div>
                    )}
                    {m.details.points && (
                      <div className="flex items-center gap-2 text-amber-400 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Award className="w-4 h-4 shrink-0" aria-hidden="true" /> {m.details.points}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pt-2 text-xs" role="group" aria-label={t('modals:quick_prompts_group')}>
            <button
              onClick={() => { setInput('I have only two days in Arequipa.'); }}
              aria-label={t('modals:quick_prompt_two_days')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_two_days')}
            </button>
            <button
              onClick={() => { setInput('Show me wheelchair accessible routes in Yanahuara.'); }}
              aria-label={t('modals:quick_prompt_wheelchair')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_wheelchair')}
            </button>
            <button
              onClick={() => { setInput('Where can I unlock Discover More rewards?'); }}
              aria-label={t('modals:quick_prompt_rewards')}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              {t('modals:quick_prompt_rewards')}
            </button>
          </div>

          {/* Direct Input */}
          <form onSubmit={handleSend} className="flex gap-2 pt-2" role="search">
            <label htmlFor="tafa-direct-ai-input" className="sr-only">
              {t('modals:direct_ai_input_placeholder')}
            </label>
            <input
              id="tafa-direct-ai-input"
              type="text"
              placeholder={t('modals:direct_ai_input_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-autocomplete="none"
              className="flex-1 bg-black/50 border border-white/20 rounded-full px-5 py-3.5 text-xs md:text-sm text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              aria-label={t('modals:send_message')}
              className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

      </div>
    </section>
  )
}
