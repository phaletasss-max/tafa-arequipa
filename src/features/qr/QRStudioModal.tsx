import { useEffect, useState } from 'react'
import { QrCode, Download, Printer, X, Sparkles, ShieldCheck, Copy, Check } from 'lucide-react'
import { fetchPartners } from '@/features/partners/partnersService'
import type { PartnerEntry } from '@/features/partners/types'

interface QRStudioModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Base pública donde se sirven las rutas /qr/:slug. */
const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'https://tafaqp.vercel.app'

export default function QRStudioModal({ isOpen, onClose }: QRStudioModalProps) {
  // El catálogo se lee de `qr_landing`: así el Estudio nunca imprime un slug
  // que no exista en la base y que por tanto no registraría ninguna visita.
  const [partners, setPartners] = useState<PartnerEntry[]>([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    fetchPartners().then(list => {
      if (cancelled) return
      setPartners(list)
      setSelectedSlug(current => current || list[0]?.slug || '')
    })
    return () => { cancelled = true }
  }, [isOpen])

  if (!isOpen) return null

  const activeSlug = customSlug.trim() ? customSlug.trim().toLowerCase().replace(/\s+/g, '-') : selectedSlug
  const partnerName = partners.find(p => p.slug === activeSlug)?.name || activeSlug.replace(/-/g, ' ').toUpperCase()
  const qrUrl = `${PUBLIC_BASE_URL}/qr/${activeSlug}`
  const isKnownSlug = partners.some(p => p.slug === activeSlug)

  // Generador de QR SVG vectorial mediante API de alta definición
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}&color=111827&bgcolor=ffffff&margin=1`

  function handleCopy() {
    navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/20 rounded-[32px] max-w-xl w-full p-6 md:p-8 text-white relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <QrCode className="w-4 h-4" /> Studio de Códigos QR Oficiales TAFA
          </div>
          <h3 className="text-2xl font-extrabold font-outfit text-white">Generador de Material Físico & QR</h3>
          <p className="text-gray-400 text-xs">Descarga e imprime los carteles QR listos para mesas de picanterías y atractivos de Arequipa.</p>
        </div>

        {/* Selector de Socio o Slug */}
        <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
          <label className="block font-bold text-gray-300 uppercase text-[10px]">Seleccionar Establecimiento / Atractivo:</label>
          <select
            value={selectedSlug}
            onChange={(e) => { setSelectedSlug(e.target.value); setCustomSlug(''); }}
            className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-tafa-volcán"
          >
            {partners.length === 0 && <option value="">Cargando catálogo oficial…</option>}
            {partners.map(p => (
              <option key={p.slug} value={p.slug}>{p.name} — {p.categoryLabel} ({p.district})</option>
            ))}
          </select>

          <div className="pt-1">
            <label className="block font-bold text-gray-300 uppercase text-[10px] mb-1">O Ingresar Slug Personalizado:</label>
            <input
              type="text"
              placeholder="Ej: picanteria-don-pedro"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
            />
          </div>

          {activeSlug && !isKnownSlug && (
            <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 leading-relaxed">
              <strong>Atención:</strong> «{activeSlug}» no está registrado en el catálogo oficial.
              El cartel se generará, pero las visitas escaneadas no sumarán puntos hasta dar de alta
              el aliado en Supabase.
            </p>
          )}
        </div>

        {/* ── VISTA PREVIA DEL CARTEL FÍSICO TAFA PARA IMPRESIÓN ── */}
        <div id="tafa-qr-print-card" className="bg-white text-slate-900 rounded-[28px] p-6 text-center space-y-4 shadow-2xl border-4 border-tafa-volcán relative overflow-hidden">
          <div className="bg-tafa-volcán text-white py-2 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-wider mx-auto w-fit flex items-center gap-1.5 shadow-md">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            VALIDADOR OFICIAL TAFA AREQUIPA
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-extrabold font-outfit text-slate-900 leading-tight">{partnerName}</h4>
            <p className="text-xs text-slate-600 font-medium">Escanea aquí para registrar tu visita y reclamar tu premio</p>
          </div>

          {/* Código QR Generado */}
          <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-inner flex items-center justify-center">
            <img src={qrImageUrl} alt={`QR TAFA ${activeSlug}`} className="w-full h-full object-contain" />
          </div>

          {/* Recompensa */}
          <div className="bg-amber-400/20 border border-amber-500/40 rounded-xl py-2 px-4 w-fit mx-auto text-amber-900 font-extrabold text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>+50 PUNTOS TAFA</span>
          </div>

          <p className="text-[10px] text-slate-500 font-mono break-all">{qrUrl}</p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-white/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡URL Copiada!' : 'Copiar URL'}</span>
          </button>

          <a
            href={qrImageUrl}
            download={`qr-tafa-${activeSlug}.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 no-underline"
          >
            <Download className="w-4 h-4" />
            <span>Descargar QR (PNG)</span>
          </a>

          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 bg-tafa-volcán hover:bg-tafa-lava text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Cartel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
