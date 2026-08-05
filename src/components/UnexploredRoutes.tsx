import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Compass, MapPin, ArrowUpRight, ShieldCheck, Sparkles, Eye, CheckCircle2 } from 'lucide-react'

export default function UnexploredRoutes() {
  const { t } = useTranslation(['sections'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeSpot, setActiveSpot] = useState<string | null>(null)

  const regionalProjects = [
    {
      id: 'andagua',
      nombre: t('sections:routes_andagua_nombre'),
      provincia: t('sections:routes_andagua_provincia'),
      distancia: t('sections:routes_andagua_distancia'),
      desc: t('sections:routes_andagua_desc'),
      imagen: '/images/projects/valle-andagua-project.webp',
      tag: t('sections:routes_andagua_tag'),
      pilares: [
        t('sections:routes_andagua_pilar_1'),
        t('sections:routes_andagua_pilar_2'),
        t('sections:routes_andagua_pilar_3'),
      ],
    },
    {
      id: 'toromuerto',
      nombre: t('sections:routes_toromuerto_nombre'),
      provincia: t('sections:routes_toromuerto_provincia'),
      distancia: t('sections:routes_toromuerto_distancia'),
      desc: t('sections:routes_toromuerto_desc'),
      imagen: '/images/projects/toro-muerto-project.webp',
      tag: t('sections:routes_toromuerto_tag'),
      pilares: [
        t('sections:routes_toromuerto_pilar_1'),
        t('sections:routes_toromuerto_pilar_2'),
        t('sections:routes_toromuerto_pilar_3'),
      ],
    },
    {
      id: 'cotahuasi',
      nombre: t('sections:routes_cotahuasi_nombre'),
      provincia: t('sections:routes_cotahuasi_provincia'),
      distancia: t('sections:routes_cotahuasi_distancia'),
      desc: t('sections:routes_cotahuasi_desc'),
      imagen: '/images/projects/cotahuasi-project.webp',
      tag: t('sections:routes_cotahuasi_tag'),
      pilares: [
        t('sections:routes_cotahuasi_pilar_1'),
        t('sections:routes_cotahuasi_pilar_2'),
        t('sections:routes_cotahuasi_pilar_3'),
      ],
    },
    {
      id: 'imata',
      nombre: t('sections:routes_imata_nombre'),
      provincia: t('sections:routes_imata_provincia'),
      distancia: t('sections:routes_imata_distancia'),
      desc: t('sections:routes_imata_desc'),
      imagen: '/images/projects/pillones-project.webp',
      tag: t('sections:routes_imata_tag'),
      pilares: [
        t('sections:routes_imata_pilar_1'),
        t('sections:routes_imata_pilar_2'),
        t('sections:routes_imata_pilar_3'),
      ],
    },
    {
      id: 'puerto-inka',
      nombre: t('sections:routes_puerto_inka_nombre'),
      provincia: t('sections:routes_puerto_inka_provincia'),
      distancia: t('sections:routes_puerto_inka_distancia'),
      desc: t('sections:routes_puerto_inka_desc'),
      imagen: '/images/projects/puerto-inka-project.webp',
      tag: t('sections:routes_puerto_inka_tag'),
      pilares: [
        t('sections:routes_puerto_inka_pilar_1'),
        t('sections:routes_puerto_inka_pilar_2'),
        t('sections:routes_puerto_inka_pilar_3'),
      ],
    },
    {
      id: 'quilca-matarani',
      nombre: t('sections:routes_quilca_matarani_nombre'),
      provincia: t('sections:routes_quilca_matarani_provincia'),
      distancia: t('sections:routes_quilca_matarani_distancia'),
      desc: t('sections:routes_quilca_matarani_desc'),
      imagen: '/images/projects/quilca-matarani-project.webp',
      imagen_url: '/images/projects/quilca-matarani-project.webp',
      tag: t('sections:routes_quilca_matarani_tag'),
      pilares: [
        t('sections:routes_quilca_matarani_pilar_1'),
        t('sections:routes_quilca_matarani_pilar_2'),
        t('sections:routes_quilca_matarani_pilar_3'),
      ],
    },
    {
      id: 'salinas',
      nombre: t('sections:routes_salinas_nombre'),
      provincia: t('sections:routes_salinas_provincia'),
      distancia: t('sections:routes_salinas_distancia'),
      desc: t('sections:routes_salinas_desc'),
      imagen: '/images/projects/salinas-project.webp',
      tag: t('sections:routes_salinas_tag'),
      pilares: [
        t('sections:routes_salinas_pilar_1'),
        t('sections:routes_salinas_pilar_2'),
        t('sections:routes_salinas_pilar_3'),
      ],
    },
    {
      id: 'choqolaqa',
      nombre: t('sections:routes_choqolaqa_nombre'),
      provincia: t('sections:routes_choqolaqa_provincia'),
      distancia: t('sections:routes_choqolaqa_distancia'),
      desc: t('sections:routes_choqolaqa_desc'),
      imagen: '/images/projects/choqolaqa-project.webp',
      tag: t('sections:routes_choqolaqa_tag'),
      pilares: [
        t('sections:routes_choqolaqa_pilar_1'),
        t('sections:routes_choqolaqa_pilar_2'),
        t('sections:routes_choqolaqa_pilar_3'),
      ],
    },
    {
      id: 'uzuna',
      nombre: t('sections:routes_uzuna_nombre'),
      provincia: t('sections:routes_uzuna_provincia'),
      distancia: t('sections:routes_uzuna_distancia'),
      desc: t('sections:routes_uzuna_desc'),
      imagen: '/images/projects/uzuna-project.webp',
      tag: t('sections:routes_uzuna_tag'),
      pilares: [
        t('sections:routes_uzuna_pilar_1'),
        t('sections:routes_uzuna_pilar_2'),
        t('sections:routes_uzuna_pilar_3'),
      ],
    },
    {
      id: 'culebrillas-sillar',
      nombre: t('sections:routes_culebrillas_sillar_nombre'),
      provincia: t('sections:routes_culebrillas_sillar_provincia'),
      distancia: t('sections:routes_culebrillas_sillar_distancia'),
      desc: t('sections:routes_culebrillas_sillar_desc'),
      imagen: '/images/projects/culebrillas-project.webp',
      tag: t('sections:routes_culebrillas_sillar_tag'),
      pilares: [
        t('sections:routes_culebrillas_sillar_pilar_1'),
        t('sections:routes_culebrillas_sillar_pilar_2'),
        t('sections:routes_culebrillas_sillar_pilar_3'),
      ],
    },
  ]

  const selectedSpotData = regionalProjects.find(p => p.id === activeSpot)

  return (
    <section id="inexplorada" className="bg-[#0f141c] text-white py-32 px-6 border-t border-white/10" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Compass className="w-3.5 h-3.5" /> {t('sections:routes_badge')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-[650px]"
            >
              {t('sections:routes_title')}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base max-w-[440px] leading-relaxed"
          >
            {t('sections:routes_subtitle')}
          </motion.p>
        </div>

        {/* Grid de 10 Proyectos Estratégicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionalProjects.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.05 + 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 rounded-[28px] overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={spot.imagen}
                  alt={spot.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f141c] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {spot.tag}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-emerald-300 font-semibold bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {spot.provincia}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-outfit text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {spot.nombre}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed mt-2 line-clamp-2">
                    {spot.desc}
                  </p>
                </div>

                {/* 3 Pilares de Innovación */}
                <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
                  {spot.pilares.map((pilar, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-gray-300 font-medium text-[11px]">
                      <span className="shrink-0">{pilar}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t('sections:routes_project_badge')}
                  </span>
                  <button
                    onClick={() => setActiveSpot(spot.id)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {t('sections:routes_view_plan')} <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de Detalle de Plan de Innovación */}
        {activeSpot && selectedSpotData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#141a24] border border-emerald-500/40 rounded-[32px] max-w-[600px] w-full p-8 space-y-6 text-white relative shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                  {selectedSpotData.tag}
                </span>
                <button
                  onClick={() => setActiveSpot(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-outfit text-2xl font-bold text-white">
                {selectedSpotData.nombre}
              </h3>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <MapPin className="w-4 h-4" /> {selectedSpotData.provincia} · {selectedSpotData.distancia}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedSpotData.desc}
              </p>

              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {t('sections:routes_modal_components_title')}
                </h4>
                <ul className="space-y-2 text-xs text-gray-200">
                  {selectedSpotData.pilares.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveSpot(null)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs uppercase font-bold tracking-wider px-6 py-3 rounded-full transition-all"
                >
                  {t('sections:routes_modal_close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  )
}
