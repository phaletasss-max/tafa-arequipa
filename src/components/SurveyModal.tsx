import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Star, CheckCircle, Send } from 'lucide-react'
import { submitEncuesta } from '@/services/api'
import { useFocusTrap } from '@/features/accessibility/hooks/useFocusTrap'

interface SurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function SurveyModal({ isOpen, onClose, onSuccess }: SurveyModalProps) {
  const { t } = useTranslation(['common', 'forms', 'modals'])
  const [step, setStep] = useState(1)
  const [origen, setOrigen] = useState('')
  const [motivo, setMotivo] = useState('')
  const [satisfaccion, setSatisfaccion] = useState(5)
  const [gasto, setGasto] = useState('')
  const [dias, setDias] = useState('3')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Focus trap ref
  const focusTrapRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
    returnFocusRef: closeButtonRef,
  })

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origen.trim()) return alert(t('forms:origin_required'))
    
    try {
      setLoading(true)
      await submitEncuesta({
        origen: origen.trim(),
        motivo: motivo || 'Turismo cultural',
        satisfaccion,
        gasto_promedio: parseFloat(gasto) || 0,
        dias_estancia: parseInt(dias) || 3,
      })
      setSubmitted(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      alert(t('forms:survey_submit_error'))
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSubmitted(false)
    setStep(1)
    onClose()
  }

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white border border-black/10 rounded-[32px] max-w-md w-full p-8 relative shadow-2xl overflow-hidden"
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar encuesta de satisfacción"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-tafa-muted hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold font-outfit text-tafa-text mb-2">{t('modals:survey_thanks_title')}</h3>
              <p className="text-tafa-muted text-sm mb-6 leading-relaxed">
                {t('modals:survey_thanks_body')}
              </p>
              <button
                onClick={handleReset}
                className="bg-tafa-dark text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                {t('common:close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 bg-tafa-volcán/10 text-tafa-volcán px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  📝 {t('forms:survey_title')}
                </div>
                <h2 id="survey-modal-title" className="text-2xl font-bold font-outfit text-tafa-text">{t('forms:survey_intro_title')}</h2>
                <p className="text-tafa-muted text-xs mt-1">{t('forms:survey_intro_body')}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="survey-origin" className="block text-xs font-semibold text-tafa-text mb-1.5">
                    {t('forms:origin_label')} <span aria-label="requerido">*</span>
                  </label>
                  <input
                    id="survey-origin"
                    type="text"
                    required
                    aria-required="true"
                    placeholder={t('forms:origin_placeholder')}
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-tafa-volcán"
                  />
                </div>

                <div>
                  <label htmlFor="survey-reason" className="block text-xs font-semibold text-tafa-text mb-1.5">
                    {t('forms:visit_reason_label')}
                  </label>
                  <select
                    id="survey-reason"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer transition-all focus:border-tafa-volcán"
                  >
                    <option value="Vacaciones">🌴 {t('forms:visit_reason_vacation')}</option>
                    <option value="Turismo cultural">🏛️ {t('forms:visit_reason_cultural')}</option>
                    <option value="Gastronomía">🍲 {t('forms:visit_reason_gastronomy')}</option>
                    <option value="Aventura">🧗 {t('forms:visit_reason_adventure')}</option>
                    <option value="Negocios">💼 {t('forms:visit_reason_business')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="survey-days" className="block text-xs font-semibold text-tafa-text mb-1.5">
                      {t('forms:stay_days_label')}
                    </label>
                    <input
                      id="survey-days"
                      type="number"
                      min="1"
                      value={dias}
                      onChange={(e) => setDias(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-tafa-volcán"
                    />
                  </div>
                  <div>
                    <label htmlFor="survey-spend" className="block text-xs font-semibold text-tafa-text mb-1.5">
                      {t('forms:estimated_spend_label')}
                    </label>
                    <input
                      id="survey-spend"
                      type="number"
                      placeholder={t('forms:estimated_spend_placeholder')}
                      value={gasto}
                      onChange={(e) => setGasto(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-tafa-volcán"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-tafa-text mb-2">
                    {t('forms:rating_label')}
                  </label>
                  <div 
                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl border border-black/5"
                    role="group"
                    aria-label="Calificación de satisfacción (1-5 estrellas)"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSatisfaccion(star)}
                        aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                        aria-pressed={star === satisfaccion}
                        className={`text-2xl transition-transform hover:scale-125 focus:scale-110 ${
                          star <= satisfaccion ? 'text-amber-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-tafa-muted hover:text-tafa-text transition-colors"
                >
                  {t('common:cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-tafa-lava transition-colors disabled:opacity-50"
                >
                  {loading ? t('forms:submitting') : t('forms:submit_survey')}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
