import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, QrCode, Users, Sparkles } from 'lucide-react'
import { fetchPartners } from './partnersService'
import { type PartnerCategory, type PartnerEntry } from './types'

type FilterKey = 'todos' | PartnerCategory

/**
 * FASE 5 — Directorio público de aliados turísticos y gastronómicos.
 * Cada tarjeta enlaza a la ruta QR real (`/qr/:slug`) del aliado.
 */
export default function PartnersDirectory() {
  const { t } = useTranslation(['sections'])
  const [partners, setPartners] = useState<PartnerEntry[]>([])
  const [filter, setFilter] = useState<FilterKey>('todos')
  const [loading, setLoading] = useState(true)

  // Las etiquetas de los filtros viven dentro del componente: `t()` no puede
  // invocarse a nivel de módulo porque el idioma se resuelve en runtime.
  const filters = useMemo<{ key: FilterKey; label: string }[]>(
    () => [
      { key: 'todos', label: t('sections:partners_filter_todos') },
      { key: 'picanteria', label: t('sections:partners_filter_picanteria') },
      { key: 'restaurante', label: t('sections:partners_filter_restaurante') },
      { key: 'cafe', label: t('sections:partners_filter_cafe') },
      { key: 'hotel', label: t('sections:partners_filter_hotel') },
      { key: 'hostal', label: t('sections:partners_filter_hostal') },
      { key: 'agencia', label: t('sections:partners_filter_agencia') },
      { key: 'cultura', label: t('sections:partners_filter_cultura') },
    ],
    [t],
  )

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
    () => filters.filter(f => f.key === 'todos' || partners.some(p => p.category === f.key)),
    [filters, partners],
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
            {t('sections:partners_badge')}
          </span>
          <h2 id="aliados-title" className="text-3xl md:text-4xl font-extrabold font-outfit">
            {t('sections:partners_title')}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('sections:partners_subtitle')}
          </p>
        </header>

        {/* Filtros por categoría */}
        <div
          role="group"
          aria-label={t('sections:partners_filters_aria')}
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
            {t('sections:partners_loading')}
          </p>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            {t('sections:partners_empty')}
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
                    {/* La categoría se traduce desde su clave de enum: el
                        `categoryLabel` que arma el servicio está siempre en
                        español y no conoce el idioma activo. */}
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {t(`sections:partners_filter_${p.category}`)}
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
                      {t('sections:partners_card_cta')}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" aria-hidden="true" />
                      {t('sections:partners_card_points', { points: p.points })}
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
