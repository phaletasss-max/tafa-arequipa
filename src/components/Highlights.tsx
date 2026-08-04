import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Search, Filter, Clock, Tag, X, Landmark, TreePine, Castle, Compass, Utensils, Mountain, Award, MapPin, Accessibility, Sparkles, PhoneCall } from 'lucide-react'
import { getLugaresSupabase } from '@/services/supabaseService'
import { Lugar } from '@/services/api'
import { getTranslatedPlace } from '@/services/placeTranslationService'

// Pestañas Estilo Despegar.com para Navegación de Turismo
const DESPEGAR_TABS = [
  { id: '', labelKey: 'explorer:tab_all', icon: Sparkles, color: 'bg-tafa-volcán text-white' },
  { id: 'Patrimonio Histórico', labelKey: 'explorer:tab_heritage', icon: Landmark, color: 'bg-purple-600 text-white' },
  { id: 'Naturaleza', labelKey: 'explorer:tab_nature', icon: TreePine, color: 'bg-emerald-600 text-white' },
  { id: 'Centro Histórico', labelKey: 'explorer:tab_historic', icon: Castle, color: 'bg-red-600 text-white' },
  { id: 'Cultural', labelKey: 'explorer:tab_culture', icon: Compass, color: 'bg-amber-600 text-white' },
]

// Quick Filters Despegar Style
const QUICK_FILTERS = [
  'explorer:verified_dircetur',
  'explorer:free_access',
  'Cercado de Arequipa',
  'Yanahuara',
  'Cañón del Colca',
  'Ruta del Sillar',
]

