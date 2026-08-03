import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

const lugares = [
  {
    nombre: 'Monasterio de Santa Catalina',
    categoria: 'Patrimonio',
    distrito: 'Cercado',
    precio: 'S/. 45',
    verificado: true,
    fuente: 'MINCETUR',
    color: '#8e44ad',
    emoji: '🏛️',
  },
  {
    nombre: 'Cañón del Colca',
    categoria: 'Naturaleza',
    distrito: 'Caylloma',
    precio: 'S/. 70',
    verificado: true,
    fuente: 'AUTOCOLCA',
    color: '#27ae60',
    emoji: '🦅',
  },
  {
    nombre: 'La Nueva Palomino',
    categoria: 'Picantería',
    distrito: 'Yanahuara',
    precio: 'S/. 25-60',
    verificado: true,
    fuente: 'Gremio',
    color: '#f39c12',
    emoji: '🍲',
  },
  {
    nombre: 'Volcán Misti',
    categoria: 'Naturaleza',
    distrito: 'Pocsi',
    precio: 'Gratuito',
    verificado: true,
    fuente: 'MINCETUR',
    color: '#c0392b',
    emoji: '🌋',
  },
  {
    nombre: 'Chicha por Gastón Acurio',
    categoria: 'Restaurante',
    distrito: 'Cercado',
    precio: 'S/. 50-120',
    verificado: true,
    fuente: 'Propio',
    color: '#2980b9',
    emoji: '👨‍🍳',
  },
  {
    nombre: 'Cruz del Cóndor',
    categoria: 'Naturaleza',
    distrito: 'Caylloma',
    precio: 'Incluido Colca',
    verificado: true,
    fuente: 'AUTOCOLCA',
    color: '#27ae60',
    emoji: '🦅',
  },
]

export default function Highlights() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="explorar" className="bg-white py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-tafa-volcán" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-volcán">
            Lugares Destacados
          </span>
        </motion.div>

        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-[clamp(28px,3.5vw,48px)] font-medium text-tafa-text
                       leading-[1.1] tracking-[-0.03em] max-w-[500px]"
          >
            Inventario oficial verificado por DIRCETUR
          </motion.h2>
          <motion.button
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[14px] font-semibold text-tafa-volcán hover:underline"
          >
            Ver todos los 21 lugares →
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lugares.map((l, i) => (
            <motion.div
              key={l.nombre}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.07 + 0.2 }}
              whileHover={{ y: -3 }}
              className="group relative p-6 rounded-[20px] border border-black/[0.07]
                         bg-white hover:border-black/15 transition-all duration-300
                         cursor-pointer overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              {/* Color accent top */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]"
                style={{ background: l.color }}
              />

              <div className="flex items-start justify-between mb-4 mt-1">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${l.color}15` }}
                >
                  {l.emoji}
                </div>
                {l.verificado && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#27ae60]">
                    <CheckCircle2 className="w-4 h-4" />
                    Verificado
                  </div>
                )}
              </div>

              <h3 className="font-outfit font-semibold text-[17px] text-tafa-text mb-1 leading-tight">
                {l.nombre}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${l.color}18`, color: l.color }}
                >
                  {l.categoria}
                </span>
                <span className="text-[12px] text-tafa-muted">· {l.distrito}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] text-tafa-andino font-semibold">{l.precio}</span>
                <span className="text-[11px] text-tafa-muted bg-black/5 px-2 py-0.5 rounded-full">
                  {l.fuente}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
