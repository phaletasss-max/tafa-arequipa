import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MapPin, Sparkles, ArrowRight, ShieldCheck, Clock, Tag } from 'lucide-react'

const destinations = [
  {
    id: 'plaza',
    title: 'Plaza de Armas & Catedral',
    subtitle: 'El Corazón Histórico de Sillar Blanco',
    desc: 'Rodeada de arquerías de sillar volcánico y con la majestuosa Catedral neoclásica del siglo XVII. Con la imponente vista al volcán Misti de fondo.',
    category: 'Centro Histórico',
    tag: 'Imperdible · Patrimonio UNESCO',
    image: '/correcion-imagenes/plaza-armas-arequipa.jpg',
    color: '#c0392b',
    price: 'Acceso Gratuito',
    verificado: true,
  },
  {
    id: 'santacatalina',
    title: 'Monasterio de Santa Catalina',
    subtitle: 'Una Ciudad Citadel del Siglo XVI',
    desc: 'Un fascinante complejo religioso de 20,000 m² repleto de callejones azul añil, terracota, patios de flores y siglos de historia mística.',
    category: 'Patrimonio Cultural',
    tag: 'Experiencia Cultural Única',
    image: '/correcion-imagenes/monaterio-santa-catalina.webp',
    color: '#8e44ad',
    price: 'S/. 45 entrada',
    verificado: true,
  },
  {
    id: 'colca',
    title: 'Cañón del Colca & Cruz del Cóndor',
    subtitle: 'Uno de los Cañones Más Profundos del Mundo',
    desc: 'Avista el majestuoso vuelo del cóndor andino a primera hora del día sobre abismos de más de 3,000 metros y pueblos tradicionales del valle.',
    category: 'Naturaleza & Aventura',
    tag: 'Aventura Andina',
    image: '/correcion-imagenes/canon-colca-condor.jpg',
    color: '#27ae60',
    price: 'Boleto Turístico S/. 70',
    verificado: true,
  },
  {
    id: 'gastronomia',
    title: 'Picanterías Tradicionales',
    subtitle: 'El Sabor Auténtico de Arequipa',
    desc: 'Disfruta el rocoto relleno a leña, el adobo del domingo, el chupe de camarones y el solterito de queso acompañados de chicha de jora.',
    category: 'Gastronomía Tradicional',
    tag: 'Patrimonio Culinario',
    image: '/images/attractions/gastronomia-palomino.jpg',
    color: '#f39c12',
    price: 'S/. 25 - 60 por plato',
    verificado: true,
  },
]

export default function ScrollyDestinations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Transform scroll progress to active card index
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const idx = Math.min(
        Math.floor(latest * destinations.length),
        destinations.length - 1
      )
      setActiveIndex(Math.max(0, idx))
    })
  }, [scrollYProgress])

  const activeDest = destinations[activeIndex]

  return (
    <section ref={containerRef} className="relative bg-[#0a0a0a] text-white min-h-[300vh]">
      {/* Sticky viewport content */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden">

        {/* Section Header */}
        <div className="z-20 flex items-center justify-between max-w-[1200px] mx-auto w-full pt-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-tafa-volcán animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tafa-volcán">
              Destinos Imperdibles de Arequipa
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-white/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Desliza hacia abajo para recorrer</span>
          </div>
        </div>

        {/* Dynamic Split Screen: Left Info + Right Image Frame */}
        <div className="z-10 max-w-[1200px] mx-auto w-full grid lg:grid-cols-12 gap-8 items-center my-auto">

          {/* Left Column: Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDest.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${activeDest.color}25`, color: activeDest.color, border: `1px solid ${activeDest.color}40` }}>
                  {activeDest.tag}
                </div>

                <h2 className="font-outfit text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                  {activeDest.title}
                </h2>

                <p className="text-tafa-volcán font-medium text-lg">
                  {activeDest.subtitle}
                </p>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {activeDest.desc}
                </p>

                <div className="flex items-center gap-4 pt-2 text-xs text-gray-400 border-t border-white/10">
                  <span className="flex items-center gap-1 text-tafa-andino font-semibold">
                    <Tag className="w-3.5 h-3.5" /> {activeDest.price}
                  </span>
                  {activeDest.verificado && (
                    <span className="flex items-center gap-1 text-green-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verificado por DIRCETUR
                    </span>
                  )}
                </div>

                <a
                  href="#mapa"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-tafa-volcán hover:text-white transition-all shadow-lg mt-4 no-underline"
                >
                  Ver en el mapa interactivo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Animated Frame Preview */}
          <div className="lg:col-span-7 relative h-[360px] md:h-[480px] rounded-[36px] overflow-hidden border-2 border-white/20 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeDest.id}
                src={activeDest.image}
                alt={activeDest.title}
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Subtle Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Bottom Indicator Dots */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
              <div className="text-xs font-semibold text-white/90 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                0{activeIndex + 1} / 0{destinations.length} — {activeDest.category}
              </div>

              <div className="flex gap-2">
                {destinations.map((d, idx) => (
                  <div
                    key={d.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'w-8 bg-tafa-volcán' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Progress Bar at Bottom */}
        <div className="z-20 max-w-[1200px] mx-auto w-full pb-4">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
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
