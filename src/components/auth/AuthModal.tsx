import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, ShieldCheck, UserCheck, Globe, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { validateIdentityDocument, ValidationResult } from '@/utils/identityValidator'
import { supabase } from '@/lib/supabase'
import { useFocusTrap } from '@/features/accessibility/hooks/useFocusTrap'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: (user: { nombre: string; docType: string; docNum: string }) => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useTranslation(['common', 'hero'])
  const [docType, setDocType] = useState<'DNI' | 'PASSPORT' | 'CE'>('DNI')
  const [docNumber, setDocNumber] = useState('')
  const [checkChar, setCheckChar] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [pais, setPais] = useState('Perú')
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [successUser, setSuccessUser] = useState<string | null>(null)

  // Focus trap ref para modal accesible
  const focusTrapRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
    returnFocusRef: closeButtonRef,
  })

  if (!isOpen) return null

  function handleDocumentChange(val: string) {
    setDocNumber(val)
    if (val.length >= 6) {
      const res = validateIdentityDocument(docType, val, checkChar)
      setValidation(res)
    } else {
      setValidation(null)
    }
  }

  function handleCheckCharChange(val: string) {
    setCheckChar(val)
    if (docNumber.length >= 8) {
      const res = validateIdentityDocument(docType, docNumber, val)
      setValidation(res)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = validateIdentityDocument(docType, docNumber, checkChar)
    setValidation(res)

    if (!res.isValid) {
      return
    }

    if (!nombre.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y correo electrónico.')
      return
    }

    try {
      setLoading(true)

      // Intentar guardar usuario en Supabase
      const { data, error } = await supabase.from('usuarios').insert([
        {
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          password: 'temp_tourist_pass', // Contraseña temporal
          rol: 'publico',
        },
      ])

      if (error && !error.message.includes('unique')) {
        console.warn('Supabase DB warning:', error.message)
      }

      // Guardar sesión de turista en localStorage
      const touristUser = {
        nombre: nombre.trim(),
        email: email.trim(),
        docType,
        docNum: docNumber,
        pais: docType === 'DNI' ? 'Perú' : pais,
      }
      localStorage.setItem('tafa_tourist_user', JSON.stringify(touristUser))

      setSuccessUser(nombre.trim())
      if (onAuthSuccess) onAuthSuccess(touristUser)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSuccessUser(null)
    setDocNumber('')
    setCheckChar('')
    setNombre('')
    setEmail('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="presentation"
        onClick={(e) => {
          // Cerrar solo si se hace click en el fondo, no en el modal
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-tafa-dark border border-white/20 rounded-[36px] max-w-md w-full p-8 text-white relative shadow-2xl overflow-hidden"
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar diálogo de verificación de identidad"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {successUser ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">¡Bienvenido a Arequipa, {successUser}!</h3>
              <p className="text-gray-300 text-xs leading-relaxed max-w-xs mx-auto">
                Tu identidad ha sido verificada correctamente ({docType}: {docNumber}). Ahora puedes acceder a audiorutas personalizadas y beneficios para visitantes.
              </p>
              <button
                onClick={handleReset}
                className="bg-tafa-volcán text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-tafa-lava transition-colors"
              >
                Comenzar a explorar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 bg-tafa-volcán/20 text-tafa-volcán border border-tafa-volcán/40 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <UserCheck className="w-3.5 h-3.5" /> Verificación de Identidad Turística
                </div>
                <h2 id="auth-modal-title" className="text-2xl font-bold font-outfit text-white">Ingreso para Turistas</h2>
                <p className="text-gray-400 text-xs mt-1">Verificación segura para residentes y visitantes internacionales.</p>
              </div>

              {/* Selector de Tipo de Documento */}
              <fieldset className="mb-5">
                <legend className="sr-only">Tipo de documento de identidad</legend>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setDocType('DNI'); setValidation(null); }}
                    aria-pressed={docType === 'DNI'}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${docType === 'DNI' ? 'bg-tafa-volcán text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    DNI (Perú)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDocType('PASSPORT'); setValidation(null); }}
                    aria-pressed={docType === 'PASSPORT'}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${docType === 'PASSPORT' ? 'bg-tafa-volcán text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    Pasaporte
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDocType('CE'); setValidation(null); }}
                    aria-pressed={docType === 'CE'}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${docType === 'CE' ? 'bg-tafa-volcán text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    CE Extranjería
                  </button>
                </div>
              </fieldset>

              <div className="space-y-4 mb-6">
                {/* Campo Número de Documento */}
                <div>
                  <label htmlFor="doc-number" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {docType === 'DNI' ? 'Número de DNI (8 dígitos) ' : docType === 'PASSPORT' ? 'Número de Pasaporte ' : 'Carnet de Extranjería (9 dígitos) '}
                    <span aria-label="requerido">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="doc-number"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={validation !== null && !validation.isValid}
                      aria-describedby={validation ? 'doc-error' : undefined}
                      maxLength={docType === 'DNI' ? 8 : docType === 'CE' ? 9 : 12}
                      placeholder={docType === 'DNI' ? '70123456' : docType === 'PASSPORT' ? 'A12345678' : '000123456'}
                      value={docNumber}
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all focus:border-tafa-volcán"
                    />

                    {/* Dígito Verificador DNI */}
                    {docType === 'DNI' && (
                      <input
                        id="doc-check-char"
                        type="text"
                        maxLength={1}
                        placeholder="Verif. (ej: 4 o K)"
                        value={checkChar}
                        onChange={(e) => handleCheckCharChange(e.target.value)}
                        className="w-24 bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-sm text-white text-center uppercase transition-all focus:border-tafa-volcán"
                        aria-label="Dígito verificador del DNI"
                      />
                    )}
                  </div>

                  {/* Feedback de Validación con aria-live */}
                  {validation && (
                    <div 
                      id="doc-error"
                      role="alert"
                      aria-live="assertive"
                      className={`mt-2 text-xs flex items-center gap-1.5 ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {validation.isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{validation.message}</span>
                    </div>
                  )}
                </div>

                {/* País de origen si es pasaporte/CE */}
                {docType !== 'DNI' && (
                  <div>
                    <label htmlFor="doc-country" className="block text-xs font-semibold text-gray-300 mb-1.5">
                      País de Origen <span aria-label="requerido">*</span>
                    </label>
                    <input
                      id="doc-country"
                      type="text"
                      required
                      aria-required="true"
                      placeholder="Ej: España, Argentina, Estados Unidos..."
                      value={pais}
                      onChange={(e) => setPais(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all focus:border-tafa-volcán"
                    />
                  </div>
                )}

                {/* Nombre Completo */}
                <div>
                  <label htmlFor="full-name" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nombres y Apellidos <span aria-label="requerido">*</span>
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    aria-required="true"
                    placeholder="Ej: Carlos Mendoza Rossi"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all focus:border-tafa-volcán"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Correo Electrónico <span aria-label="requerido">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    aria-required="true"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white transition-all focus:border-tafa-volcán"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  {t('common:cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-tafa-lava transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading ? t('common:loading') : t('common:confirm')}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
