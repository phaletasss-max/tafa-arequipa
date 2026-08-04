import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  QrCode, MapPin, Clock, Ticket, Phone, Globe, Sparkles,
  ShieldCheck, LogIn, CheckCircle2, AlertCircle, ArrowLeft,
} from 'lucide-react'
import AuthModal from '@/components/auth/AuthModal'
import {
  getStoredProfile,
  saveProfileSession,
  setPendingQRCheckIn,
  getPendingQRCheckIn,
  clearPendingQRCheckIn,
  type TAFAProfile,
} from '@/services/authService'
import { getQRLanding, registerQRCheckIn, type QRLandingData, type CheckInResult } from '@/services/checkInService'

type PageState = 'loading' | 'not_found' | 'ready' | 'checking_in' | 'checked_in' | 'error'

export default function QRCheckInPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [landing, setLanding] = useState<QRLandingData | null>(null)
  const [profile, setProfile] = useState<TAFAProfile | null>(getStoredProfile())
  const [pageState, setPageState] = useState<PageState>('loading')
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const performCheckIn = useCallback(async (currentProfile: TAFAProfile, qrSlug: string) => {
    setPageState('checking_in')
    const result = await registerQRCheckIn(currentProfile.id, qrSlug)
    setCheckInResult(result)

    if (result.success) {
      const updated = { ...currentProfile, points_earned: result.total_points ?? currentProfile.points_earned }
      if (!result.already_visited) {
        updated.visited_places = currentProfile.visited_places + 1
      }
      saveProfileSession(updated)
      setProfile(updated)
      setPageState('checked_in')
    } else {
      setErrorMsg(result.error === 'daily_cap_reached'
        ? 'Has alcanzado el límite diario de puntos TAFA (500 pts). ¡Vuelve mañana!'
        : 'No se pudo registrar tu visita. Intenta de nuevo.')
      setPageState('error')
    }
  }, [])

  useEffect(() => {
    if (!slug) {
      setPageState('not_found')
      return
    }

    getQRLanding(slug).then((data) => {
      if (!data) {
        setPageState('not_found')
        return
      }
      setLanding(data)
      setPageState('ready')
    })
  }, [slug])

  useEffect(() => {
    const pending = getPendingQRCheckIn()
    if (pending && pending === slug && profile && pageState === 'ready') {
      clearPendingQRCheckIn()
      performCheckIn(profile, slug)
    }
  }, [slug, profile, pageState, performCheckIn])

  function handleLoginClick() {
    setPendingQRCheckIn(slug)
    setIsAuthOpen(true)
  }

  function handleAuthSuccess(user: { nombre: string; docType: string; docNum: string; profile?: TAFAProfile }) {
    setIsAuthOpen(false)
    const currentProfile = user.profile ?? getStoredProfile()
    if (currentProfile) {
      setProfile(currentProfile)
      performCheckIn(currentProfile, slug)
    }
  }

  function handleCheckInClick() {
    if (!profile) {
      handleLoginClick()
      return
    }
    performCheckIn(profile, slug)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-tafa-dark flex items-center justify-center">
        <div className="text-white text-sm animate-pulse">Cargando sitio TAFA...</div>
      </div>
    )
  }

  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen bg-tafa-dark flex flex-col items-center justify-center p-6 text-white">
        <AlertCircle className="w-12 h-12 text-tafa-volcán mb-4" />
        <h1 className="text-2xl font-bold mb-2">QR no encontrado</h1>
        <p className="text-gray-400 text-sm mb-6">El código QR escaneado no corresponde a un sitio registrado en TAFA.</p>
        <Link to="/" className="flex items-center gap-2 text-tafa-volcán hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>
    )
  }

  const isPlace = landing!.entity_type === 'place'
  const name = isPlace ? landing!.place_name : landing!.business_name
  const description = isPlace ? landing!.place_description : landing!.business_description
  const address = isPlace ? landing!.place_address : landing!.business_address
  const category = isPlace ? landing!.place_category : landing!.business_category

  return (
    <div className="min-h-screen bg-gradient-to-b from-tafa-dark via-[#1a1025] to-tafa-dark text-white">
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> TAFA Arequipa
        </Link>
        {profile && (
          <div className="flex items-center gap-2 bg-tafa-volcán/20 border border-tafa-volcán/40 px-3 py-1 rounded-full text-xs">
            <Sparkles className="w-3 h-3 text-tafa-volcán" />
            <span>{profile.points_earned} pts</span>
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Badge QR */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-tafa-volcán/20 border border-tafa-volcán/40 flex items-center justify-center">
              <QrCode className="w-7 h-7 text-tafa-volcán" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-tafa-volcán flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {isPlace ? 'Sitio Turístico Verificado' : 'Aliado TAFA Verificado'}
              </span>
              <h1 className="text-2xl font-bold font-outfit">{name}</h1>
              {category && <p className="text-gray-400 text-xs">{category}</p>}
            </div>
          </div>

          {/* Descripción */}
          {description && (
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          )}

          {/* Detalles */}
          <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10">
            {address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-tafa-volcán mt-0.5 shrink-0" />
                <span className="text-gray-300">{address}</span>
              </div>
            )}
            {isPlace && landing!.place_hours && (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-tafa-volcán mt-0.5 shrink-0" />
                <span className="text-gray-300">{landing!.place_hours}</span>
              </div>
            )}
            {isPlace && landing!.place_fee && (
              <div className="flex items-start gap-3 text-sm">
                <Ticket className="w-4 h-4 text-tafa-volcán mt-0.5 shrink-0" />
                <span className="text-gray-300">{landing!.place_fee}</span>
              </div>
            )}
            {!isPlace && landing!.business_phone && (
              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-tafa-volcán mt-0.5 shrink-0" />
                <span className="text-gray-300">{landing!.business_phone}</span>
              </div>
            )}
            {!isPlace && landing!.business_website && (
              <div className="flex items-start gap-3 text-sm">
                <Globe className="w-4 h-4 text-tafa-volcán mt-0.5 shrink-0" />
                <a href={landing!.business_website} target="_blank" rel="noopener noreferrer" className="text-tafa-volcán hover:underline">
                  {landing!.business_website}
                </a>
              </div>
            )}
          </div>

          {/* Puntos */}
          <div className="bg-gradient-to-r from-tafa-volcán/20 to-tafa-lava/10 border border-tafa-volcán/30 rounded-2xl p-5 text-center">
            <Sparkles className="w-6 h-6 text-tafa-volcán mx-auto mb-2" />
            <p className="text-3xl font-bold text-tafa-volcán">+{landing!.effective_points} PTS</p>
            <p className="text-gray-400 text-xs mt-1">Puntos TAFA por confirmar tu visita</p>
          </div>

          {/* Estado check-in */}
          {pageState === 'checked_in' && checkInResult && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              {checkInResult.already_visited ? (
                <p className="text-green-300 text-sm">Ya registraste tu visita hoy. ¡Gracias por volver!</p>
              ) : (
                <p className="text-green-300 text-sm">
                  ¡Visita confirmada en <strong>{checkInResult.entity_name}</strong>!
                  Ganaste <strong>+{checkInResult.points_awarded} pts</strong>.
                </p>
              )}
              <p className="text-gray-400 text-xs mt-2">Total acumulado: {checkInResult.total_points} pts TAFA</p>
            </motion.div>
          )}

          {pageState === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </div>
          )}

          {/* CTA */}
          {pageState !== 'checked_in' && pageState !== 'checking_in' && (
            profile ? (
              <button
                onClick={handleCheckInClick}
                className="w-full bg-tafa-volcán hover:bg-tafa-lava text-white py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar mi visita
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-gray-400 text-xs">
                  Para registrar esta experiencia y recibir puntos TAFA, inicia sesión o regístrate.
                </p>
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-tafa-volcán hover:bg-tafa-lava text-white py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión / Registrarse
                </button>
              </div>
            )
          )}

          {pageState === 'checking_in' && (
            <div className="text-center text-gray-400 text-sm animate-pulse py-4">
              Registrando tu visita...
            </div>
          )}
        </motion.div>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        pendingQRSlug={slug}
      />
    </div>
  )
}
