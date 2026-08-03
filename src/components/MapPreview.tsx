import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Layers, Navigation } from 'lucide-react'

// Mock map pins
const pins = [
  { id: 1, x: 42, y: 35, label: 'Plaza de Armas', cat: 'centro', color: '#c0392b' },
  { id: 2, x: 38, y: 32, label: 'Monasterio', cat: 'patrimonio', color: '#8e44ad' },
  { id: 3, x: 68, y: 18, label: 'Volcán Misti', cat: 'naturaleza', color: '#27ae60' },
  { id: 4, x: 25, y: 55, label: 'La Nueva Palomino', cat: 'gastronomia', color: '#f39c12' },
  { id: 5, x: 55, y: 42, label: 'Mercado San Camilo', cat: 'cultural', color: '#2980b9' },
  { id: 6, x: 72, y: 60, label: 'Catedral', cat: 'patrimonio', color: '#8e44ad' },
  { id: 7, x: 18, y: 28, label: 'Cañón del Colca', cat: 'naturaleza', color: '#27ae60' },
  { id: 8, x: 50, y: 70, label: 'Chicha Restaurante', cat: 'gastronomia', color: '#f39c12' },
]

const layers = [
  { label: 'Lugares turísticos', color: '#c0392b', count: 21 },
  { label: 'Gastronomía', color: '#f39c12', count: 10 },
  { label: 'Eventos', color: '#2980b9', count: 5 },
]

export default function MapPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="mapa" className="bg-[#0a0a0a] py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[2px] bg-tafa-cielo" />
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-cielo">
                Mapa Interactivo
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-[clamp(28px,3.5vw,48px)] font-medium text-white
                         leading-[1.1] tracking-[-0.03em] mb-5"
            >
              Toda Arequipa,{' '}
              <span className="text-tafa-cielo">mapeada y accesible</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#8b949e] text-[17px] leading-relaxed mb-10 max-w-[440px]"
            >
              Visualiza en tiempo real todos los atractivos turísticos, restaurantes
              y eventos. Filtra por categoría, distrito y nivel de verificación.
            </motion.p>

            {/* Layer legend */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {layers.map(({ label, color, count }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" style={{ color }} />
                    <span className="text-white font-medium text-[14px]">{label}</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-white/10 rounded" />
                  <span className="text-[#8b949e] text-[13px]">{count} registros</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 bg-tafa-cielo text-white border-none
                         cursor-pointer font-outfit text-[15px] font-medium uppercase
                         tracking-[0.04em] px-5 py-3.5 rounded-full transition-all
                         hover:bg-[#2471a3] active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              Abrir mapa completo
            </motion.button>
          </div>

          {/* Right: mock map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-[32px] overflow-hidden border border-white/10"
              style={{ height: '440px', background: 'linear-gradient(135deg, #1a2332 0%, #0d1b2a 100%)' }}
            >
              {/* Grid lines simulando mapa */}
              <svg className="absolute inset-0 w-full h-full opacity-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i}>
                    <line x1={`${i * 14.28}%`} y1="0" x2={`${i * 14.28}%`} y2="100%" stroke="#fff" strokeWidth="0.5" />
                    <line x1="0" y1={`${i * 14.28}%`} x2="100%" y2={`${i * 14.28}%`} stroke="#fff" strokeWidth="0.5" />
                  </g>
                ))}
              </svg>

              {/* Carretera simulada */}
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <path d="M 10% 80% Q 35% 50%, 50% 40% Q 65% 30%, 90% 20%" stroke="#4a6fa5" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 5% 40% Q 30% 45%, 55% 42% Q 75% 40%, 90% 55%" stroke="#4a6fa5" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>

              {/* Pins */}
              {pins.map((pin, i) => (
                <motion.div
                  key={pin.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                  className="absolute group cursor-pointer"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center
                               shadow-lg transition-transform group-hover:scale-125"
                    style={{ background: pin.color }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100
                                  transition-opacity bg-white text-tafa-text text-[11px] font-semibold
                                  px-2 py-1 rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
                    {pin.label}
                  </div>
                </motion.div>
              ))}

              {/* Overlay oscuro en borde */}
              <div className="absolute inset-0 rounded-[32px]" style={{
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(10,10,10,0.5) 100%)'
              }} />

              {/* Badge "en vivo" */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm
                              border border-white/20 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-[11px] font-semibold">En vivo · SQLite local</span>
              </div>

              {/* Counter badge */}
              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm
                              border border-white/20 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold text-white">36</div>
                <div className="text-[11px] text-[#8b949e] mt-0.5">puntos mapeados</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
