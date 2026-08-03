import { useRef, useState } from 'react'
import { Upload, Map, LayoutDashboard, CalendarDays, UtensilsCrossed, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import SurveyModal from './SurveyModal'

function NavButton({ children, href = '#' }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="bg-transparent border-none cursor-pointer font-outfit text-[15px] font-medium
                 uppercase text-tafa-text tracking-[0.04em] transition-opacity hover:opacity-55
                 no-underline"
    >
      {children}
    </a>
  )
}

export default function Hero() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const [promptText, setPromptText] = useState(
    "Quiero recorrer Arequipa durante cinco días. Busco lugares históricos, gastronomía tradicional, eventos culturales y rutas con información actualizada."
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  function handleExploreClick() {
    const el = document.getElementById('explorar')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="relative min-h-svh w-full overflow-hidden">
        {/* Background video (z-0) */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4" type="video/mp4" />
        </video>

        {/* Top gradient overlay (z-1) */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
          style={{
            height: '687px',
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Bottom gradient (z-1) */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
          style={{
            height: '300px',
            background: 'linear-gradient(0deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0) 100%)',
          }}
        />

        {/* Content wrapper (z-2) */}
        <div className="relative z-[2] max-w-[1360px] mx-auto">

          {/* Navigation */}
          <nav className="flex items-center justify-between px-20 pt-6 pb-4 max-md:px-6 max-md:pt-5">
            <a href="#" className="flex items-center gap-2">
              <img
                src="/img/logo.png"
                alt="TAFA"
                className="h-12 max-md:h-9 w-auto object-contain transition-transform hover:scale-105"
              />
            </a>

            <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 max-md:hidden">
              <NavButton href="#explorar">Explorar</NavButton>
              <NavButton href="#mapa">Mapa</NavButton>
              <NavButton href="#acerca">Acerca de</NavButton>
              <NavButton href="http://localhost:3000/admin.html">Admin</NavButton>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="bg-transparent border-none cursor-pointer font-outfit text-[15px]
                           font-semibold uppercase text-tafa-volcán tracking-[0.04em]
                           transition-opacity hover:opacity-75 max-md:hidden flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Encuesta
              </button>
              <button
                onClick={handleExploreClick}
                className="bg-tafa-dark text-[#fafafa] border-none cursor-pointer font-outfit
                           text-[15px] font-medium uppercase tracking-[0.04em] px-5 py-3.5
                           rounded-full transition-all hover:bg-[#333] active:scale-95 shadow-md"
              >
                Explorar Arequipa
              </button>
            </div>
          </nav>

          {/* Hero body */}
          <div className="flex flex-col items-center px-6 pt-16 pb-24 text-center">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm
                         border border-black/10 rounded-full px-4 py-1.5 text-sm font-medium text-tafa-muted shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-tafa-volcán animate-pulse" />
              Plataforma oficial de turismo — Arequipa, Perú
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-outfit text-[clamp(40px,6vw,72px)] font-medium text-tafa-text
                         leading-[1.05] tracking-[-0.04em] max-w-[820px] mb-5"
            >
              Descubre Arequipa{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                desde una sola
              </span>{' '}
              plataforma
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="font-outfit text-xl font-medium text-tafa-muted leading-relaxed
                         max-w-[500px] mb-10"
            >
              Centralizamos información turística oficial para ayudarte a descubrir
              lugares, eventos, gastronomía y experiencias en toda la región.
            </motion.p>

            {/* Liquid glass prompt card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-[701px] max-md:w-[calc(100vw-48px)] min-h-[208px]
                         bg-white/[0.06] border-[3px] border-white rounded-[44px]
                         shadow-glass overflow-hidden text-left p-7"
              style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
              {/* Prompt textarea */}
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-outfit text-xl max-md:text-[17px]
                           font-medium leading-relaxed resize-none h-[110px]"
                style={{ color: '#905831' }}
              />

              {/* Uploaded file preview tag if selected */}
              {selectedFile && (
                <div className="absolute left-[70px] top-[145px] text-xs bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-tafa-text font-medium border border-white/60 truncate max-w-[200px]">
                  📎 {selectedFile.name}
                </div>
              )}

              {/* CTA button inside card */}
              <button
                onClick={handleExploreClick}
                className="absolute bottom-[21px] right-[21px] w-[156px] h-14
                           bg-black border-none rounded-[44px] shadow-glass-btn
                           cursor-pointer flex items-center justify-center
                           font-outfit text-base font-medium text-[#fafafa]
                           uppercase tracking-[0.02em] transition-all
                           hover:bg-[#333] active:scale-95"
              >
                Explorar
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Subir inspiración o foto"
                title="Subir foto de referencia"
                className="absolute left-[21px] top-[137px] w-11 h-11
                           bg-transparent border border-white/70 rounded-full
                           cursor-pointer flex items-center justify-center
                           transition-transform hover:scale-105
                           focus-visible:outline-2 focus-visible:outline-white
                           focus-visible:outline-offset-2"
                style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
              >
                <Upload className="w-[18px] h-[18px] text-tafa-text flex-shrink-0" />
              </button>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-8 flex items-center gap-4 flex-wrap justify-center"
            >
              {[
                { icon: Map, label: 'Mapa interactivo', href: '#mapa' },
                { icon: LayoutDashboard, label: 'Dashboard Live', href: 'http://localhost:3000' },
                { icon: Sparkles, label: 'Encuesta Turista', onClick: () => setIsSurveyOpen(true) },
                { icon: UtensilsCrossed, label: 'Picanterías', href: '#explorar' },
              ].map(({ icon: Icon, label, href, onClick }) => (
                onClick ? (
                  <button
                    key={label}
                    onClick={onClick}
                    className="flex items-center gap-2 text-[13px] font-medium text-tafa-muted
                               bg-white/70 backdrop-blur-sm border border-black/10
                               rounded-full px-4 py-2 transition-all hover:bg-white hover:text-tafa-text
                               hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-tafa-volcán" />
                    {label}
                  </button>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-2 text-[13px] font-medium text-tafa-muted
                               bg-white/70 backdrop-blur-sm border border-black/10
                               rounded-full px-4 py-2 transition-all hover:bg-white hover:text-tafa-text
                               hover:shadow-md active:scale-95 no-underline"
                  >
                    <Icon className="w-4 h-4 text-tafa-cielo" />
                    {label}
                  </a>
                )
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Survey Modal */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />
    </>
  )
}
