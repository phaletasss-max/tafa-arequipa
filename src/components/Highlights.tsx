import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { CheckCircle2, Search, Filter, Clock, Tag, X, Landmark, TreePine, Castle, Compass, Utensils, Mountain, Award, MapPin, Accessibility, Sparkles } from 'lucide-react'
import { getLugaresSupabase } from '@/services/supabaseService'
import { Lugar } from '@/services/api'

// Pestañas Estilo Despegar.com para Navegación de Turismo
const DESPEGAR_TABS = [
  { id: '', label: 'Ver Todo Arequipa', icon: Sparkles, color: 'bg-tafa-volcán text-white' },
  { id: 'Patrimonio', label: 'Patrimonio & Monumentos', icon: Landmark, color: 'bg-purple-600 text-white' },
  { id: 'Naturaleza', label: 'Naturaleza & Cañones', icon: TreePine, color: 'bg-emerald-600 text-white' },
  { id: 'Centro Histórico', label: 'Centro Histórico', icon: Castle, color: 'bg-red-600 text-white' },
  { id: 'Cultural', label: 'Cultura & Rutas', icon: Compass, color: 'bg-amber-600 text-white' },
]

// Quick Filters Despegar Style
const QUICK_FILTERS = [
  'Verificado DIRCETUR',
  'Acceso Libre',
  'Cercado de Arequipa',
  'Yanahuara',
  'Cañón del Colca',
  'Ruta del Sillar',
]

export default function Highlights() {
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
      const data = await getLugaresSupabase(categoria || undefined, search || undefined)
      setLugares(data)
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
    if (activeQuickFilter === 'Verificado DIRCETUR') {
      return l.verificado === 1 || (l.verificado as any) === true
    }
    if (activeQuickFilter === 'Acceso Libre') {
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
            <Sparkles className="w-3.5 h-3.5" /> Explorador Turístico Oficial · Estilo Despegar
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl md:text-5xl font-extrabold text-tafa-text tracking-tight leading-tight mb-4"
          >
            Encuentra y planifica tus mejores experiencias en Arequipa
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-tafa-muted text-base leading-relaxed"
          >
            Información turística unificada de MINCETUR, DIRCETUR y AUTOCOLCA con filtros inteligentes, accesibilidad y puntos TAFA Explorer Pass.
          </motion.p>
        </div>

        {/* ── DESPEGAR-STYLE BUSCADOR & BARRA DE PESTAÑAS ───────────────── */}
        <div className="bg-white rounded-[28px] p-6 shadow-xl border border-gray-200/80 mb-12 space-y-5">
          
          {/* Top Category Tabs (Estilo Despegar) */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 no-scrollbar">
            {DESPEGAR_TABS.map(tab => {
              const Icon = tab.icon
              const isActive = categoria === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoria(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-outfit uppercase tracking-wider transition-all whitespace-nowrap shrink-0 shadow-sm ${
                    isActive
                      ? tab.color + ' ring-2 ring-offset-2 ring-tafa-volcán'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="¿Qué atractivo o lugar deseas explorar? (Ej: Catedral, Colca, Sillar)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-outfit text-tafa-text outline-none focus:border-tafa-volcán focus:bg-white transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="bg-tafa-volcán hover:bg-tafa-lava text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Buscar Atractivos</span>
            </button>
          </form>

          {/* Quick Filter Tags (Chips estilo Despegar) */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-gray-400 font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtros rápidos:
            </span>
            {QUICK_FILTERS.map(f => {
              const isSelected = activeQuickFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveQuickFilter(isSelected ? null : f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-tafa-volcán text-white border-tafa-volcán shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {f} {isSelected && '✕'}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── GRID DE RESULTADOS (DESPEGAR CARDS LAYOUT) ─────────────────── */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-tafa-volcán border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-tafa-muted text-sm font-medium">Cargando inventario oficial desde Supabase PostgreSQL...</p>
          </div>
        ) : filteredLugares.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-gray-300 rounded-[28px] p-8 shadow-sm">
            <p className="text-tafa-muted font-medium mb-3">No se encontraron atractivos que coincidan con la búsqueda o filtro seleccionado.</p>
            <button
              onClick={() => { setSearch(''); setCategoria(''); setActiveQuickFilter(null); loadData(); }}
              className="bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-tafa-lava transition-colors"
            >
              Limpiar Filtros y Mostrar Todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLugares.map((l, i) => {
              const color = getColor(l.categoria)
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
                  {/* Top Bar Accent */}
                  <div>
                    <div className="h-2 w-full" style={{ background: color }} />

                    <div className="p-6 space-y-3">
                      {/* Badge Header: Category + Verification Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5"
                          style={{ background: `${color}15`, color }}
                        >
                          {renderCategoryIcon(l.categoria)}
                          {l.categoria}
                        </span>

                        {l.verificado === 1 || (l.verificado as any) === true ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DIRCETUR
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Revisión
                          </span>
                        )}
                      </div>

                      {/* Title & Location */}
                      <div>
                        <h3 className="font-outfit font-extrabold text-xl text-tafa-text leading-tight group-hover:text-tafa-volcán transition-colors">
                          {l.nombre}
                        </h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-tafa-volcán shrink-0" />
                          {l.distrito || 'Arequipa'} · {l.fuente}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {l.descripcion || 'Atractivo turístico verificado en el catálogo regional de Arequipa.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Footer Despegar Style */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block">Ingreso / Tarifa</span>
                      <span className="font-bold text-tafa-andino text-sm">{l.precio_entrada || 'Consultar'}</span>
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
      {selectedLugar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-[32px] max-w-lg w-full p-8 relative shadow-2xl animate-scale-up">
            <button
              onClick={() => setSelectedLugar(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${getColor(selectedLugar.categoria)}18` }}
              >
                {renderCategoryIcon(selectedLugar.categoria)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {selectedLugar.categoria} · {selectedLugar.distrito}
                </span>
                <h3 className="text-2xl font-extrabold font-outfit text-tafa-text leading-tight">
                  {selectedLugar.nombre}
                </h3>
              </div>
            </div>

            <p className="text-tafa-text text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {selectedLugar.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-tafa-volcán" /> Horario Oficial
                </div>
                <div className="font-bold text-tafa-text">{selectedLugar.horario || 'No especificado'}</div>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                  <Tag className="w-3.5 h-3.5 text-tafa-volcán" /> Tarifa Ingreso
                </div>
                <div className="font-bold text-tafa-andino">{selectedLugar.precio_entrada || 'Gratuito'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Fuente oficial: <strong className="text-tafa-text">{selectedLugar.fuente}</strong>
              </span>
              <button
                onClick={() => setSelectedLugar(null)}
                className="bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-tafa-lava transition-colors shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
