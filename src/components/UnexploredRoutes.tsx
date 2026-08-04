import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Compass, MapPin, ArrowUpRight, ShieldCheck, Sparkles, Eye, CheckCircle2 } from 'lucide-react'

const regionalProjects = [
  {
    id: 'andagua',
    nombre: 'Valle de los Volcanes de Andagua',
    provincia: 'Castilla · Andagua',
    distancia: 'A 7 horas de Arequipa',
    desc: 'Campo volcánico fascinante único en Sudamérica con más de 80 conitos volcánicos extintos de baja altura (de 50 a 300 metros).',
    imagen: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    tag: 'Geoparque UNESCO · Maravilla Geológica',
    pilares: [
      'Vuelos panorámicos sobre conos volcánicos',
      'Miradores de cristal volados sobre lava',
      'Observatorio domo de astroturismo',
    ],
  },
  {
    id: 'toromuerto',
    nombre: 'Petroglifos de Toro Muerto y Valle de Majes',
    provincia: 'Castilla · Corire',
    distancia: 'A 3 horas de Arequipa',
    desc: 'Uno de los campos de arte rupestre más extensos del mundo con más de 5,000 grabados en rocas volcánicas realizados por culturas preincas.',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    tag: 'Arte Rupestre · Arqueología AR 3D',
    pilares: [
      'App de Realidad Aumentada 3D para grabados',
      'Canotaje en río Majes y cuatrimotos',
      'Hoteles boutique en bodegas pisqueras',
    ],
  },
  {
    id: 'cotahuasi',
    nombre: 'Cañón del Cotahuasi',
    provincia: 'La Unión · Cotahuasi',
    distancia: 'A 9 horas de Arequipa',
    desc: 'El cañón más profundo de la tierra (3,535 m). Un santuario virgen de cataratas como Sipia, bosques de puyas Raimondi y aguas termales de Luicho.',
    imagen: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    tag: 'Eco-Aventura · Récord Mundial',
    pilares: [
      'Teleférico panorámico sobre Catarata de Sipia',
      'Complejo termal y spa de lujo en Luicho',
      'Vías de acceso rápido e infraestructura vial',
    ],
  },
  {
    id: 'imata',
    nombre: 'Cataratas de Pillones y Imata',
    provincia: 'Caylloma · San Antonio de Chuca',
    distancia: 'A 2.5 horas de Arequipa',
    desc: 'Impresionante caída de agua rodeada de gigantescas columnas de piedra talladas por la erosión eólica en la meseta andina.',
    imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    tag: 'Eco-Turismo · Formaciones Líticas',
    pilares: [
      'Parador de carretera con calefacción y ropa térmica',
      'Puentes colgantes y pasarelas fotogénicas',
      'Ruta señalizada de trekking inclusivo',
    ],
  },
  {
    id: 'puerto-inka',
    nombre: 'Puerto Inka y Quebrada de la Waca',
    provincia: 'Caravelí · Atiquipa',
    distancia: 'Km 603 Panamericana Sur',
    desc: 'Antiguo puerto Inca donde se extraían mariscos para el Inca en Cusco. Combinación única de costa pacífica y patrimonio Qhapaq Ñan.',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    tag: 'Qhapaq Ñan · Costa Inca',
    pilares: [
      'Puesta en valor del Camino Inca costero',
      'Muelle para deportes náuticos y kayak',
      'Ecolodges sostenibles frente al mar',
    ],
  },
  {
    id: 'quilca-matarani',
    nombre: 'Caleta de Quilca y Puerto Matarani',
    provincia: 'Camaná e Islay',
    distancia: 'A 2 horas de Arequipa',
    desc: 'Bahías históricas con rica biodiversidad marina, acantilados escarpados y gastronomía de pesca fresca del día.',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    tag: 'Biodiversidad Marina & Mar',
    pilares: [
      'Circuito náutico de lobos y pingüinos',
      'Boulevard gastronómico marino en muelle',
      'Ruta guiada de buceo y kayak de cueva',
    ],
  },
  {
    id: 'salinas',
    nombre: 'Laguna y Reserva de Salinas',
    provincia: 'Arequipa · San Juan de Tarucani',
    distancia: 'A 3 horas de Arequipa',
    desc: 'Santuario de flamencos y espejos de sal a más de 4,300 msnm a los pies del volcán Pichu Pichu.',
    imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
    tag: 'Reserva Nacional · Avistamiento',
    pilares: [
      'Miradores camuflados para observación de aves',
      'Glamping de montaña con domos solares',
      'Autobús turístico con salidas fijas',
    ],
  },
  {
    id: 'choqolaqa',
    nombre: 'Bosque de Piedras de Choqolaqa',
    provincia: 'Caylloma · Tisco',
    distancia: 'A 5 horas de Arequipa',
    desc: 'Paisaje surrealista de torres rocosas blancas que simulan una ciudadela antigua petrificada bajo cielos andinos.',
    imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'Ciudadela Lítica · Astroturismo',
    pilares: [
      'Campamento fotográfico y nocturno',
      'Albergues comunales vivenciales en Tisco',
      'Puntos de selfie y miradores integrados',
    ],
  },
  {
    id: 'uzuna',
    nombre: 'Represa de San José de Uzuña',
    provincia: 'Arequipa · Polobaya',
    distancia: 'A 1.5 horas de Arequipa',
    desc: 'Hermoso espejo de agua rodeado de montañas ideal para la práctica de deportes náuticos ecológicos y picnics familiares.',
    imagen: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
    tag: 'Ecoturismo Náutico · Campiña',
    pilares: [
      'Muelle deportivo para kayaks y paddle board',
      'Zona de camping equipada con duchas solares',
      'Patio gastronómico de trucha frita local',
    ],
  },
  {
    id: 'culebrillas-sillar',
    nombre: 'Quebrada de Culebrillas y Canteras',
    provincia: 'Uchumayo / Yura / Cerro Colorado',
    distancia: 'A 45 min del Centro',
    desc: 'Cañones serpenteantes de sillar blanco con petroglifos preincas y canteras vivas donde se extrae la piedra de Arequipa.',
    imagen: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
    tag: 'Sillar Volcánico · Geología Viva',
    pilares: [
      'Centro de interpretación interactivo del sillar',
      'Senderos nocturnos iluminados con proyectores',
      'Talleres de esculpido en vivo para turistas',
    ],
  },
]

export default function UnexploredRoutes() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeSpot, setActiveSpot] = useState<string | null>(null)

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
              <Compass className="w-3.5 h-3.5" /> 10 Proyectos Estratégicos · Innovación Regional Arequipa
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-[650px]"
            >
              Descubre las 10 Rutas e Innovaciones del Turismo Regional
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base max-w-[440px] leading-relaxed"
          >
            Diversificamos la oferta turística de las 8 provincias con tecnología, astroturismo, teleféricos, ecoturismo marino y rutas sostenibles.
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
                    <ShieldCheck className="w-3.5 h-3.5" /> Proyecto TAFA 2026
                  </span>
                  <button
                    onClick={() => setActiveSpot(spot.id)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Ver Plan <ArrowUpRight className="w-4 h-4" />
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
                  <Sparkles className="w-4 h-4" /> Componentes Clave del Proyecto:
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
                  Cerrar Vista
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  )
}

