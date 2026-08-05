import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, QrCode, Users, Sparkles } from 'lucide-react'
import { fetchPartners } from './partnersService'
import { CATEGORY_LABELS, type PartnerCategory, type PartnerEntry } from './types'

type FilterKey = 'todos' | PartnerCategory

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'picanteria', label: CATEGORY_LABELS.picanteria },
  { key: 'restaurante', label: CATEGORY_LABELS.restaurante },
  { key: 'cafe', label: CATEGORY_LABELS.cafe },
  { key: 'hotel', label: CATEGORY_LABELS.hotel },
  { key: 'hostal', label: CATEGORY_LABELS.hostal },
  { key: 'agencia', label: CATEGORY_LABELS.agencia },
  { key: 'cultura', label: CATEGORY_LABELS.cultura },
]

/**
 * FASE 5 — Directorio público de aliados turísticos y gastronómicos.
 * Cada tarjeta enlaza a la ruta QR real (`/qr/:slug`) del aliado.
 */
export default function PartnersDirectory() {
  const [partners, setPartners] = useState<PartnerEntry[]>([])
  const [filter, setFilter] = useState<FilterKey>('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPartners()
      .then(list => {
        if (cancelled) return
        setPartners(list.filter(p => p.entityType === 'business'))
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const visible = useMemo(
    () => (filter === 'todos' ? partners : partners.filter(p => p.category === filter)),
    [partners, filter],
  )

  const availableFilters = useMemo(
    () => FILTERS.filter(f => f.key === 'todos' || partners.some(p => p.category === f.key)),
    [partners],
  )

  return (
    <section
      id="aliados"
      aria-labelledby="aliados-title"
      className="bg-tafa-dark text-white py-20 px-6"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-tafa-volcán bg-tafa-volcán/10 border border-tafa-volcán/30 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            Ecosistema de Aliados TAFA
          </span>
          <h2 id="aliados-title" className="text-3xl md:text-4xl font-extrabold font-outfit">
            Picanterías, hoteles y agencias verificadas
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Aliados de la Sociedad Picantera, AGAR, AHORA Arequipa, AVIT y COLITUR. Escanea el QR en
            el establecimiento para validar tu visita y sumar Puntos TAFA.
          </p>
        </header>

        {/* Filtros por categoría */}
        <div
          role="group"
          aria-label="Filtrar aliados por categoría"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {availableFilters.map(f => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  active
                    ? 'bg-tafa-volcán border-tafa-volcán text-white'
                    : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm animate-pulse" role="status">
            Cargando directorio oficial de aliados…
          </p>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            Aún no hay aliados registrados en esta categoría.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
            {visible.map(p => (
              <li key={p.slug}>
                <Link
                  to={`/qr/${p.slug}`}
                  className="group h-full flex flex-col justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-tafa-volcán/50 rounded-2xl p-5 transition-all no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {p.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-tafa-volcán transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-tafa-volcán shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{p.address}</span>
                    </p>
                    {p.guild && (
                      <p className="text-[10px] text-gray-500 italic">{p.guild}</p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-tafa-volcán" aria-hidden="true" />
                      Ver ficha & QR
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" aria-hidden="true" />
                      +{p.points} PTS
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
