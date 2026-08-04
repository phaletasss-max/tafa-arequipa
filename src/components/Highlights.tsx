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
  { id: 'Proyectos', label: 'Proyectos Estratégicos (10)', icon: Award, color: 'bg-blue-600 text-white' },
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

const STRATEGIC_PROJECTS_CARDS: Lugar[] = [
  {
    id: 101,
    nombre: 'Valle de los Volcanes de Andagua',
    categoria: 'Proyectos',
    distrito: 'Castilla · Andagua',
    descripcion: 'Campo volcánico fascinante único en Sudamérica con más de 80 conitos volcánicos extintos de baja altura (de 50 a 300 metros). Vuelos panorámicos, miradores de cristal y observatorio astroturístico.',
    lat: -15.4900,
    lng: -72.3500,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 102,
    nombre: 'Petroglifos de Toro Muerto y Valle de Majes',
    categoria: 'Proyectos',
    distrito: 'Castilla · Corire',
    descripcion: 'Uno de los campos de arte rupestre más extensos del mundo con más de 5,000 grabados en rocas volcánicas. App AR 3D, canotaje en río Majes y hoteles en bodegas pisqueras.',
    lat: -16.2234,
    lng: -72.4831,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 103,
    nombre: 'Cañón del Cotahuasi',
    categoria: 'Proyectos',
    distrito: 'La Unión · Cotahuasi',
    descripcion: 'El cañón más profundo de la tierra (3,535 m). Santuario virgen de cataratas como Sipia, bosques de puyas Raimondi y complejas termas de Luicho.',
    lat: -15.2100,
    lng: -72.8900,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 104,
    nombre: 'Cataratas de Pillones e Imata',
    categoria: 'Proyectos',
    distrito: 'Caylloma · San Antonio de Chuca',
    descripcion: 'Impresionante caída de agua rodeada de gigantescas columnas de piedra talladas por la erosión eólica. Parador térmico, puentes colgantes y trekking inclusivo.',
    lat: -15.8600,
    lng: -71.1900,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 105,
    nombre: 'Puerto Inka y Quebrada de la Waca',
    categoria: 'Proyectos',
    distrito: 'Caravelí · Atiquipa',
    descripcion: 'Antiguo puerto Inca donde se extraían mariscos para el Inca en Cusco. Puesta en valor del Camino Inca costero, muelle de kayak y ecolodges.',
    lat: -15.8450,
    lng: -74.3460,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 106,
    nombre: 'Caleta de Quilca y Puerto Matarani',
    categoria: 'Proyectos',
    distrito: 'Camaná e Islay',
    descripcion: 'Bahías históricas con rica biodiversidad marina, acantilados escarpados y gastronomía de pesca fresca. Circuito de lobos/pingüinos y buceo.',
    lat: -16.7150,
    lng: -72.4280,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 107,
    nombre: 'Laguna y Reserva de Salinas',
    categoria: 'Proyectos',
    distrito: 'San Juan de Tarucani',
    descripcion: 'Santuario de flamencos y espejos de sal a más de 4,300 msnm. Miradores de aves, glamping con domos solares y bus turístico.',
    lat: -16.3700,
    lng: -71.1400,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 108,
    nombre: 'Bosque de Piedras de Choqolaqa',
    categoria: 'Proyectos',
    distrito: 'Caylloma · Tisco',
    descripcion: 'Paisaje surrealista de torres rocosas blancas que simulan una ciudadela antigua petrificada. Campamento fotográfico y albergues comunales.',
    lat: -15.3500,
    lng: -71.4500,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 109,
    nombre: 'Represa de San José de Uzuña',
    categoria: 'Proyectos',
    distrito: 'Arequipa · Polobaya',
    descripcion: 'Espejo de agua rodeado de montañas ideal para deportes náuticos ecológicos, picnics familiares, kayaks y patio gastronómico de trucha frita.',
    lat: -16.5700,
    lng: -71.3800,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
  {
    id: 110,
    nombre: 'Quebrada de Culebrillas y Canteras de Sillar',
    categoria: 'Proyectos',
    distrito: 'Uchumayo / Yura / Cerro Colorado',
    descripcion: 'Cañones serpenteantes de sillar blanco con petroglifos preincas y canteras vivas. Centro de interpretación, senderos nocturnos y esculpido en vivo.',
    lat: -16.3572,
    lng: -71.5908,
    horario: 'Proyecto TAFA 2026',
    precio_entrada: 'Plan Regional',
    imagen_url: '/correcion-imagenes/ruta-del-sillar.jpg',
    fuente: 'Gobierno Regional / TAFA',
    verificado: 1,
    estado: 'activo',
  },
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
      const data = await getLugaresSupabase(categoria === 'Proyectos' ? undefined : (categoria || undefined), search || undefined)
      let combined = [...data, ...STRATEGIC_PROJECTS_CARDS]

      if (categoria === 'Proyectos') {
        combined = combined.filter(l => l.categoria === 'Proyectos')
      } else if (categoria) {
        combined = combined.filter(l => l.categoria === categoria)
      }

      setLugares(combined)
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
                  <div>
                    {/* Image Header si existe */}
                    {l.imagen_url ? (
                      <div className="relative h-[180px] w-full overflow-hidden bg-gray-100">
                        <img
                          src={l.imagen_url}
                          alt={l.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-md"
                            style={{ background: `${color}ea`, color: '#ffffff' }}
                          >
                            {renderCategoryIcon(l.categoria)}
                            {l.categoria}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          {l.verificado === 1 || (l.verificado as any) === true ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                              <CheckCircle2 className="w-3 h-3 text-white" /> DIRCETUR
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-white bg-amber-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                              Revisión
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
                            {l.categoria}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="p-6 space-y-2">
                      <div>
                        <h3 className="font-outfit font-extrabold text-xl text-tafa-text leading-tight group-hover:text-tafa-volcán transition-colors">
                          {l.nombre}
                        </h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                          <Landmark className="w-3.5 h-3.5 text-tafa-volcán shrink-0" />
                          Fuente: {l.fuente}
                        </div>
                      </div>

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
          <div className="bg-white border border-gray-200 rounded-[32px] max-w-lg w-full overflow-hidden relative shadow-2xl animate-scale-up">
            
            {/* Modal Image Header */}
            {selectedLugar.imagen_url && (
              <div className="relative h-[220px] w-full">
                <img
                  src={selectedLugar.imagen_url}
                  alt={selectedLugar.nombre}
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
                    {selectedLugar.categoria} · {selectedLugar.distrito}
                  </span>
                  <h3 className="text-2xl font-extrabold font-outfit leading-tight drop-shadow-md">
                    {selectedLugar.nombre}
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
                        {selectedLugar.categoria} · {selectedLugar.distrito}
                      </span>
                      <h3 className="text-2xl font-extrabold font-outfit text-tafa-text leading-tight">
                        {selectedLugar.nombre}
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
                {selectedLugar.descripcion}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
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
        </div>
      )}
    </section>
  )
}
