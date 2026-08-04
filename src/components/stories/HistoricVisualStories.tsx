import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Tag, ChevronLeft, ChevronRight, Play, Pause, Compass, CheckCircle2, BookmarkPlus } from 'lucide-react'

interface HistoricStory {
  id: string
  title: string
  subtitle: string
  category: string
  district: string
  description: string
  hours: string
  fee: string
  accessibility: string
  image: string
  videoUrl?: string
  points: number
}

const historicStories: HistoricStory[] = [
  {
    id: 's1',
    title: 'Plaza de Armas y Basílica Catedrática',
    subtitle: 'Corazón del Centro Histórico',
    category: 'Patrimonio Histórico',
    district: 'Cercado de Arequipa',
    description: 'Corazón del centro histórico de Arequipa, construido íntegramente en sillar blanco. Destaca su imponente Catedral neoclásica de 70 metros de frente, piletas de bronce del siglo XIX y arquerías de granito. Al fondo se recorta la silueta simétrica del volcán Misti.',
    hours: '24 Horas / Museo 10:00 - 17:00',
    fee: 'Acceso Libre',
    accessibility: 'Rampas de acceso motriz 100% integradas (WCAG AAA)',
    image: '/images/places/plaza-de-armas.webp',
    points: 50,
  },
  {
    id: 's2',
    title: 'Monasterio de Santa Catalina',
    subtitle: 'Ciudadela Conventual de 1579',
    category: 'Arquitectura & Historia',
    district: 'Cercado de Arequipa',
    description: 'Ciudadela conventual fundada en 1579 de más de 20,000 m². Cuenta con claustros pintados en rojo óxido y azul cobalto, calles de piedra, patios floridos y cocinas históricas esculpidas en sillar volcánico.',
    hours: '09:00 - 17:00',
    fee: 'S/ 45.00 General',
    accessibility: 'Audiorutas de voz e itinerario plano sin escalones',
    image: '/images/places/monasterio-santa-catalina.webp',
    points: 80,
  },
  {
    id: 's3',
    title: 'Mirador de Yanahuara',
    subtitle: 'Vista Panorámica a los 3 Volcanes',
    category: 'Mirador Tradicional',
    district: 'Yanahuara',
    description: 'Mirador construido en el siglo XIX compuesto por arcos de sillar con grabados de poetas y pensadores arequipeños. Ofrece la vista panorámica más famosa de la ciudad hacia los tres volcanes: Misti, Chachani y Pichu Pichu.',
    hours: '24 Horas',
    fee: 'Acceso Libre',
    accessibility: 'Señalética digital QR y rampa de acceso',
    image: '/images/places/mirador-yanahuara.webp',
    points: 40,
  },
  {
    id: 's4',
    title: 'Ruta del Sillar (Canteras de Añashuayco)',
    subtitle: 'Canteras Vivas de Piedra Volcánica',
    category: 'Turismo Cultural',
    district: 'Cerro Colorado',
    description: 'Canteras vivas en el quebrada de Añashuayco donde los artesanos extraen y tallan el sillar blanco a comba y cincel. Incluye megagrabados en roca volcánica y replicas de fachadas barrocas en tamaño real.',
    hours: '08:00 - 16:30',
    fee: 'S/ 5.00 Ingreso',
    accessibility: 'Camino llano con asistencia para movilidad reducida',
    image: '/images/places/ruta-sillar.webp',
    points: 70,
  },
  {
    id: 's5',
    title: 'Cañón del Colca (Mirador Cruz del Cóndor)',
    subtitle: 'Vuelo del Cóndor Andino',
    category: 'Naturaleza & Aventura',
    district: 'Caylloma · Chivay',
    description: 'Uno de los cañones más profundos del mundo (más de 4,160 metros). El punto emblemático es la Cruz del Cóndor, desde donde se observa el vuelo del cóndor andino en su hábitat natural sobre andenes preincas.',
    hours: '05:00 - 17:00',
    fee: 'Boleto Turístico (S/ 70)',
    accessibility: 'Miradores equipados con barandas y señalética QR',
    image: '/images/places/canon-colca.webp',
    points: 100,
  },
]

export default function HistoricVisualStories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [savedStories, setSavedStories] = useState<string[]>([])

  const current = historicStories[currentIndex]

  // Auto-progress bar timer (5 seconds per story)
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused])

  function handleNext() {
    setProgress(0)
    setCurrentIndex(prev => (prev + 1) % historicStories.length)
  }

  function handlePrev() {
    setProgress(0)
    setCurrentIndex(prev => (prev - 1 + historicStories.length) % historicStories.length)
  }

  function toggleSaveStory(id: string) {
    if (savedStories.includes(id)) {
      setSavedStories(savedStories.filter(s => s !== id))
    } else {
      setSavedStories([...savedStories, id])
    }
  }

  return (
    <section id="historias-turista" className="bg-[#0b0f17] py-28 px-6 text-white border-t border-white/10">
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" /> Visual Tourist Stories · Experiencia Interactiva
          </div>
          <h2 className="font-outfit text-3xl md:text-5xl font-bold tracking-tight">
            Descubre los Atractivos Históricos en Historias Visuales
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Desliza o toca para explorar los hitos patrimoniales de Arequipa con audiorutas, datos de accesibilidad y puntos de recompensa.
          </p>
        </div>

        {/* Stories Vertical Phone / Card Player Container */}
        <div className="relative max-w-[500px] mx-auto h-[680px] bg-black rounded-[40px] overflow-hidden border-[4px] border-white/20 shadow-2xl flex flex-col justify-between p-6">

          {/* Background Image / Video Player */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
            </motion.div>
          </AnimatePresence>

          {/* Top Story Progress Bars */}
          <div className="relative z-10 space-y-3">
            <div className="flex gap-1.5">
              {historicStories.map((s, i) => (
                <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-100"
                    style={{
                      width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {current.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => toggleSaveStory(current.id)}
                  className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-colors ${savedStories.includes(current.id) ? 'bg-amber-400 text-black' : 'bg-black/50 text-white'}`}
                  title="Guardar en mi Itinerario TAFA Pass"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Touch Navigation Overlay Areas */}
          <div className="absolute inset-y-20 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-20 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Card Content */}
          <div className="relative z-10 space-y-3 bg-black/60 backdrop-blur-md p-5 rounded-[28px] border border-white/15">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {current.district}
              </span>
              <span className="bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                +{current.points} PTS TAFA
              </span>
            </div>

            <h3 className="text-2xl font-bold font-outfit text-white leading-tight">
              {current.title}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
              {current.description}
            </p>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/5 p-2 rounded-xl text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{current.hours}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl text-amber-300 font-semibold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{current.fee}</span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{current.accessibility}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
