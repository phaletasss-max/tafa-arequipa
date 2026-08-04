import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Puzzle, WifiOff, TrendingDown } from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    color: '#c0392b',
    title: 'Información fragmentada',
    desc: 'Los datos turísticos están dispersos en múltiples organismos sin integración entre sí.',
  },
  {
    icon: WifiOff,
    color: '#2980b9',
    title: 'Sin presencia digital',
    desc: 'La gastronomía local, picanterías y chicherías no tienen visibilidad digital estructurada.',
  },
  {
    icon: Puzzle,
    color: '#27ae60',
    title: 'Ecosistema atomizado',
    desc: 'MYPEs sin capacidad individual de crear paquetes integrados ni invertir en canales digitales.',
  },
  {
    icon: TrendingDown,
    color: '#f39c12',
    title: 'Turista poco informado',
    desc: 'El visitante siente que lo vio todo en 1 día porque la oferta visible se concentra solo en el centro.',
  },
]

export default function Problem() {
  const { t } = useTranslation(['common'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="acerca" className="bg-[#0a0a0a] text-white py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-tafa-volcán" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-volcán">
            {t('common:problem_label')}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-[clamp(32px,4.5vw,56px)] font-medium leading-[1.1]
                     tracking-[-0.03em] max-w-[700px] mb-6"
        >
          {t('common:problem_title_part1')}{' '}
          <span className="text-tafa-muted">{t('common:problem_title_highlight')}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#8b949e] text-xl max-w-[560px] mb-20 leading-relaxed"
        >
          {t('common:problem_description')}
        </motion.p>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i + 0.3 }}
              className="group p-6 rounded-[24px] border border-white/[0.08]
                         bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20
                         transition-all duration-300 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${color}22` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-outfit text-[17px] font-semibold mb-3 text-white">
                {title}
              </h3>
              <p className="text-[#8b949e] text-[14px] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* "Causa raíz" quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 border-l-2 border-tafa-volcán pl-8 max-w-[640px]"
        >
          <p className="text-[22px] font-medium leading-relaxed text-white/80 italic">
            "{t('common:problem_quote')}"
          </p>
          <p className="mt-4 text-sm text-tafa-muted font-medium">
            — {t('common:problem_quote_author')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
