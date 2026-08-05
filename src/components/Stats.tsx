import { useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getLugaresSupabase, getGastronomiaSupabase } from '@/services/supabaseService'
import { fetchAlliedBusinesses } from '@/features/partners/partnersService'
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
  const { t } = useTranslation(['sections'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [totales, setTotales] = useState(MOCK_STATS.totales)
  const [aliados, setAliados] = useState<number | null>(null)

  useEffect(() => {
    // Solo se publican cifras que provienen de un conteo real del catálogo.
    Promise.all([
      getLugaresSupabase(),
      getGastronomiaSupabase(),
      fetchAlliedBusinesses(),
    ]).then(([lugares, gastro, socios]) => {
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
      setAliados(socios.length)
    }).catch(() => {/* usa mock por defecto */})
  }, [])

  /**
   * Se retiró la tarjeta "Satisfacción Turística": derivaba de
   * `MOCK_STATS.avg_satisfaccion`, un valor fijo que nunca se actualizaba desde
   * datos reales, pero se rotulaba como "promedio encuestas". No hay encuestas
   * cargadas todavía, así que publicarlo sería inventar una métrica.
   * "Protección de Datos 100%" tampoco es una medición: es un compromiso de
   * cumplimiento y se muestra abajo como sello, no como contador.
   */
  const statsList = [
    {
      value: totales.lugares,
      suffix: '+',
      label: t('sections:stats_atractivos_label'),
      sub: t('sections:stats_atractivos_sub'),
      color: '#c0392b',
    },
    {
      value: totales.verificados,
      suffix: '',
      label: t('sections:stats_verificados_label'),
      sub: t('sections:stats_verificados_sub'),
      color: '#27ae60',
    },
    {
      value: totales.gastronomia,
      suffix: '+',
      label: t('sections:stats_gastronomia_label'),
      sub: t('sections:stats_gastronomia_sub'),
      color: '#f39c12',
    },
    {
      value: aliados ?? 0,
      suffix: '',
      label: t('sections:stats_aliados_label'),
      sub: t('sections:stats_aliados_sub'),
      color: '#2980b9',
    },
  ]

  return (
    <section id="cifras" className="bg-[#0a0a0a] border-y border-white/[0.07] py-24 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-muted">
            {t('sections:stats_label')}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 text-xs mb-14 max-w-[480px] mx-auto"
        >
          {t('sections:stats_description')}
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Compromiso de cumplimiento — no es una métrica medida. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-[11px] text-tafa-muted"
        >
          {t('sections:stats_privacidad_part1')}
          {' '}<strong className="text-white/70">{t('sections:stats_privacidad_ley')}</strong> {t('sections:stats_privacidad_part2')}
        </motion.p>

      </div>
    </section>
  )
}
