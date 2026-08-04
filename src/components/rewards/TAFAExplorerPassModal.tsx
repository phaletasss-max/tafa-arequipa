import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Award, CheckCircle, Ticket, Gift, ShieldCheck } from 'lucide-react'
import { registerTAFAExplorerPass, TAFAExplorerPassUser, getRecompensasCatalogo, RecompensaCatalogo } from '@/services/tafaMasterService'

interface TAFAExplorerPassModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TAFAExplorerPassModal({ isOpen, onClose }: TAFAExplorerPassModalProps) {
  const { t } = useTranslation(['forms', 'common', 'modals'])
  const [user, setUser] = useState<TAFAExplorerPassUser | null>(null)
  const [recompensas, setRecompensas] = useState<RecompensaCatalogo[]>([])
  const [activeTab, setActiveTab] = useState<'pass' | 'recompensas' | 'registro'>('pass')

  // Formulario de registro si no tiene pass
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [tipoDoc, setTipoDoc] = useState<'DNI' | 'PASAPORTE' | 'CE' | 'OTRO'>('DNI')
  const [numDoc, setNumDoc] = useState('')
  const [usaSillaRuedas, setUsaSillaRuedas] = useState(false)
  const [bajaVision, setBajaVision] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tafa_explorer_pass_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setActiveTab('pass')
      } catch (e) {}
    } else {
      setActiveTab('registro')
    }

    getRecompensasCatalogo().then(setRecompensas)
  }, [isOpen])

  if (!isOpen) return null

  async function handleRegisterPass(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return alert(t('forms:required_name_email'))

    try {
      setLoading(true)
      const newUser = await registerTAFAExplorerPass(nombre, email, tipoDoc, numDoc, {
        usa_silla_ruedas: usaSillaRuedas,
        baja_vision: bajaVision,
      })
      setUser(newUser)
      setActiveTab('pass')
    } catch (err) {
      alert(t('forms:pass_register_error'))
    } finally {
      setLoading(false)
    }
  }

  function handleRedeem(r: RecompensaCatalogo) {
    if (!user) return setActiveTab('registro')
    if (user.puntos_acumulados < r.puntos_requeridos) {
      return alert(t('forms:pass_redeem_error', { requiredPoints: r.puntos_requeridos, currentPoints: user.puntos_acumulados }))
    }

    const updatedPuntos = user.puntos_acumulados - r.puntos_requeridos
    const updatedUser = { ...user, puntos_acumulados: updatedPuntos }
    setUser(updatedUser)
    localStorage.setItem('tafa_explorer_pass_user', JSON.stringify(updatedUser))

    setRedeemSuccess(t('forms:pass_redeem_success', { passCode: user.tafa_explorer_pass }))
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-tafa-dark border border-white/20 rounded-[36px] max-w-lg w-full p-8 text-white relative shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {t('modals:explorer_pass_header')}
              </span>
              <h3 className="text-2xl font-bold font-outfit text-white">
                TAFA Explorer Pass
              </h3>
            </div>
          </div>

          {/* Sub-Navegación */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-6">
            <button
              onClick={() => setActiveTab(user ? 'pass' : 'registro')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'pass' || activeTab === 'registro' ? 'bg-tafa-volcán text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t('forms:my_tafa_pass')}
            </button>
            <button
              onClick={() => setActiveTab('recompensas')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'recompensas' ? 'bg-tafa-volcán text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t('forms:reward_catalog')}
            </button>
          </div>

          {/* TAB 1: Mi Pass o Registro */}
          {activeTab === 'pass' && user && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 p-6 rounded-[28px] border border-amber-400/40 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-200">TAFA Explorer Pass</span>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mb-1 tracking-wider">{user.tafa_explorer_pass}</div>
                <div className="text-xs text-amber-100">{user.nombre_completo} · {user.tipo_doc}: {user.num_doc}</div>

                <div className="mt-4 pt-3 border-t border-amber-500/40 flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>{t('forms:points_accumulated')}</span>
                  <span className="text-lg text-white font-outfit">{user.puntos_acumulados} PTS</span>
                </div>
              </div>

              {redeemSuccess && (
                <div className="p-4 bg-green-950/60 border border-green-500/40 rounded-2xl text-xs text-green-300">
                  {redeemSuccess}
                </div>
              )}

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs text-gray-300 space-y-1">
                <div className="font-bold text-white mb-1">{t('forms:how_to_earn_points')}</div>
                <div>· {t('forms:earn_points_visit')}</div>
                <div>· {t('forms:earn_points_survey')}</div>
                <div>· {t('forms:earn_points_partner')}</div>
              </div>
            </div>
          )}

          {activeTab === 'registro' && !user && (
            <form onSubmit={handleRegisterPass} className="space-y-4">
              <div className="text-xs text-gray-300">
                {t('forms:pass_intro')}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">{t('forms:full_name_label')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('forms:full_name_placeholder')}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">{t('forms:email_label')}</label>
                <input
                  type="email"
                  required
                  placeholder={t('forms:email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">{t('forms:document_label')}</label>
                  <select
                    value={tipoDoc}
                    onChange={(e) => setTipoDoc(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="DNI">DNI (Perú)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="CE">Carnet Extranjería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">{t('forms:number_label')}</label>
                  <input
                    type="text"
                    placeholder={t('forms:number_placeholder')}
                    value={numDoc}
                    onChange={(e) => setNumDoc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs">
                <div className="font-semibold text-amber-400 mb-2">{t('forms:accessibility_needs_title')}</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={usaSillaRuedas}
                      onChange={(e) => setUsaSillaRuedas(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-amber-500"
                    />
                    <span>{t('forms:wheelchair_need')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={bajaVision}
                      onChange={(e) => setBajaVision(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-amber-500"
                    />
                    <span>{t('forms:low_vision_need')}</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? t('forms:generating_pass') : t('forms:create_pass_button')}
              </button>
            </form>
          )}

          {/* TAB 2: Catálogo de Recompensas */}
          {activeTab === 'recompensas' && (
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 text-xs">
              {recompensas.map((r) => (
                <div key={r.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{r.titulo}</div>
                    <div className="text-gray-400 leading-relaxed text-[11px]">{r.descripcion}</div>
                    <div className="text-amber-400 font-bold">{r.puntos_requeridos} PTS requeridos</div>
                  </div>
                  <button
                    onClick={() => handleRedeem(r)}
                    className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-xl font-bold text-xs shrink-0 transition-colors"
                  >
                    {t('forms:redeem_button')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
