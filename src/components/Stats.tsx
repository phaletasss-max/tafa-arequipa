import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'

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

const stats = [
  { value: 21, suffix: '+', label: 'Lugares verificados', sub: 'inventario oficial MINCETUR' },
  { value: 10, suffix: '', label: 'Restaurantes mapeados', sub: 'picanterías y fusión' },
  { value: 5,  suffix: '', label: 'Fuentes institucionales', sub: 'DIRCETUR, AUTOCOLCA, INEI, Municipalidad' },
  { value: 8,  suffix: '', label: 'Distritos cubiertos', sub: 'región Arequipa completa' },
  { value: 100, suffix: '%', label: 'Datos anonimizados', sub: 'cumple Ley 29733' },
  { value: 36,  suffix: '+', label: 'Puntos en el mapa', sub: 'lugares + gastronomía' },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-[#0a0a0a] border-y border-white/[0.07] py-24 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-semibold uppercase tracking-[0.12em]
                     text-tafa-muted mb-16"
        >
          Impacto del proyecto en números
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map(({ value, suffix, label, sub }, i) => (
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
