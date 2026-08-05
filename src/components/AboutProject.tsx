import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Database, ShieldCheck, Cpu, Users } from 'lucide-react'

export default function AboutProject() {
  const { t } = useTranslation(['common'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const pillars = [
    {
      icon: Database,
      title: 'Centralización de Datos',
      desc: 'Integramos inventarios oficiales de MINCETUR, DIRCETUR Arequipa, AUTOCOLCA e INEI en un único repositorio sin duplicidad.',
    },
    {
      icon: ShieldCheck,
      title: 'Información Verificada',
      desc: 'Diferenciamos fuentes gubernamentales verificadas de aportes comunitarios con moderación transparente y RLS por rol.',
    },
    {
      icon: Cpu,
      title: 'Tecnología Inteligente',
      desc: 'Infraestructura modular preparada para PostGIS, mapas de calor, analítica de flujo turístico e integración con Supabase.',
    },
    {
      icon: Users,
      title: 'Protección de Datos (Ley 29733)',
      desc: 'Toda encuesta e indicador recolectado se anonimiza automáticamente respetando la privacidad del turista.',
    },
  ]

  return (
    <section id="sobre-proyecto" className="bg-[#fafafa] py-32 px-6 border-t border-black/5" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-tafa-volcán/10 text-tafa-volcán px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
          >
            🏛️ {t('common:about_project_badge')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl md:text-5xl font-bold text-tafa-text tracking-tight leading-tight mb-6"
          >
            {t('common:about_project_title_part1')}{' '}
            <span style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('common:about_project_title_highlight')}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-tafa-muted text-lg leading-relaxed"
          >
            {t('common:about_project_description')}
          </motion.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              className="bg-white p-7 rounded-[28px] border border-black/8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-tafa-volcán/10 text-tafa-volcán flex items-center justify-center mb-5 group-hover:bg-tafa-volcán group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-lg text-tafa-text mb-2">{title}</h3>
              <p className="text-tafa-muted text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* El banner con enlaces a http://localhost:3000/admin.html y /api/health se
            retiró: apuntaba a un backend que no existe en este repositorio y en
            producción habría quedado como dos enlaces muertos. */}

      </div>
    </section>
  )
}
