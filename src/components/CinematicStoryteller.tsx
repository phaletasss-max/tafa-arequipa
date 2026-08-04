import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, MapPin, Play, Pause, Sparkles } from 'lucide-react'

const chapters = [
  {
    id: 1,
    title: 'Plaza de Armas y Basílica Catedrática',
    subtitle: 'Corazón del Centro Histórico de Arequipa',
    desc: 'Construido íntegramente en sillar blanco con su imponente Catedral neoclásica de 70 metros de frente y arquerías de granito sobre el fondo del volcán Misti.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600&auto=format&fit=crop',
    location: 'Plaza de Armas · Cercado de Arequipa',
    tag: 'Patrimonio Cultural UNESCO',
  },
  {
    id: 2,
    title: 'Monasterio de Santa Catalina',
    subtitle: 'Ciudadela Conventual de 1579',
    desc: 'Ciudadela monástica de más de 20,000 m² con claustros pintados en azul añil y rojo terracota, calles de piedra y patios floridos esculpidos en sillar.',
    video: '',
    poster: '/correcion-imagenes/monaterio-santa-catalina.webp',
    location: 'Calle Santa Catalina 301 · Cercado',
    tag: 'Joya Colonial de 1579',
  },
  {
    id: 3,
    title: 'Mirador de Yanahuara',
    subtitle: 'Vista Panorámica a los 3 Volcanes',
    desc: 'Arcos de sillar construidos en el siglo XIX grabados con versos de poetas arequipeños y la vista más famosa hacia el Misti, Chachani y Pichu Pichu.',
    video: '',
    poster: '/correcion-imagenes/mirador-yanahuara.jpg',
    location: 'Plaza de Yanahuara · Yanahuara',
    tag: 'Sillar Volcánico & Mirador',
  },
  {
    id: 4,
    title: 'Ruta del Sillar — Canteras de Añashuayco',
    subtitle: 'Esculpido en Vivo en Piedra Volcánica',
    desc: 'Canteras vivas donde maestros canteros labran la piedra sillar a comba y cincel en megagrabados de roca volcánica y fachadas barrocas a tamaño real.',
    video: '',
    poster: '/correcion-imagenes/ruta-del-sillar.jpg',
    location: 'Quebrada Añashuayco · Cerro Colorado',
    tag: 'Cultura Viva & Canteros',
  },
  {
    id: 5,
    title: 'Cañón del Colca & Cruz del Cóndor',
    subtitle: 'Vuelo del Cóndor Andino en su Hábitat',
    desc: 'Uno de los cañones más profundos del planeta (más de 4,160 m) con planeo de cóndores andinos sobre terrazas y andenes preincas.',
    video: '',
    poster: '/correcion-imagenes/canon-colca-condor.jpg',
    location: 'Mirador Cruz del Cóndor · Caylloma',
    tag: 'Maravilla Natural del Perú',
  },
]

export default function CinematicStoryteller() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play cada 6.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chapters.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const chapter = chapters[currentIndex]

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-[88vh] min-h-[580px] max-h-[850px] bg-black text-white overflow-hidden flex flex-col justify-between p-6 md:p-12">

      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {chapter.id === 1 && chapter.video ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={chapter.poster}
            >
              <source src={chapter.video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={chapter.poster}
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/45 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[900px] mx-auto w-full text-center space-y-5 px-4 my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 bg-black/60 backdrop-blur-md border border-amber-400/30 px-4 py-1.5 rounded-full shadow-lg">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> {chapter.subtitle}
            </div>

            <h1 className="font-outfit text-3xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-2xl">
              {chapter.title}
            </h1>

            <p className="font-outfit text-sm md:text-lg font-normal text-gray-200 leading-relaxed max-w-[680px] mx-auto drop-shadow">
              {chapter.desc}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-emerald-300 font-semibold pt-1">
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {chapter.location}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                {chapter.tag}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => scrollToSection('explorar')}
                className="bg-tafa-volcán hover:bg-tafa-lava text-white text-xs uppercase font-bold tracking-wider px-7 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
              >
                Explorar Atractivos
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('ia-conversacion')}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs uppercase font-semibold tracking-wider px-6 py-3.5 rounded-full backdrop-blur-md transition-all"
              >
                Consultar Asistente AI
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls & Chapter Selector Indicators */}
      <div className="relative z-10 max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + chapters.length) % chapters.length)}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
            title="Capítulo Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % chapters.length)}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
            title="Capítulo Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter Dots Navigation */}
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 overflow-x-auto max-w-[100%]">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-tafa-volcán' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Ver ${c.subtitle}`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
