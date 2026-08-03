import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, CheckCircle, Send } from 'lucide-react'
import { submitEncuesta } from '@/services/api'

interface SurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function SurveyModal({ isOpen, onClose, onSuccess }: SurveyModalProps) {
  const [step, setStep] = useState(1)
  const [origen, setOrigen] = useState('')
  const [motivo, setMotivo] = useState('')
  const [satisfaccion, setSatisfaccion] = useState(5)
  const [gasto, setGasto] = useState('')
  const [dias, setDias] = useState('3')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origen.trim()) return alert('Por favor ingresa tu origen')
    
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
      alert('Error al enviar la encuesta')
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white border border-black/10 rounded-[32px] max-w-md w-full p-8 relative shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-tafa-muted hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold font-outfit text-tafa-text mb-2">¡Gracias por tu encuesta!</h3>
              <p className="text-tafa-muted text-sm mb-6 leading-relaxed">
                Tus respuestas se han guardado de forma anónima en el backend de TAFA conforme a la Ley 29733.
              </p>
              <button
                onClick={handleReset}
                className="bg-tafa-dark text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 bg-tafa-volcán/10 text-tafa-volcán px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  📝 Encuesta Turística Oficial
                </div>
                <h3 className="text-2xl font-bold font-outfit text-tafa-text">¿Cómo fue tu visita a Arequipa?</h3>
                <p className="text-tafa-muted text-xs mt-1">Tu opinión ayuda a mejorar los servicios de la región.</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-tafa-text mb-1.5">¿De qué ciudad o país nos visitas? *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Lima, Cusco, Buenos Aires, Madrid..."
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-tafa-volcán transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-tafa-text mb-1.5">Motivo principal de visita</label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                  >
                    <option value="Vacaciones">🌴 Vacaciones / Descanso</option>
                    <option value="Turismo cultural">🏛️ Turismo Cultural e Histórico</option>
                    <option value="Gastronomía">🍲 Gastronomía Arequipeña</option>
                    <option value="Aventura">🧗 Aventura / Trekking Colca</option>
                    <option value="Negocios">💼 Negocios / Eventos</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-tafa-text mb-1.5">Días de estadía</label>
                    <input
                      type="number"
                      min="1"
                      value={dias}
                      onChange={(e) => setDias(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-tafa-text mb-1.5">Gasto estimado (S/.)</label>
                    <input
                      type="number"
                      placeholder="Ej: 500"
                      value={gasto}
                      onChange={(e) => setGasto(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-tafa-text mb-2">Calificación de tu experiencia (1 a 5 estrellas)</label>
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl border border-black/5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSatisfaccion(star)}
                        className={`text-2xl transition-transform hover:scale-125 ${
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-tafa-lava transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar encuesta'}
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
