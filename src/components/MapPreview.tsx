import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Layers, Navigation, Info, ExternalLink } from 'lucide-react'
import { fetchDashboard, Lugar, Gastronomia } from '@/services/api'

export default function MapPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [lugares, setLugares] = useState<Lugar[]>([])
  const [gastro, setGastro] = useState<Gastronomia[]>([])
  const [selectedItem, setSelectedItem] = useState<{ nombre: string; cat: string; distrito?: string; lat: number; lng: number } | null>(null)
  const [showGastro, setShowGastro] = useState(true)
  const [showLugares, setShowLugares] = useState(true)

  useEffect(() => {
    fetchDashboard()
      .then(data => {
        setLugares(data.lugares_mapa || [])
        setGastro(data.gastro_mapa || [])
      })
      .catch(console.error)
  }, [])

  // Normalizar coordenadas lat/lng a % relativo dentro del contenedor de mapa de Arequipa
  // Arequipa bounds approx: lat [-16.48 a -16.35], lng [-71.58 a -71.48]
  const minLat = -16.48, maxLat = -16.35
  const minLng = -71.58, maxLng = -71.48

  const getPosition = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 }
    const x = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 8), 92)
    const y = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 8), 92)
    return { x, y }
  }

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
                Mapa Interactivo Real-time
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
              Visualiza los puntos reales geolocalizados en Arequipa directamente desde la base de datos local SQLite.
            </motion.p>

            {/* Layer toggles */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              <div
                onClick={() => setShowLugares(!showLugares)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  showLugares ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-tafa-volcán" />
                  <span className="font-medium text-sm">Lugares Turísticos</span>
                </div>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-semibold">{lugares.length} puntos</span>
              </div>

              <div
                onClick={() => setShowGastro(!showGastro)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  showGastro ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-tafa-oro" />
                  <span className="font-medium text-sm">Gastronomía & Picanterías</span>
                </div>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-semibold">{gastro.length} registros</span>
              </div>
            </motion.div>

            <motion.a
              href="http://localhost:3000/mapa.html"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-tafa-cielo text-white border-none
                         cursor-pointer font-outfit text-[15px] font-medium uppercase
                         tracking-[0.04em] px-6 py-3.5 rounded-full transition-all
                         hover:bg-[#2471a3] active:scale-95 no-underline"
            >
              <Navigation className="w-4 h-4" />
              Abrir vista mapa completo Leaflet
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </motion.a>
          </div>

          {/* Right: mock interactive map view */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-[32px] overflow-hidden border border-white/15 shadow-2xl"
              style={{ height: '460px', background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)' }}
            >
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <g key={i}>
                    <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="0.5" />
                    <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#fff" strokeWidth="0.5" />
                  </g>
                ))}
              </svg>

              {/* Lugares Pins */}
              {showLugares && lugares.map((l) => {
                const pos = getPosition(l.lat, l.lng)
                return (
                  <div
                    key={`lugar-${l.id}`}
                    onClick={() => setSelectedItem({ nombre: l.nombre, cat: l.categoria, distrito: l.distrito, lat: l.lat, lng: l.lng })}
                    className="absolute group cursor-pointer transition-transform hover:scale-125 z-10"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-tafa-volcán border-2 border-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 shadow-xl pointer-events-none">
                      {l.nombre} ({l.categoria})
                    </div>
                  </div>
                )
              })}

              {/* Gastro Pins */}
              {showGastro && gastro.map((g) => {
                const pos = getPosition(g.lat, g.lng)
                return (
                  <div
                    key={`gastro-${g.id}`}
                    onClick={() => setSelectedItem({ nombre: g.nombre, cat: g.tipo, distrito: g.distrito, lat: g.lat, lng: g.lng })}
                    className="absolute group cursor-pointer transition-transform hover:scale-125 z-10"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-tafa-oro border-2 border-white flex items-center justify-center shadow-lg">
                      <span className="text-xs">🍲</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 shadow-xl pointer-events-none">
                      {g.nombre} ({g.tipo})
                    </div>
                  </div>
                )
              })}

              {/* Live Status indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5 z-20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">Conectado API SQLite</span>
              </div>

              {/* Selected Pin Info Card Overlay */}
              {selectedItem && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white z-20 animate-fade-in flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-tafa-cielo uppercase tracking-wider mb-0.5">
                      {selectedItem.cat} · {selectedItem.distrito}
                    </div>
                    <div className="font-bold text-sm">{selectedItem.nombre}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Coords: {selectedItem.lat}, {selectedItem.lng}</div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
