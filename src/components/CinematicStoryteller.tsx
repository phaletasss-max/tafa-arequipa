import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, MapPin, Play, Pause, Sparkles } from 'lucide-react'

const chapters = [
  {
    id: 1,
    title: 'Bienvenidos a Arequipa',
    subtitle: 'Capítulo I — La Puerta al Sur del Perú',
    desc: 'Rodeada por tres majestuosos volcanes y construida con piedra sillar blanca volcánica, Arequipa abre sus puertas a la cultura, la gastronomía y la historia.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600&auto=format&fit=crop',
    location: 'Plaza de Armas · Cercado',
    tag: 'Patrimonio Cultural UNESCO',
  },
  {
    id: 2,
    title: 'La Ciudad Blanca te espera',
    subtitle: 'Capítulo II — Arquitectura de Sillar y Sol',
    desc: 'Recorre arquerías coloniales, plazas patrimoniales y patios iluminados por el sol tallados por maestros artesanos a lo largo de cuatro siglos.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1600&auto=format&fit=crop',
    location: 'Mirador de Yanahuara & Vista del Misti',
    tag: 'Sillar Volcánico & Vistas',
  },
  {
    id: 3,
    title: 'Descubre miles de petroglifos milenarios',
    subtitle: 'Capítulo III — Arte Rupestre de Toro Muerto',
    desc: 'Más de 5,000 bloques de piedra volcánica grabados que revelan la cosmovisión pre-inca, astronomía y fauna en el valle desértico.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop',
    location: 'Corire · Valle de Majes',
    tag: 'Arqueología Pre-Inca',
  },
  {
    id: 4,
    title: 'Presencia el majestuoso vuelo del Cóndor Andino',
    subtitle: 'Capítulo IV — La Profundidad del Cañón del Colca',
    desc: 'Eleva tu mirada a más de 3,200 metros en uno de los cañones más profundos de la Tierra mientras enormes alas planean sobre las corrientes térmicas.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?q=80&w=1600&auto=format&fit=crop',
    location: 'Cruz del Cóndor · Caylloma',
    tag: 'Maravilla Natural del Perú',
  },
  {
    id: 5,
    title: 'Camina a través de siglos de historia',
    subtitle: 'Capítulo V — Ciudadela Monástica de Santa Catalina',
    desc: 'Una ciudadela amurallada de 20,000 metros cuadrados con pasajes de azul añil y rojo terracota resguardados en el corazón de la ciudad.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1600&auto=format&fit=crop',
    location: 'Monasterio de Santa Catalina · Cercado',
    tag: 'Joya Colonial de 1579',
  },
  {
    id: 6,
    title: 'Naturaleza más allá de la imaginación',
    subtitle: 'Capítulo VI — Reserva Salinas y Aguada Blanca',
    desc: 'Lagunas saladas de gran altitud, vicuñas silvestres y reflejos volcánicos bajo cielos andinos cristalinos.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
    location: 'Santuario Salinas & Vicuñas',
    tag: 'Biodiversidad Altoandina',
  },
  {
    id: 7,
    title: 'Descubre la piedra con la que se construyó Arequipa',
    subtitle: 'Capítulo VII — Canteras Vivas de Añashuayco',
    desc: 'Sé testigo del esculpido artesanal en vivo dentro de canteras de sillar blanco labradas por generaciones de maestros canteros.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop',
    location: 'Ruta del Sillar · Cerro Colorado',
    tag: 'Cultura Viva & Canteros',
  },
  {
    id: 8,
    title: 'Saborea tradiciones reconocidas internacionalmente',
    subtitle: 'Capítulo VIII — Herencia Gastronómica de Picantería',
    desc: 'Rocoto Relleno, Adobo de Domingo y guisos a la leña celebrando insumos regionales y la calidez comunitaria.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop',
    location: 'Yanahuara & Distritos Tradicionales',
    tag: 'Gastronomía Tradicional',
  },
  {
    id: 9,
    title: 'Comienza tu viaje con TAFA',
    subtitle: 'Capítulo IX — Turismo Inteligente e Inclusivo',
    desc: 'Desbloquea experiencias únicas, rutas totalmente accesibles con audio y señalética digital mientras exploras la Ciudad Blanca.',
    video: '/video/caratula.mp4',
    poster: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600&auto=format&fit=crop',
    location: 'Ecosistema Turístico Arequipa',
    tag: 'Accesibilidad WCAG 2.1',
  },
]

export default function CinematicStoryteller() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play cada 6 segundos si no está pausado
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chapters.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isPaused])

  const chapter = chapters[currentIndex]

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-[88vh] min-h-[580px] max-h-[850px] bg-black text-white overflow-hidden flex flex-col justify-between p-6 md:p-12">

      {/* Background Media: Fotografía HD en alta definición para todos los capítulos sin reproducción de video MP4 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={chapter.poster}
            alt={chapter.title}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
          {/* Overlay de gradientes cinemáticos para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/45 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar Header */}
      <div className="relative z-10 max-w-[1200px] mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
          <span className="w-2.5 h-2.5 rounded-full bg-tafa-volcán animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            TAFA Cinematic Storytelling
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
            title={isPaused ? 'Reanudar reproducción automática' : 'Pausar'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <div className="text-xs font-mono bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white">
            {chapter.id} / {chapters.length}
          </div>
        </div>
      </div>

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
