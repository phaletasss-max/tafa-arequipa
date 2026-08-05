import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Layers, Navigation, ExternalLink, Utensils } from 'lucide-react'
import { getLugaresSupabase, getGastronomiaSupabase } from '@/services/supabaseService'
import { MOCK_LUGARES, MOCK_GASTRONOMIA } from '@/data/mockData'
import type { Lugar, Gastronomia } from '@/services/api'

// Arequipa bounds: lat [-16.48 a -16.35], lng [-71.58 a -71.48]
const MIN_LAT = -16.48, MAX_LAT = -16.35
const MIN_LNG = -71.58, MAX_LNG = -71.48

function getPosition(lat?: number, lng?: number) {
  if (!lat || !lng) return { x: 50, y: 50 }
  const x = Math.min(Math.max(((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100, 5), 95)
  const y = Math.min(Math.max((1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100, 5), 95)
  return { x, y }
}

export default function MapPreview() {
  const { t } = useTranslation(['sections'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [lugares, setLugares] = useState<Lugar[]>([])
  const [gastro, setGastro] = useState<Gastronomia[]>([])
  const [selectedItem, setSelectedItem] = useState<{
    nombre: string; cat: string; distrito?: string; lat: number; lng: number
  } | null>(null)
  const [showGastro, setShowGastro] = useState(true)
  const [showLugares, setShowLugares] = useState(true)
  const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock')

  useEffect(() => {
    // Cargar desde Supabase — si falla o está vacío, usar mockData
    Promise.all([
      getLugaresSupabase(),
      getGastronomiaSupabase(),
    ]).then(([lug, gas]) => {
      // Solo usar datos de Supabase si tienen coordenadas válidas en Arequipa
      const lugValidos = lug.filter(l => l.lat && l.lng && l.lat < -15 && l.lat > -17.5)
      const gasValidos = gas.filter(g => g.lat && g.lng && g.lat < -15 && g.lat > -17.5)

      if (lugValidos.length > 0) {
        setLugares(lugValidos)
        setDataSource('supabase')
      } else {
        setLugares(MOCK_LUGARES.filter(l => l.lat && l.lng))
      }

      if (gasValidos.length > 0) {
        setGastro(gasValidos)
      } else {
        setGastro(MOCK_GASTRONOMIA)
      }
    }).catch(() => {
      setLugares(MOCK_LUGARES.filter(l => l.lat && l.lng))
      setGastro(MOCK_GASTRONOMIA)
    })
  }, [])

  // Filtrar sólo los que están dentro del área de visualización del mapa (Arequipa ciudad)
  const lugaresEnMapa = lugares.filter(l => {
    const { x, y } = getPosition(l.lat, l.lng)
    return x > 5 && x < 95 && y > 5 && y < 95
  })
  const gastroEnMapa = gastro.filter(g => {
    const { x, y } = getPosition(g.lat, g.lng)
    return x > 5 && x < 95 && y > 5 && y < 95
  })

  return (
    <section id="mapa" className="bg-[#0a0a0a] py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Texto izquierdo ────────────────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[2px] bg-tafa-cielo" />
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-cielo">
                {t('sections:map_badge')}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-[clamp(28px,3.5vw,48px)] font-medium text-white
                         leading-[1.1] tracking-[-0.03em] mb-5"
            >
              {t('sections:map_title_part1')}{' '}
              <span className="text-tafa-cielo">{t('sections:map_title_highlight')}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#8b949e] text-[17px] leading-relaxed mb-10 max-w-[440px]"
            >
              {t('sections:map_description')}
            </motion.p>

            {/* Layer toggles */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {/* Botones reales, no divs: los toggles deben ser alcanzables por
                  teclado y anunciar su estado a un lector de pantalla. */}
              <button
                type="button"
                onClick={() => setShowLugares(!showLugares)}
                aria-pressed={showLugares}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  showLugares ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-tafa-volcán" aria-hidden="true" />
                  <span className="font-medium text-sm">{t('sections:map_layer_places')}</span>
                </span>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                  {t('sections:map_layer_places_count', { count: lugaresEnMapa.length })}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowGastro(!showGastro)}
                aria-pressed={showGastro}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  showGastro ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-tafa-oro" aria-hidden="true" />
                  <span className="font-medium text-sm">{t('sections:map_layer_food')}</span>
                </span>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                  {t('sections:map_layer_food_count', { count: gastroEnMapa.length })}
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <a
                href="https://www.google.com/maps/search/atractivos+turisticos+Arequipa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-tafa-cielo text-white border-none
                           cursor-pointer font-outfit text-[15px] font-medium uppercase
                           tracking-[0.04em] px-6 py-3.5 rounded-full transition-all
                           hover:bg-[#2471a3] active:scale-95 no-underline"
              >
                <Navigation className="w-4 h-4" />
                {t('sections:map_cta_google')}
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>

              <div className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 ${
                dataSource === 'supabase'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  dataSource === 'supabase' ? 'bg-green-400' : 'bg-amber-400'
                }`} />
                {dataSource === 'supabase' ? t('sections:map_source_remote') : t('sections:map_source_local')}
              </div>
            </motion.div>
          </div>

          {/* ── Mapa interactivo derecho ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-[32px] overflow-hidden border border-white/15 shadow-2xl"
              style={{ height: '480px', background: 'linear-gradient(145deg, #0d1b2a 0%, #1b2d44 50%, #0d2038 100%)' }}
            >
              {/* Grid cartográfico SVG */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i}>
                    <line x1={`${i * 8.33}%`} y1="0" x2={`${i * 8.33}%`} y2="100%" stroke="#4a9edd" strokeWidth="0.4" />
                    <line x1="0" y1={`${i * 8.33}%`} x2="100%" y2={`${i * 8.33}%`} stroke="#4a9edd" strokeWidth="0.4" />
                  </g>
                ))}
              </svg>

              {/* Círculo decorativo — volcan Misti aproximado */}
              <div
                className="absolute pointer-events-none"
                style={{ left: '68%', top: '20%', transform: 'translate(-50%,-50%)' }}
              >
                <div className="w-24 h-24 rounded-full border border-white/5 bg-white/2" />
                <div className="absolute inset-3 rounded-full border border-white/5" />
                <div className="absolute inset-6 rounded-full border border-white/5" />
              </div>

              {/* Pins de lugares turísticos */}
              {showLugares && lugaresEnMapa.map((l) => {
                const pos = getPosition(l.lat, l.lng)
                return (
                  <button
                    key={`lugar-${l.id}`}
                    onClick={() => setSelectedItem({ nombre: l.nombre, cat: l.categoria, distrito: l.distrito, lat: l.lat, lng: l.lng })}
                    className="absolute group cursor-pointer transition-transform hover:scale-125 z-10 focus:outline-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                    title={l.nombre}
                  >
                    <div className="w-7 h-7 rounded-full bg-tafa-volcán border-2 border-white flex items-center justify-center shadow-lg shadow-red-900/40">
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 shadow-xl pointer-events-none z-30">
                      {l.nombre}
                    </div>
                  </button>
                )
              })}

              {/* Pins de gastronomía */}
              {showGastro && gastroEnMapa.map((g) => {
                const pos = getPosition(g.lat, g.lng)
                return (
                  <button
                    key={`gastro-${g.id}`}
                    onClick={() => setSelectedItem({ nombre: g.nombre, cat: g.tipo, distrito: g.distrito, lat: g.lat, lng: g.lng })}
                    className="absolute group cursor-pointer transition-transform hover:scale-125 z-10 focus:outline-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                    title={g.nombre}
                  >
                    <div className="w-6 h-6 rounded-full bg-tafa-oro border-2 border-white flex items-center justify-center shadow-lg shadow-yellow-900/40">
                      <Utensils className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 shadow-xl pointer-events-none z-30">
                      {g.nombre}
                    </div>
                  </button>
                )
              })}

              {/* Label flotante */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5 z-20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">{t('sections:map_location')}</span>
              </div>

              {/* Leyenda */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 z-20">
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <div className="w-3 h-3 rounded-full bg-tafa-volcán border border-white/60" />
                  {t('sections:map_legend_places')}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <div className="w-3 h-3 rounded-full bg-tafa-oro border border-white/60" />
                  {t('sections:map_legend_food')}
                </div>
              </div>

              {/* Card de item seleccionado */}
              {selectedItem && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white z-20 animate-fade-in flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-tafa-cielo uppercase tracking-wider mb-0.5">
                      {selectedItem.cat}{selectedItem.distrito ? ` · ${selectedItem.distrito}` : ''}
                    </div>
                    <div className="font-bold text-sm">{selectedItem.nombre}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                      {selectedItem.lat.toFixed(4)}, {selectedItem.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Stats debajo del mapa */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                // Se cuenta lo que realmente se dibuja: el recorte del mapa deja
                // fuera los destinos provinciales.
                { label: t('sections:map_stat_places'), value: `${lugaresEnMapa.length}`, color: '#c0392b' },
                { label: t('sections:map_stat_food'), value: `${gastro.length}+`, color: '#f39c12' },
                { label: t('sections:map_stat_districts'), value: '23', color: '#2980b9' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="font-outfit font-bold text-lg" style={{ color }}>{value}</div>
                  <div className="text-[11px] text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
