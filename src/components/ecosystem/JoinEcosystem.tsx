import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, ShieldCheck, Award, ArrowUpRight, Send, CheckCircle2, FileText, CheckSquare, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function JoinEcosystem() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [taxId, setTaxId] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('Picantería Tradicional')
  const [district, setDistrict] = useState('Yanahuara')
  const [hasRuc, setHasRuc] = useState(true)
  const [hasDircetur, setHasDircetur] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!taxId.trim() || !companyName.trim() || !email.trim()) {
      return alert('Por favor completa todos los campos requeridos.')
    }

    try {
      setLoading(true)
      const { error } = await supabase.from('applications').insert([
        {
          tax_id: taxId.trim(),
          company_name: companyName.trim(),
          contact_email: email.trim(),
          contact_phone: phone.trim(),
          category,
          district,
          status: 'pending',
          notes: `RUC Activo: ${hasRuc ? 'Sí' : 'No'} | Registro DIRCETUR: ${hasDircetur ? 'Sí' : 'No'}`,
        },
      ])

      if (error) console.warn('Advertencia postulación Supabase:', error.message)
      setSubmitted(true)
    } catch (err) {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ecosistema" className="bg-[#0a0a0a] text-white py-32 px-6 border-t border-white/10" ref={ref}>
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-tafa-volcán/20 text-tafa-volcán border border-tafa-volcán/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Building2 className="w-4 h-4" /> Join TAFA Ecosystem
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            Forma parte del Ecosistema Nacional de Turismo Inteligente
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-base md:text-lg leading-relaxed"
          >
            Conectamos restaurantes tradicionales, hospedajes, artesanos y operadores turísticos formalizados con miles de visitantes a través del programa Discover More.
          </motion.p>
        </div>

        {/* Requirements & Standards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-white">Programa Discover More</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Integración al catálogo oficial de recompensas del TAFA Explorer Pass. Los turistas desbloquean experiencias exclusivas al visitar tu establecimiento.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-tafa-volcán/20 text-tafa-volcán flex items-center justify-center text-xl font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-white">Estándares DIRCETUR</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Verificación oficial de la oferta con distintivo regional DIRCETUR / MINCETUR, garantizando la calidad y reputación de todo el ecosistema.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-white">Requisitos de Ingreso</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              RUC activo y habido, licencia municipal de funcionamiento vigente y compromiso con infraestructura accesible WCAG 2.1.
            </p>
          </div>
        </div>

        {/* Official Ecosystem Application Form */}
        <div className="bg-tafa-dark border border-white/15 rounded-[36px] p-8 md:p-12 max-w-[800px] mx-auto shadow-2xl">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">Postulación Recibida</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                Tu solicitud ha ingresado a la etapa de Evaluación del Ecosistema TAFA. Nuestro equipo técnico validará tu RUC y distintivo DIRCETUR antes del alta definitiva.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-white/10 pb-4 mb-6">
                <h3 className="text-2xl font-bold font-outfit text-white">Formulario de Postulación de Aliados MYPE</h3>
                <p className="text-xs text-gray-400 mt-1">Ingresa tus datos comerciales para unirte a la red regional de turismo inteligente.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">RUC del Negocio (11 dígitos) *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="Ej: 20123456781"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-tafa-volcán"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Razón Social / Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: La Nueva Palomino E.I.R.L."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-tafa-volcán"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Correo de Contacto Oficial *</label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-tafa-volcán"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    placeholder="Ej: 954123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-tafa-volcán"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Categoría de Servicio</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Picantería Tradicional">Picantería Tradicional</option>
                    <option value="Restaurante Gourmet / Fusión">Restaurante Gourmet / Fusión</option>
                    <option value="Taller de Artesanías & Sillar">Taller de Artesanías & Sillar</option>
                    <option value="Hospedaje / Hotel Boutique">Hospedaje / Hotel Boutique</option>
                    <option value="Operador Turístico / Guías">Operador Turístico / Guías</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Distrito de Ubicación</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Yanahuara">Yanahuara</option>
                    <option value="Cercado">Cercado</option>
                    <option value="Cayma">Cayma</option>
                    <option value="Paucarpata">Paucarpata</option>
                    <option value="Sabandía">Sabandía</option>
                    <option value="Cerro Colorado">Cerro Colorado</option>
                  </select>
                </div>
              </div>

              {/* Declaración Jurada de Requisitos */}
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <div className="font-semibold text-amber-400 mb-1">Verificación de Requisitos Obligatorios:</div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={hasRuc}
                    onChange={(e) => setHasRuc(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-tafa-volcán"
                  />
                  <span>Cuento con RUC activo y habido en SUNAT</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={hasDircetur}
                    onChange={(e) => setHasDircetur(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-tafa-volcán"
                  />
                  <span>Cuento con distintivo oficial o registro de prestador DIRCETUR</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-tafa-volcán hover:bg-tafa-lava text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {loading ? 'Enviando Postulación...' : 'Enviar Postulación de Aliado'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
