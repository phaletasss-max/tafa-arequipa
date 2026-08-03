import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2 } from 'lucide-react'

const institutions = [
  { name: 'MINCETUR', full: 'Ministerio de Comercio Exterior y Turismo', color: '#c0392b', emoji: '🏛️' },
  { name: 'DIRCETUR', full: 'Dirección Regional de Comercio Exterior y Turismo', color: '#2980b9', emoji: '🏢' },
  { name: 'AUTOCOLCA', full: 'Autoridad del Colca y Anexos', color: '#27ae60', emoji: '🦅' },
  { name: 'INEI', full: 'Instituto Nacional de Estadística e Informática', color: '#f39c12', emoji: '📊' },
  { name: 'Municipalidad', full: 'Municipalidad Provincial de Arequipa', color: '#8e44ad', emoji: '🏗️' },
]

export default function Institutions() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-[#fafafa] py-28 px-6" ref={ref}>
      <div className="max-w-[1000px] mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-tafa-volcán" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-volcán">
            Instituciones
          </span>
          <div className="w-8 h-[2px] bg-tafa-volcán" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-[clamp(24px,3vw,40px)] font-medium text-tafa-text
                     leading-[1.15] tracking-[-0.03em] mb-4"
        >
          Datos respaldados por instituciones oficiales
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-tafa-muted text-[17px] mb-16 max-w-[520px] mx-auto leading-relaxed"
        >
          TAFA centraliza fuentes de datos oficiales del estado peruano para garantizar
          información verificada y confiable.
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {institutions.map(({ name, full, color, emoji }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
              className="flex flex-col items-center gap-3 p-6 rounded-[20px] bg-white
                         border border-black/[0.07] cursor-default transition-all duration-300
                         min-w-[160px]"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${color}15` }}
              >
                {emoji}
              </div>
              <div>
                <div
                  className="font-outfit font-bold text-[17px] mb-0.5"
                  style={{ color }}
                >
                  {name}
                </div>
                <div className="text-[11px] text-tafa-muted leading-snug max-w-[120px]">
                  {full}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota legal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 flex items-center justify-center gap-2 text-[12px] text-tafa-muted"
        >
          <Building2 className="w-4 h-4" />
          <span>
            Datos anonimizados conforme a la{' '}
            <span className="font-semibold text-tafa-text">Ley N° 29733</span>
            {' '}— Ley de Protección de Datos Personales del Perú
          </span>
        </motion.div>
      </div>
    </section>
  )
}
