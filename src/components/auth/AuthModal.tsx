import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, ShieldCheck, UserCheck, Globe, Lock, AlertCircle, CheckCircle2, Mail, UserPlus, LogIn } from 'lucide-react'
import { validateIdentityDocument, ValidationResult } from '@/utils/identityValidator'
import { signUpTourist, signInTourist, type TAFAProfile } from '@/services/authService'
import { useFocusTrap } from '@/features/accessibility/hooks/useFocusTrap'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: (user: { nombre: string; docType: string; docNum: string; profile?: TAFAProfile }) => void
  pendingQRSlug?: string
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, pendingQRSlug }: AuthModalProps) {
  const { t } = useTranslation(['common', 'hero'])
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  // Inputs
  const [docType, setDocType] = useState<'DNI' | 'PASSPORT' | 'CE'>('DNI')
  const [docNumber, setDocNumber] = useState('')
  const [checkChar, setCheckChar] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pais, setPais] = useState('Perú')
  
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [successUser, setSuccessUser] = useState<string | null>(null)
  const [emailConfirmedNote, setEmailConfirmedNote] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)

    if (authMode === 'register') {
      const res = validateIdentityDocument(docType, docNumber, checkChar)
      setValidation(res)
      if (!res.isValid) return

      if (!nombre.trim() || !email.trim() || !password.trim()) {
        setAuthError('Completa tu nombre, correo electrónico y contraseña.')
        return
      }
      if (password.length < 6) {
        setAuthError('La contraseña debe tener al menos 6 caracteres.')
        return
      }

      setLoading(true)
      const result = await signUpTourist({
        fullName: nombre,
        email,
        password,
        docType,
        docNumber,
        country: docType === 'DNI' ? 'Perú' : pais,
      })
      setLoading(false)

      if (result.ok === false) {
        setAuthError(result.error)
        return
      }

      // El proyecto exige confirmar el correo: aún no hay sesión activa.
      if (result.ok === 'email_confirmation_required') {
        setEmailConfirmedNote(true)
        setSuccessUser(nombre.trim())
        return
      }

      setSuccessUser(result.profile.full_name)
      onAuthSuccess?.({
        nombre: result.profile.full_name,
        docType: result.profile.doc_type,
        docNum: result.profile.doc_number,
        profile: result.profile,
      })
    } else {
      if (!email.trim() || !password.trim()) {
        setAuthError('Ingresa tu correo electrónico y contraseña.')
        return
      }

      setLoading(true)
      const result = await signInTourist(email, password)
      setLoading(false)

      if (result.ok !== true) {
        setAuthError(result.ok === false ? result.error : 'Confirma tu correo para continuar.')
        return
      }

      setSuccessUser(result.profile.full_name)
      onAuthSuccess?.({
        nombre: result.profile.full_name,
        docType: result.profile.doc_type,
        docNum: result.profile.doc_number,
        profile: result.profile,
      })
    }
  }

  function handleReset() {
    setSuccessUser(null)
    setEmailConfirmedNote(false)
    setAuthError(null)
    setDocNumber('')
    setCheckChar('')
    setNombre('')
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
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
            aria-label="Cerrar diálogo de ingreso"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {successUser ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">
                {emailConfirmedNote ? `Casi listo, ${successUser}` : `¡Bienvenido a TAFA, ${successUser}!`}
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed max-w-xs mx-auto">
                {emailConfirmedNote
                  ? 'Tu cuenta fue creada. Confirma tu correo para activarla y empezar a acumular Puntos TAFA.'
                  : 'Tu perfil de turista ha sido autenticado correctamente. Ganaste tu Pase de Explorador Turístico TAFA de Arequipa.'}
              </p>
              {emailConfirmedNote && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-2xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Te hemos enviado un correo de confirmación a <strong>{email}</strong>.</span>
                </div>
              )}
              <button
                onClick={handleReset}
                className="bg-tafa-volcán text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-tafa-lava transition-colors"
              >
                Comenzar a explorar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 bg-tafa-volcán/20 text-tafa-volcán border border-tafa-volcán/40 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Acceso Oficial Turístico TAFA
                </div>
                <h2 id="auth-modal-title" className="text-2xl font-bold font-outfit text-white">
                  {authMode === 'register' ? 'Registro de Turista' : 'Iniciar Sesión'}
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  {authMode === 'register'
                    ? 'Crea tu cuenta para acumular puntos TAFA y audiorutas.'
                    : 'Ingresa con tu correo o documento registrado.'}
                </p>
              </div>

              {/* Pestañas de Selección: Iniciar Sesión vs Registro */}
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-5">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'login' ? 'bg-tafa-volcán text-white shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'register' ? 'bg-tafa-volcán text-white shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Crear Cuenta
                </button>
              </div>

              {authMode === 'register' ? (
                <>
                  {/* Selector de Tipo de Documento */}
                  <fieldset className="mb-4">
                    <legend className="sr-only">Tipo de documento de identidad</legend>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => { setDocType('DNI'); setValidation(null); }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${docType === 'DNI' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        DNI (Perú)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDocType('PASSPORT'); setValidation(null); }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${docType === 'PASSPORT' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        Pasaporte
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDocType('CE'); setValidation(null); }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${docType === 'CE' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        Carnet Ext.
                      </button>
                    </div>
                  </fieldset>

                  {/* Número de Documento */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Número de Documento</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={docNumber}
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      placeholder={docType === 'DNI' ? '8 dígitos (ej: 72345678)' : 'Número de documento'}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                    {validation && (
                      <p className={`text-[11px] mt-1 flex items-center gap-1 ${validation.isValid ? 'text-green-400' : 'text-amber-400'}`}>
                        {validation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {validation.message}
                      </p>
                    )}
                  </div>

                  {/* Nombre Completo */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Pedro Mamani Quispe"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                  </div>

                  {/* Correo Electrónico */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.correo@gmail.com"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Correo en Login */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.correo@gmail.com"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                  </div>

                  {/* Contraseña en Login */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                    />
                  </div>
                </>
              )}

              {authError && (
                <div
                  role="alert"
                  className="mb-4 bg-red-500/15 border border-red-500/40 rounded-2xl p-3 text-[11px] text-red-300 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tafa-volcán hover:bg-tafa-lava text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : authMode === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Cuenta & Reclamar Puntos</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
