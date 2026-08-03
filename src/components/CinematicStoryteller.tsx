import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowDown, Sparkles, Compass } from 'lucide-react'

const chapters = [
  {
    id: 1,
    title: 'Welcome to Arequipa',
    subtitle: 'Chapter I — The Gateway to Southern Peru',
    desc: 'Surrounded by three majestic volcanoes and built with white volcanic stone, Arequipa opens its gates to culture and history.',
    video: '/video/caratula.mp4',
    location: 'Plaza de Armas',
  },
  {
    id: 2,
    title: 'The White City awaits.',
    subtitle: 'Chapter II — Sillar Architecture & Sunlight',
    desc: 'Walk through colonial arcades, heritage plazas and sunlit courtyards crafted by master artisans over four centuries.',
    video: 'https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4',
    location: 'Misti Volcano & City View',
  },
  {
    id: 3,
    title: 'Discover thousands of ancient petroglyphs.',
    subtitle: 'Chapter III — Toro Muerto Heritage Site',
    desc: 'Over 5,000 carved volcanic boulders revealing pre-Inca worldviews, astronomy and wildlife in the desert valley.',
    video: '/video/caratula.mp4',
    location: 'Corire · Castilla',
  },
  {
    id: 4,
    title: 'Witness the flight of the Andean Condor.',
    subtitle: 'Chapter IV — Colca Canyon Altitude',
    desc: 'Rise above 3,200 meters into one of the deepest canyons on Earth as giant wings glide across the morning thermal currents.',
    video: 'https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4',
    location: 'Cruz del Cóndor · Caylloma',
  },
  {
    id: 5,
    title: 'Walk through centuries of history.',
    subtitle: 'Chapter V — Santa Catalina Citadel',
    desc: 'A 20,000 square meter cloistered citadel of indigo blue and terracotta passages tucked inside the city heart.',
    video: '/video/caratula.mp4',
    location: 'Monasterio de Santa Catalina',
  },
  {
    id: 6,
    title: 'Nature beyond imagination.',
    subtitle: 'Chapter VI — Salinas & Aguada Blanca Reserve',
    desc: 'High-altitude salt lagoons, wild vicuñas and volcanic reflections under crystal clear Andean skies.',
    video: 'https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4',
    location: 'Salinas Salt Flat',
  },
  {
    id: 7,
    title: 'Discover the stone that built the White City.',
    subtitle: 'Chapter VII — Añashuayco Quarries',
    desc: 'Witness live stonemasonry inside white volcanic canyons carved by generations of artisan quarrymen.',
    video: '/video/caratula.mp4',
    location: 'Ruta del Sillar · Cerro Colorado',
  },
  {
    id: 8,
    title: 'Taste traditions recognized around the world.',
    subtitle: 'Chapter VIII — Authentic Picantería Culinary Heritage',
    desc: 'Savory Rocoto Relleno, Sunday Adobo and wood-fired stews celebrating regional ingredients and community warmth.',
    video: 'https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4',
    location: 'Yanahuara & Traditional Districts',
  },
  {
    id: 9,
    title: 'Start your journey.',
    subtitle: 'Chapter IX — Discover More with TAFA',
    desc: 'Unlock unique experiences, accessible routes and rewards while exploring Arequipa.',
    video: '/video/caratula.mp4',
    location: 'TAFA National Ecosystem',
  },
]

export default function CinematicStoryteller() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const idx = Math.min(
        Math.floor(latest * chapters.length),
        chapters.length - 1
      )
      setCurrentChapterIndex(Math.max(0, idx))
    })
  }, [scrollYProgress])

  const chapter = chapters[currentChapterIndex]

  function scrollToAI() {
    const el = document.getElementById('ia-conversacion')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={containerRef} className="relative bg-[#0a0a0a] text-white min-h-[700vh]">
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 md:p-14">

        {/* Dynamic Background Video with Blur & Zoom transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={chapter.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Top Header Controls */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tafa-volcán animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
              TAFA Cinematic Storytelling
            </span>
          </div>

          <div className="text-xs font-mono bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white/90">
            Chapter 0{chapter.id} / 0{chapters.length}
          </div>
        </div>

        {/* Center Chapter Content */}
        <div className="relative z-10 max-w-[900px] mx-auto w-full my-auto text-center space-y-6 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-tafa-volcán bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                <Compass className="w-3.5 h-3.5" /> {chapter.subtitle}
              </div>

              <h1 className="font-outfit text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white drop-shadow-2xl">
                {chapter.title}
              </h1>

              <p className="font-outfit text-base md:text-xl font-medium text-gray-200 leading-relaxed max-w-[680px] mx-auto drop-shadow-md">
                {chapter.desc}
              </p>

              <div className="pt-2 text-xs text-gray-300 font-semibold tracking-wider uppercase">
                Location: {chapter.location}
              </div>

              {chapter.id === 9 && (
                <div className="pt-6">
                  <button
                    onClick={scrollToAI}
                    className="bg-tafa-volcán hover:bg-tafa-lava text-white text-xs uppercase font-bold tracking-widest px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105"
                  >
                    Start Your Journey With TAFA AI
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Progress Bar & Scroll Indicator */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full space-y-3 pb-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Scroll down to experience Arequipa</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>

          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-tafa-volcán"
              style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
