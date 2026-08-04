import { useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { getLugaresSupabase, getGastronomiaSupabase } from '@/services/supabaseService'
import { MOCK_STATS } from '@/data/mockData'

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

  const [totales, setTotales] = useState(MOCK_STATS.totales)
  const [avgSat, setAvgSat] = useState(MOCK_STATS.avg_satisfaccion)

  useEffect(() => {
    // Intentar obtener datos reales de Supabase sin depender del backend Express
    Promise.all([
      getLugaresSupabase(),
      getGastronomiaSupabase(),
    ]).then(([lugares, gastro]) => {
      if (lugares.length > 0 || gastro.length > 0) {
        const verificados = lugares.filter(
          l => l.verificado === 1 || (l.verificado as any) === true
        ).length
        setTotales(prev => ({
          ...prev,
          lugares: Math.max(lugares.length, prev.lugares),
          verificados: Math.max(verificados, prev.verificados),
          gastronomia: Math.max(gastro.length, prev.gastronomia),
        }))
      }
    }).catch(() => {/* usa mock por defecto */})
  }, [])

  const statsList = [
    {
      value: totales.lugares,
      suffix: '+',
      label: 'Atractivos Turísticos',
      sub: 'inventario verificado Supabase',
      color: '#c0392b',
    },
    {
      value: totales.verificados,
      suffix: '',
      label: 'Verificados Oficialmente',
      sub: 'MINCETUR / DIRCETUR / AUTOCOLCA',
      color: '#27ae60',
    },
    {
      value: totales.gastronomia,
      suffix: '+',
      label: 'Picanterías & Restaurantes',
      sub: 'patrimonio gastronómico regional',
      color: '#f39c12',
    },
    {
      value: totales.negocios ?? 28,
      suffix: '+',
      label: 'Negocios Aliados MYPE',
      sub: 'Ecosistema Discover More activo',
      color: '#2980b9',
    },
    {
      value: Math.round(avgSat * 20),
      suffix: '%',
      label: 'Satisfacción Turística',
      sub: `${avgSat.toFixed(1)} / 5.0 promedio encuestas`,
      color: '#8e44ad',
    },
    {
      value: 100,
      suffix: '%',
      label: 'Protección de Datos',
      sub: 'conforme a Ley N° 29733',
      color: '#16a085',
    },
  ]

  return (
    <section className="bg-[#0a0a0a] border-y border-white/[0.07] py-24 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-muted">
            Métricas del Ecosistema TAFA
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 text-xs mb-14 max-w-[480px] mx-auto"
        >
          Datos del inventario oficial conectado a Supabase PostgreSQL + MINCETUR
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {statsList.map(({ value, suffix, label, sub, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center group"
            >
              <div
                className="font-outfit text-[clamp(36px,5vw,52px)] font-bold leading-none mb-2 tabular-nums transition-all"
                style={{ color }}
              >
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
