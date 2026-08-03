import { Map, Mail, Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.06] text-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <img src="/img/logo.png" alt="TAFA Logo" className="h-12 w-auto object-contain mb-4" />
            <p className="text-[#8b949e] text-[14px] leading-relaxed max-w-[340px] mb-6">
              Turismo Arequipa: Fragmentado → Accesible.
              Plataforma digital de centralización de datos turísticos
              oficiales para la región Arequipa, Perú.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           text-white/50 hover:text-white hover:border-white/50 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           text-white/50 hover:text-white hover:border-white/50 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                           text-white/50 hover:text-white hover:border-white/50 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-5">
              Plataforma
            </div>
            <ul className="space-y-3">
              {['Explorar lugares', 'Mapa interactivo', 'Gastronomía', 'Eventos', 'Dashboard', 'Encuesta'].map(item => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Fuentes */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-5">
              Fuentes de datos
            </div>
            <ul className="space-y-3">
              {['MINCETUR', 'DIRCETUR Arequipa', 'AUTOCOLCA', 'INEI', 'Municipalidad Provincial', 'datosabiertos.gob.pe'].map(item => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-[#8b949e]">
            <Map className="w-4 h-4 text-tafa-volcán" />
            <span>
              © 2026 TAFA — Arequipa, Perú · Hackathon Nacional de Turismo
            </span>
          </div>
          <div className="text-[12px] text-[#8b949e]">
            Datos protegidos bajo{' '}
            <span className="text-white/60 font-medium">Ley N° 29733</span>
            {' '}· Stack: React + Vite + Supabase
          </div>
        </div>
      </div>
    </footer>
  )
}
