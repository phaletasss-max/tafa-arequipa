import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, Search, Filter, Clock, Tag, X } from 'lucide-react'
import { fetchLugares, Lugar } from '@/services/api'

export default function Highlights() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null)

  useEffect(() => {
    loadData()
  }, [categoria])

  async function loadData() {
    try {
      setLoading(true)
      const data = await fetchLugares({ categoria: categoria || undefined, search: search || undefined })
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

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Patrimonio': return '🏛️'
      case 'Naturaleza': return '🌿'
      case 'Centro Histórico': return '🏰'
      case 'Museo': return '🏺'
      case 'Cultural': return '🎭'
      case 'Mirador': return '🔭'
      case 'Arqueología': return '🗿'
      case 'Bienestar': return '♨️'
      default: return '📍'
    }
  }

  const getColor = (cat: string) => {
    switch (cat) {
      case 'Patrimonio': return '#8e44ad'
      case 'Naturaleza': return '#27ae60'
      case 'Centro Histórico': return '#c0392b'
      case 'Museo': return '#2980b9'
      case 'Cultural': return '#e67e22'
      case 'Mirador': return '#f39c12'
      default: return '#c0392b'
    }
  }

  return (
    <section id="explorar" className="bg-white py-32 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-tafa-volcán" />
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-tafa-volcán">
            Lugares Turísticos (Conectado a Backend)
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-[clamp(28px,3.5vw,48px)] font-medium text-tafa-text
                         leading-[1.1] tracking-[-0.03em] max-w-[540px]"
            >
              Inventario oficial verificado por DIRCETUR / MINCETUR
            </motion.h2>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tafa-muted" />
              <input
                type="text"
                placeholder="Buscar lugar o atractivo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f5f5f5] border border-black/10 rounded-full pl-10 pr-4 py-2.5
                           text-sm font-outfit text-tafa-text outline-none focus:border-tafa-volcán transition-all"
              />
            </form>

            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="appearance-none bg-[#f5f5f5] border border-black/10 rounded-full px-4 py-2.5 pr-8
                           text-sm font-outfit font-medium text-tafa-text outline-none cursor-pointer hover:border-black/20"
              >
                <option value="">Todas las categorías</option>
                <option value="Patrimonio">Patrimonio</option>
                <option value="Naturaleza">Naturaleza</option>
                <option value="Centro Histórico">Centro Histórico</option>
                <option value="Museo">Museo</option>
                <option value="Cultural">Cultural</option>
                <option value="Mirador">Mirador</option>
                <option value="Arqueología">Arqueología</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tafa-muted pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-tafa-volcán border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-tafa-muted text-sm font-medium">Cargando lugares desde la base de datos local...</p>
          </div>
        ) : lugares.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-black/10 rounded-[24px]">
            <p className="text-tafa-muted font-medium mb-2">No se encontraron lugares con los filtros actuales.</p>
            <button
              onClick={() => { setSearch(''); setCategoria(''); loadData(); }}
              className="text-tafa-volcán font-semibold text-sm hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lugares.map((l, i) => {
              const color = getColor(l.categoria)
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedLugar(l)}
                  className="group relative p-6 rounded-[20px] border border-black/[0.07]
                             bg-white hover:border-black/15 transition-all duration-300
                             cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[20px]"
                    style={{ background: color }}
                  />

                  <div className="flex items-start justify-between mb-4 mt-1">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${color}15` }}
                    >
                      {getEmoji(l.categoria)}
                    </div>
                    {l.verificado === 1 ? (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#27ae60] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Pendiente
                      </div>
                    )}
                  </div>

                  <h3 className="font-outfit font-semibold text-[18px] text-tafa-text mb-1 leading-tight group-hover:text-tafa-volcán transition-colors">
                    {l.nombre}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}18`, color }}
                    >
                      {l.categoria}
                    </span>
                    <span className="text-[12px] text-tafa-muted">· {l.distrito || 'Arequipa'}</span>
                  </div>

                  <p className="text-tafa-muted text-xs line-clamp-2 mb-4 leading-relaxed">
                    {l.descripcion || 'Sin descripción disponible.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <span className="text-[13px] text-tafa-andino font-semibold">
                      {l.precio_entrada || 'Consultar'}
                    </span>
                    <span className="text-[11px] text-tafa-muted bg-black/5 px-2.5 py-0.5 rounded-full font-medium">
                      {l.fuente}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

      </div>

      {/* Modal Detalle Lugar */}
      {selectedLugar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-black/10 rounded-[28px] max-w-lg w-full p-7 relative shadow-2xl animate-scale-up">
            <button
              onClick={() => setSelectedLugar(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-tafa-muted hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${getColor(selectedLugar.categoria)}18` }}
              >
                {getEmoji(selectedLugar.categoria)}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-tafa-muted">
                  {selectedLugar.categoria} · {selectedLugar.distrito}
                </span>
                <h3 className="text-2xl font-bold font-outfit text-tafa-text leading-tight">
                  {selectedLugar.nombre}
                </h3>
              </div>
            </div>

            <p className="text-tafa-text text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-black/5">
              {selectedLugar.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-tafa-muted font-medium mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Horario
                </div>
                <div className="font-semibold text-tafa-text">{selectedLugar.horario || 'No especificado'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-tafa-muted font-medium mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Precio Entrada
                </div>
                <div className="font-semibold text-tafa-andino">{selectedLugar.precio_entrada || 'Gratuito'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/10">
              <span className="text-xs text-tafa-muted">
                Fuente oficial: <strong className="text-tafa-text">{selectedLugar.fuente}</strong>
              </span>
              <button
                onClick={() => setSelectedLugar(null)}
                className="bg-tafa-dark text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
