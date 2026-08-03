import { useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { fetchDashboard, DashboardResumen } from '@/services/api'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 })
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (inView) motionVal.set(target)
  }, [inView, target, motionVal])

  return <motion.span ref={ref}>{display}</motion.span>
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [dash, setDash] = useState<DashboardResumen | null>(null)

  useEffect(() => {
    fetchDashboard()
      .then(setDash)
      .catch(console.error)
  }, [])

  const statsList = [
    { value: dash?.totales.lugares ?? 21, suffix: '', label: 'Lugares turísticos', sub: 'registrados en SQLite local' },
    { value: dash?.totales.verificados ?? 18, suffix: '', label: 'Verificados', sub: 'oficiales MINCETUR/DIRCETUR' },
    { value: dash?.totales.gastronomia ?? 10, suffix: '', label: 'Registros Gastronomía', sub: 'picanterías y alta cocina' },
    { value: dash?.totales.encuestas ?? 10, suffix: '', label: 'Encuestas recibidas', sub: 'turistas reales y de demo' },
    { value: Math.round((dash?.avg_satisfaccion ?? 4.8) * 20), suffix: '%', label: 'Satisfacción', sub: `${dash?.avg_satisfaccion ?? 4.8} / 5.0 de calificación` },
    { value: 100, suffix: '%', label: 'Protección de Datos', sub: 'conforme a Ley N° 29733' },
  ]

  return (
    <section className="bg-[#0a0a0a] border-y border-white/[0.07] py-24 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-muted">
            Métricas en tiempo real (Live API)
          </span>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {statsList.map(({ value, suffix, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-outfit text-[clamp(36px,5vw,52px)] font-bold text-white
                              leading-none mb-2 tabular-nums">
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-[14px] font-semibold text-white/80 mb-1">{label}</div>
              <div className="text-[11px] text-tafa-muted leading-snug">{sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