export default function Highlights() {
  const { t, i18n } = useTranslation(['explorer', 'common'])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null)

  useEffect(() => {
    loadData()
  }, [categoria])

  async function loadData() {
    try {
      setLoading(true)
      const data = await getLugaresSupabase(undefined, search || undefined)
      let filtered = data
      if (categoria === 'Patrimonio Histórico') {
        filtered = data.filter(l => l.categoria === 'Patrimonio Histórico')
      } else if (categoria === 'Naturaleza') {
        filtered = data.filter(l => l.categoria === 'Naturaleza')
      } else if (categoria === 'Cultural') {
        filtered = data.filter(l => l.categoria === 'Cultural')
      } else if (categoria === 'Centro Histórico') {
        filtered = data.filter(l => l.distrito === 'Cercado' || l.categoria === 'Patrimonio Histórico')
      }
      setLugares(filtered)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    loadData()
  }

  // Filtrado dinámico en memoria con Quick Filters
  const filteredLugares = lugares.filter(l => {
    if (!activeQuickFilter) return true
    if (activeQuickFilter === 'explorer:verified_dircetur') {
      return l.verificado === 1 || (l.verificado as any) === true
    }
    if (activeQuickFilter === 'explorer:free_access') {
      return l.precio_entrada?.toLowerCase().includes('libre') || l.precio_entrada?.toLowerCase().includes('gratuito')
    }
    if (activeQuickFilter === 'Cercado de Arequipa') return l.distrito === 'Cercado'
    if (activeQuickFilter === 'Yanahuara') return l.distrito === 'Yanahuara'
    if (activeQuickFilter === 'Cañón del Colca') return l.nombre.includes('Colca') || l.distrito === 'Chivay'
    if (activeQuickFilter === 'Ruta del Sillar') return l.nombre.includes('Sillar') || l.nombre.includes('Añashuayco')
    return true
  })

  const renderCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Patrimonio': return <Landmark className="w-5 h-5 text-purple-600" />
      case 'Naturaleza': return <TreePine className="w-5 h-5 text-emerald-600" />
      case 'Centro Histórico': return <Castle className="w-5 h-5 text-red-600" />
      case 'Cultural': return <Compass className="w-5 h-5 text-amber-600" />
      default: return <Mountain className="w-5 h-5 text-tafa-volcán" />
    }
  }

  const getColor = (cat: string) => {
    switch (cat) {
      case 'Patrimonio': return '#8e44ad'
      case 'Naturaleza': return '#27ae60'
      case 'Centro Histórico': return '#c0392b'
      case 'Cultural': return '#e67e22'
      default: return '#c0392b'
    }
  }

  function translateCategory(cat: string) {
    switch (cat) {
      case 'Patrimonio Histórico': return t('explorer:tab_heritage')
      case 'Naturaleza': return t('explorer:tab_nature')
      case 'Centro Histórico': return t('explorer:tab_historic')
      case 'Cultural': return t('explorer:tab_culture')
      default: return cat
    }
  }

  function translatePrice(precio?: string) {
    if (!precio) return t('explorer:free_access')
    if (precio.toLowerCase().includes('libre') || precio.toLowerCase().includes('gratuito')) {
      return t('explorer:free_access')
    }
    return precio
  }

  return (
    <section id="explorar" className="bg-[#f8f9fa] py-28 px-6 border-t border-gray-200" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Section Title */}
        <div className="text-center max-w-[760px] mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-tafa-volcán/10 text-tafa-volcán px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" /> {t('explorer:tag')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl md:text-5xl font-extrabold text-tafa-text tracking-tight leading-tight mb-4"
          >
            {t('explorer:title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-tafa-muted text-base leading-relaxed"
          >
            {t('explorer:desc')}
          </motion.p>
        </div>

        {/* ── DESPEGAR-STYLE BUSCADOR & BARRA DE PESTAÑAS ───────────────── */}
        <div className="bg-white rounded-[28px] p-6 shadow-xl border border-gray-200/80 mb-12 space-y-5">
          
          {/* Top Category Tabs (Estilo Despegar) - WCAG 2.1 tablist */}
          <div 
            role="tablist"
            aria-label={t('explorer:tab_navigation')}
            className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 no-scrollbar"
          >
            {DESPEGAR_TABS.map(tab => {
              const Icon = tab.icon
              const isActive = categoria === tab.id
              const tabId = `tab-${tab.id || 'all'}`
              return (
                <button
                  key={tab.id}
                  id={tabId}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id || 'all'}`}
                  onClick={() => setCategoria(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-outfit uppercase tracking-wider transition-all whitespace-nowrap shrink-0 shadow-sm focus:outline-none ${
                    isActive
                      ? tab.color + ' ring-2 ring-offset-2 ring-tafa-volcán'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{t(tab.labelKey)}</span>
                </button>
              )
            })}
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder={t('explorer:search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('explorer:search_label') || 'Buscar atractivos turísticos'}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-outfit text-tafa-text outline-none transition-all shadow-inner focus:border-tafa-volcán focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="bg-tafa-volcán hover:bg-tafa-lava text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{t('explorer:search_button')}</span>
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-gray-400 font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" /> {t('explorer:filter_label')}
            </span>
            {QUICK_FILTERS.map(f => {
              const isSelected = activeQuickFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveQuickFilter(isSelected ? null : f)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border focus:outline-none ${
                    isSelected
                      ? 'bg-tafa-volcán text-white border-tafa-volcán shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t(f)} {isSelected && '✕'}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── GRID DE RESULTADOS (DESPEGAR CARDS LAYOUT) ─────────────────── */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-tafa-volcán border-t-transparent rounded-full animate-spin mx-auto" aria-label="Cargando" />
            <p className="text-tafa-muted text-sm font-medium">{t('common:loading')}</p>
          </div>
        ) : filteredLugares.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-gray-300 rounded-[28px] p-8 shadow-sm">
            <p className="text-tafa-muted font-medium mb-3">No se encontraron atractivos que coincidan con la búsqueda o filtro seleccionado.</p>
            <button
              onClick={() => { setSearch(''); setCategoria(''); setActiveQuickFilter(null); loadData(); }}
              className="bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-tafa-lava transition-colors focus:outline-none"
            >
              {t('explorer:close_modal')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLugares.map((l, i) => {
              const color = getColor(l.categoria)
              const translated = getTranslatedPlace(l.id, i18n.language, l.nombre, l.descripcion)
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedLugar(l)}
                  className="group bg-white rounded-[24px] border border-gray-200 hover:border-tafa-volcán/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header si existe */}
                    {l.imagen_url ? (
                      <div className="relative h-[180px] w-full overflow-hidden bg-gray-100">
                        <img
                          src={l.imagen_url}
                          alt={translated.nombre}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/places/plaza-de-armas.jpg'
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-md"
                            style={{ background: `${color}ea`, color: '#ffffff' }}
                          >
                            {renderCategoryIcon(l.categoria)}
                            {translateCategory(l.categoria)}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          {l.verificado === 1 || (l.verificado as any) === true ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                              <CheckCircle2 className="w-3 h-3 text-white" /> DIRCETUR
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-white bg-amber-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                              {t('explorer:under_review', 'Revisión')}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {l.distrito || 'Arequipa'}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="h-2 w-full" style={{ background: color }} />
                        <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span
                            className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5"
                            style={{ background: `${color}15`, color }}
                          >
                            {renderCategoryIcon(l.categoria)}
                            {translateCategory(l.categoria)}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="p-6 space-y-2">
                      <div>
                        <h3 className="font-outfit font-extrabold text-xl text-tafa-text leading-tight group-hover:text-tafa-volcán transition-colors">
                          {translated.nombre}
                        </h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                          <Landmark className="w-3.5 h-3.5 text-tafa-volcán shrink-0" />
                          {t('explorer:source_label')} {l.fuente}
                        </div>
                      </div>

                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {translated.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Footer Despegar Style */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block">{t('explorer:fee_label')}</span>
                      <span className="font-bold text-tafa-andino text-sm">{translatePrice(l.precio_entrada)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-800 border border-amber-400/40 px-3 py-1 rounded-full text-[11px] font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      +50 PTS TAFA
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedLugar && (() => {
        const modalTranslated = getTranslatedPlace(selectedLugar.id, i18n.language, selectedLugar.nombre, selectedLugar.descripcion)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-[32px] max-w-lg w-full overflow-hidden relative shadow-2xl animate-scale-up">
              
              {/* Modal Image Header */}
              {selectedLugar.imagen_url && (
                <div className="relative h-[220px] w-full">
                  <img
                    src={selectedLugar.imagen_url}
                    alt={modalTranslated.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <button
                    onClick={() => setSelectedLugar(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {translateCategory(selectedLugar.categoria)} · {selectedLugar.distrito}
                    </span>
                    <h3 className="text-2xl font-extrabold font-outfit leading-tight drop-shadow-md">
                      {modalTranslated.nombre}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-7 space-y-5">
                {!selectedLugar.imagen_url && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: `${getColor(selectedLugar.categoria)}18` }}
                      >
                        {renderCategoryIcon(selectedLugar.categoria)}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {translateCategory(selectedLugar.categoria)} · {selectedLugar.distrito}
                        </span>
                        <h3 className="text-2xl font-extrabold font-outfit text-tafa-text leading-tight">
                          {modalTranslated.nombre}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLugar(null)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <p className="text-tafa-text text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {modalTranslated.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                      <Clock className="w-3.5 h-3.5 text-tafa-volcán" /> {t('explorer:hours_label', 'Horario Oficial')}
                    </div>
                    <div className="font-bold text-tafa-text">{selectedLugar.horario || 'No especificado'}</div>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                      <Tag className="w-3.5 h-3.5 text-tafa-volcán" /> {t('explorer:fee_label')}
                    </div>
                    <div className="font-bold text-tafa-andino">{translatePrice(selectedLugar.precio_entrada)}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {t('explorer:source_label')} <strong className="text-tafa-text">{selectedLugar.fuente}</strong>
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20reservar%20mi%20visita%20o%20tour%20para:%20${encodeURIComponent(selectedLugar.nombre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        alert('¡Ganaste +100 PTS TAFA por consultar reserva oficial al WhatsApp 921 378 349!')
                      }}
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 no-underline"
                    >
                      <PhoneCall className="w-4 h-4 text-white" />
                      <span>{t('explorer:reserve_whatsapp')}</span>
                    </a>
                    <button
                      onClick={() => setSelectedLugar(null)}
                      className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors"
                    >
                      {t('explorer:close_modal')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}
