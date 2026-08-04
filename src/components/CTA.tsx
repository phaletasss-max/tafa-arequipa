import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-[#0a0a0a] py-32 px-6" ref={ref}>
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-[40px] overflow-hidden text-center px-10 py-20"
          style={{
            background: 'linear-gradient(135deg, #1a0a06 0%, #2c1008 50%, #1a0a06 100%)',
            border: '1px solid rgba(192,57,43,0.25)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(192,57,43,0.25) 0%, transparent 60%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                            rounded-full px-4 py-1.5 text-sm font-medium text-white/70 mb-8">
              🌋 Hackathon Arequipa · 2026
            </div>

            <h2 className="font-outfit text-[clamp(32px,5vw,60px)] font-medium text-white
                           leading-[1.1] tracking-[-0.04em] mb-5">
              Arequipa tiene todo.
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #c0392b, #e74c3c, #f39c12)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                TAFA lo hace accesible.
              </span>
            </h2>

            <p className="text-white/50 text-xl max-w-[480px] mx-auto mb-12 leading-relaxed">
              Únete a la plataforma que centraliza el turismo de la región
              y conecta visitantes con la riqueza auténtica de Arequipa.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href="#explorar"
                className="flex items-center gap-2 bg-tafa-volcán text-white border-none
                           cursor-pointer font-outfit text-[15px] font-semibold uppercase
                           tracking-[0.04em] px-7 py-4 rounded-full transition-all
                           hover:bg-tafa-lava active:scale-95 no-underline"
              >
                Explorar Arequipa
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#ecosistema"
                className="flex items-center gap-2 bg-transparent text-white border border-white/30
                           cursor-pointer font-outfit text-[15px] font-medium uppercase
                           tracking-[0.04em] px-7 py-4 rounded-full transition-all
                           hover:border-white/60 hover:bg-white/10 active:scale-95 no-underline"
              >
                Unirme como Aliado
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
