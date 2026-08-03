import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Compass, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react'

const unexploredSpots = [
  {
    id: 'sillar',
    nombre: 'Ruta del Sillar - Canteras de Añashuayco',
    distrito: 'Cerro Colorado',
    distancia: 'A 45 min del Centro Histórico',
    desc: 'Imponentes megalitos de piedra volcánica donde maestros canteros tallan a mano la materia prima con la que se construyó la Ciudad Blanca.',
    imagen: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
    tag: 'Cultura VIVA · Sillar Volcánico',
  },
  {
    id: 'cotahuasi',
    nombre: 'Cañón de Cotahuasi',
    distrito: 'La Unión',
    distancia: 'A 9 horas de Arequipa',
    desc: 'El cañón más profundo de la tierra (3,535 m). Un santuario virgen de cataratas como Sipia, bosques de puyas Raimondi y aguas termales de Luicho.',
    imagen: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    tag: 'Eco-Aventura · Récord Mundial',
  },
  {
    id: 'andagua',
    nombre: 'Valle de los Volcanes de Andagua',
    distrito: 'Andagua',
    distancia: 'A 7 horas de Arequipa',
    desc: 'Campo volcánico fascinante único en Sudamérica con más de 80 conitos volcánicos extintos de baja altura (de 50 a 300 metros).',
    imagen: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    tag: 'Geoparque UNESCO · Maravilla Geológica',
  },
  {
    id: 'toromuerto',
    nombre: 'Petroglifos de Toro Muerto',
    distrito: 'Corire - Castilla',
    distancia: 'A 3 horas de Arequipa',
    desc: 'Uno de los campos de arte rupestre más extensos del mundo con más de 5,000 grabados en rocas volcánicas realizados por culturas preincas.',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    tag: 'Arte Rupestre · Arqueología Preinca',
  },
]

export default function UnexploredRoutes() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="inexplorada" className="bg-[#0f141c] text-white py-32 px-6 border-t border-white/10" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Compass className="w-3.5 h-3.5" /> Arequipa Inexplorada · Combate a la Desinformación
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-[600px]"
            >
              Descubre los tesoros más allá del circuito tradicional
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base max-w-[440px] leading-relaxed"
          >
            Diversificamos la oferta turística regional promocionando rutas sostenibles y poco masificadas para prolongar tu estadía en Arequipa.
          </motion.p>
        </div>

        {/* Grid de Rutas Inexploradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {unexploredSpots.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 + 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={spot.imagen}
                  alt={spot.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f141c] via-transparent to-black/30" />

                <div className="absolute top-4 left-4 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {spot.tag}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5" />
                  {spot.distrito} · {spot.distancia}
                </div>
              </div>

              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-outfit text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {spot.nombre}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mt-2">
                    {spot.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Ruta Sostenible Registrada
                  </span>
                  <a
                    href="#mapa"
                    className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 no-underline"
                  >
                    Ver detalles y ruta <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
