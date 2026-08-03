import { useRef } from 'react'
import { Upload, Map, LayoutDashboard, CalendarDays, UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'

// ── NavButton helper ──────────────────────────────────────────────────────────
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

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="relative min-h-svh w-full overflow-hidden">

      {/* ── Background video (z-0) ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        poster="/arequipa-poster.jpg"
      >
        {/* Video placeholder — reemplazar por video cinematográfico de Arequipa */}
        {/* Fuentes sugeridas: Veo 3, Pexels, o producción propia */}
        <source src="https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4" type="video/mp4" />
      </video>

      {/* ── Top gradient overlay (z-1) — blanco hacia transparente ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
        style={{
          height: '687px',
          background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* ── Bottom gradient (z-1) — oscuro hacia abajo para leer texto inferior ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
        style={{
          height: '300px',
          background: 'linear-gradient(0deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0) 100%)',
        }}
      />

      {/* ── Content wrapper (z-2) ── */}
      <div className="relative z-[2] max-w-[1360px] mx-auto">

        {/* ── Navigation ── */}
        <nav className="flex items-center justify-between px-20 pt-6 pb-4 max-md:px-6 max-md:pt-5">

          {/* Left: wordmark */}
          <span className="font-display text-[40px] text-black leading-none select-none max-md:text-[32px] tracking-tight">
            TAFA
          </span>

          {/* Center: nav links (hidden on mobile) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 max-md:hidden">
            <NavButton href="#explorar">Explorar</NavButton>
            <NavButton href="#mapa">Mapa</NavButton>
            <NavButton href="#eventos">Eventos</NavButton>
            <NavButton href="#acerca">Acerca de</NavButton>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-8">
            <button className="bg-transparent border-none cursor-pointer font-outfit text-[15px]
                               font-semibold uppercase text-[#292929] tracking-[0.04em]
                               transition-opacity hover:opacity-55 max-md:hidden">
              Acceder
            </button>
            <button className="bg-tafa-dark text-[#fafafa] border-none cursor-pointer font-outfit
                               text-[15px] font-medium uppercase tracking-[0.04em] px-5 py-3.5
                               rounded-full transition-all hover:bg-[#333] active:scale-95">
              Explorar Arequipa
            </button>
          </div>
        </nav>

        {/* ── Hero body ── */}
        <div className="flex flex-col items-center px-6 pt-16 pb-24 text-center">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm
                       border border-black/10 rounded-full px-4 py-1.5 text-sm font-medium text-tafa-muted"
          >
            <span className="w-2 h-2 rounded-full bg-tafa-volcán animate-pulse" />
            Plataforma oficial de turismo — Arequipa, Perú
          </motion.div>

          {/* Headline */}
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

          {/* Subtitle */}
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

          {/* ── Liquid glass prompt card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-[701px] max-md:w-[calc(100vw-48px)] min-h-[208px]
                       bg-white/[0.06] border-[3px] border-white rounded-[44px]
                       shadow-glass overflow-hidden"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            {/* Prompt text */}
            <p
              className="absolute left-[29px] top-[57px] -translate-y-1/2
                         w-[609px] max-md:w-[calc(100%-58px)]
                         font-outfit text-xl max-md:text-[17px] font-medium
                         leading-relaxed break-words text-left"
              style={{ color: '#905831' }}
            >
              Quiero recorrer Arequipa durante cinco días. Busco lugares históricos,
              gastronomía tradicional, eventos culturales y rutas con información actualizada....
            </p>

            {/* CTA button inside card */}
            <button
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
              className="hidden"
            />

            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Subir inspiración o referencia"
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

          {/* Quick links debajo del card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 flex items-center gap-6 flex-wrap justify-center"
          >
            {[
              { icon: Map, label: 'Mapa interactivo' },
              { icon: LayoutDashboard, label: 'Dashboard' },
              { icon: CalendarDays, label: 'Eventos' },
              { icon: UtensilsCrossed, label: 'Gastronomía' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex items-center gap-2 text-[13px] font-medium text-tafa-muted
                           bg-white/60 backdrop-blur-sm border border-black/10
                           rounded-full px-4 py-2 transition-all hover:bg-white hover:text-tafa-text
                           hover:shadow-md active:scale-95"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
