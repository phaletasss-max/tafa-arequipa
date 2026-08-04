import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Map, BarChart3, ClipboardList, ShieldCheck, Database, Globe } from 'lucide-react'

const features = [
  {
    icon: Map,
    color: '#c0392b',
    title: 'Mapa Interactivo',
    desc: 'Visualiza todos los atractivos, restaurantes y eventos de Arequipa geolocalizados en tiempo real con filtros por categoría y distrito.',
    tag: 'Explorar',
  },
  {
    icon: BarChart3,
    color: '#2980b9',
    title: 'Dashboard Analítico',
    desc: 'Métricas de satisfacción, lugares más visitados y estadísticas de turismo para decisores públicos y privados.',
    tag: 'Gestión',
  },
  {
    icon: ClipboardList,
    color: '#27ae60',
    title: 'Encuestas Turistas',
    desc: 'Recolección anónima de datos de satisfacción conforme a la Ley 29733. Retroalimentación directa del visitante.',
    tag: 'Datos',
  },
  {
    icon: ShieldCheck,
    color: '#8e44ad',
    title: 'Contenido Verificado',
    desc: 'Campo "Verificado" distingue fuentes oficiales (MINCETUR, DIRCETUR) de contenido comunitario. Moderación integrada.',
    tag: 'Confianza',
  },
  {
    icon: Database,
    color: '#f39c12',
    title: 'Datos Abiertos',
    desc: 'Integración con MINCETUR, INEI, AUTOCOLCA y Municipalidad. Seed data oficial con 21+ lugares verificados.',
    tag: 'Open Data',
  },
  {
    icon: Globe,
    color: '#16a085',
    title: 'Plataforma Escalable',
    desc: 'Arquitectura SQLite → Supabase/PostGIS. Preparada para consultas geoespaciales y crecimiento a nivel nacional.',
    tag: 'Tecnología',
  },
]

export default function Features() {
  const { t } = useTranslation(['common'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="explorar" className="bg-[#fafafa] py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-tafa-volcán" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-volcán">
            {t('common:services')}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-[clamp(32px,4.5vw,56px)] font-medium leading-[1.1]
                     tracking-[-0.03em] text-tafa-text max-w-[700px] mb-5"
        >
          {t('common:features_title_part1')}{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('common:features_title_highlight')}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-tafa-muted text-xl max-w-[520px] mb-20 leading-relaxed"
        >
          {t('common:features_description')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, desc, tag }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08 + 0.3 }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
              className="group p-7 rounded-[24px] border border-black/[0.07] bg-white
                         cursor-default transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: `${color}15`, color }}
                >
                  {tag}
                </span>
              </div>
              <h3 className="font-outfit text-[18px] font-semibold mb-3 text-tafa-text">
                {title}
              </h3>
              <p className="text-tafa-muted text-[14px] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
