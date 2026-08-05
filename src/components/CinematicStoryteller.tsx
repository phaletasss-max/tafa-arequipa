import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, MapPin } from 'lucide-react'

const chapterConfig = [
  {
    id: 1,
    titleKey: 'hero:chapter_1_title',
    subtitleKey: 'hero:chapter_1_subtitle',
    descKey: 'hero:chapter_1_desc',
    locationKey: 'hero:chapter_1_location',
    tagKey: 'hero:chapter_1_tag',
    video: '/video/caratula.mp4',
    poster: '/images/places/plaza-de-armas.jpg',
  },
  {
    id: 2,
    titleKey: 'hero:chapter_2_title',
    subtitleKey: 'hero:chapter_2_subtitle',
    descKey: 'hero:chapter_2_desc',
    locationKey: 'hero:chapter_2_location',
    tagKey: 'hero:chapter_2_tag',
    video: '',
    poster: '/images/places/monasterio-santa-catalina.webp',
  },
  {
    id: 3,
    titleKey: 'hero:chapter_3_title',
    subtitleKey: 'hero:chapter_3_subtitle',
    descKey: 'hero:chapter_3_desc',
    locationKey: 'hero:chapter_3_location',
    tagKey: 'hero:chapter_3_tag',
    video: '',
    poster: '/images/places/mirador-yanahuara.jpg',
  },
  {
    id: 4,
    titleKey: 'hero:chapter_4_title',
    subtitleKey: 'hero:chapter_4_subtitle',
    descKey: 'hero:chapter_4_desc',
    locationKey: 'hero:chapter_4_location',
    tagKey: 'hero:chapter_4_tag',
    video: '',
    poster: '/images/places/ruta-sillar.jpg',
  },
  {
    id: 5,
    titleKey: 'hero:chapter_5_title',
    subtitleKey: 'hero:chapter_5_subtitle',
    descKey: 'hero:chapter_5_desc',
    locationKey: 'hero:chapter_5_location',
    tagKey: 'hero:chapter_5_tag',
    video: '',
    poster: '/images/places/canon-colca.jpg',
  },
]

export default function CinematicStoryteller() {
  const { t } = useTranslation(['hero', 'common'])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chapterConfig.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const chapter = chapterConfig[currentIndex]

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
              alt={t(chapter.titleKey)}
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
              <Compass className="w-3.5 h-3.5 text-amber-400" /> {t(chapter.subtitleKey)}
            </div>

            <h1 className="font-outfit text-3xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-2xl">
              {t(chapter.titleKey)}
            </h1>

            <p className="font-outfit text-sm md:text-lg font-normal text-gray-200 leading-relaxed max-w-[680px] mx-auto drop-shadow">
              {t(chapter.descKey)}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-emerald-300 font-semibold pt-1">
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {t(chapter.locationKey)}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                {t(chapter.tagKey)}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => scrollToSection('explorar')}
                className="bg-tafa-volcán hover:bg-tafa-lava text-white text-xs uppercase font-bold tracking-wider px-7 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
              >
                {t('hero:btn_explore')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event('tafa_open_ai'))}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs uppercase font-semibold tracking-wider px-6 py-3.5 rounded-full backdrop-blur-md transition-all"
              >
                {t('common:ai_assistant')}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + chapterConfig.length) % chapterConfig.length)}
            aria-label={t('hero:prev_chapter')}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % chapterConfig.length)}
            aria-label={t('hero:next_chapter')}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 focus:outline-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div 
          className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 overflow-x-auto max-w-[100%]"
          role="tablist"
          aria-label="Seleccionar capítulo"
        >
          {chapterConfig.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCurrentIndex(i)}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Capítulo ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                i === currentIndex ? 'w-8 bg-tafa-volcán' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
