import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, MapPin, Compass, Clock, Utensils, Award, Accessibility } from 'lucide-react'

export default function DirectAIConversation() {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; details?: any }>>([
    {
      sender: 'user',
      text: 'I have only two days in Arequipa.',
    },
    {
      sender: 'ai',
      text: 'Here is your optimized 2-day itinerary tailored for Arequipa. Day 1 focuses on the Historic Center and culinary heritage; Day 2 explores the Añashuayco Sillar Quarries and Yanahuara.',
      details: {
        time: '48 Hours Total',
        route: 'Historic Center -> Añashuayco Quarries -> Yanahuara Viewpoint',
        restaurants: 'La Nueva Palomino & Chicha by Gastón Acurio',
        points: '+150 Puntos TAFA Explorer Pass',
        accessibility: 'Wheelchair Accessible & Voice Audio Routes',
      },
    },
  ])

  const [input, setInput] = useState('')

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      let reply = 'TAFA AI has processed your request based on real Supabase regional data.'
      let details: any = null

      const q = userMsg.toLowerCase()
      if (q.includes('vegetarian') || q.includes('food') || q.includes('restaurant')) {
        reply = 'Arequipa traditional gastronomy offers vegetarian options like Solterito de Queso, Pastel de Papa, and Rocoto Relleno filled with local vegetables.'
        details = {
          restaurants: 'La Capitana & La Nueva Palomino',
          points: '+50 Puntos TAFA',
          accessibility: 'Motriz Adaptada',
        }
      } else if (q.includes('wheelchair') || q.includes('accessible')) {
        reply = 'Fully accessible routes with ramps and WCAG 2.1 compliance: Monasterio de Santa Catalina, Plaza de Armas Cathedral, and Añashuayco Quarries.'
        details = {
          accessibility: 'Wheelchair Ramps & Adapted Restrooms',
          points: '+100 Puntos TAFA',
        }
      } else {
        reply = 'TAFA National Ecosystem coordinates your itinerary, verifying official MINCETUR sources and granting Discover More rewards.'
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, details }])
    }, 600)
  }

  return (
    <section id="ia-conversacion" className="bg-[#0f141c] text-white py-28 px-6 border-t border-white/10">
      <div className="max-w-[1000px] mx-auto">

        <div className="text-center max-w-[700px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Bot className="w-4 h-4" /> Direct AI Assistant · TAFA Intelligence
          </div>
          <h2 className="font-outfit text-3xl md:text-5xl font-bold tracking-tight">
            Conversa directamente con TAFA AI
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Sin formularios complejos. Escribe tu tiempo, presupuesto o necesidades y la IA organizará tu mapa, itinerario y puntos.
          </p>
        </div>

        {/* Conversation Body */}
        <div className="bg-tafa-dark border border-white/15 rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed ${m.sender === 'user' ? 'bg-tafa-volcán text-white rounded-br-none' : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'}`}>
                <p className="font-outfit">{m.text}</p>

                {/* Rich Details Card if AI response */}
                {m.details && (
                  <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {m.details.time && (
                      <div className="flex items-center gap-2 text-amber-300 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Clock className="w-4 h-4 shrink-0" /> {m.details.time}
                      </div>
                    )}
                    {m.details.route && (
                      <div className="flex items-center gap-2 text-tafa-cielo font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Compass className="w-4 h-4 shrink-0" /> {m.details.route}
                      </div>
                    )}
                    {m.details.restaurants && (
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Utensils className="w-4 h-4 shrink-0" /> {m.details.restaurants}
                      </div>
                    )}
                    {m.details.points && (
                      <div className="flex items-center gap-2 text-amber-400 font-semibold bg-black/40 p-2.5 rounded-xl">
                        <Award className="w-4 h-4 shrink-0" /> {m.details.points}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pt-2 text-xs">
            <button
              onClick={() => { setInput('I have only two days in Arequipa.'); }}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              I have only two days
            </button>
            <button
              onClick={() => { setInput('Show me wheelchair accessible routes in Yanahuara.'); }}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              Wheelchair accessible routes
            </button>
            <button
              onClick={() => { setInput('Where can I unlock Discover More rewards?'); }}
              className="bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              Discover More rewards
            </button>
          </div>

          {/* Direct Input */}
          <form onSubmit={handleSend} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Type your travel time, budget or requirements (e.g. I have 3 days)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/50 border border-white/20 rounded-full px-5 py-3.5 text-xs md:text-sm text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </section>
  )
}
