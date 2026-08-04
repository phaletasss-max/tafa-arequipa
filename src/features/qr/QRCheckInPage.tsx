import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  QrCode, MapPin, Clock, Ticket, Phone, Globe, Sparkles,
  ShieldCheck, LogIn, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, MessageCircle, Compass, Utensils, Award
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

// Catálogo de Recomendaciones Cercanas
const NEARBY_RECOMMENDATIONS = [
  {
    slug: 'la-nueva-palomino',
    name: 'Picantería La Nueva Palomino',
    category: 'Gastronomía Arequipeña',
    district: 'Yanahuara',
    points: '+50 PTS',
    image: '/images/places/mirador-yanahuara.jpg',
  },
  {
    slug: 'sol-de-mayo',
    name: 'Restaurante Sol de Mayo (1903)',
    category: 'Picantería Tradicional',
    district: 'Yanahuara',
    points: '+50 PTS',
    image: '/images/places/plaza-de-armas.jpg',
  },
  {
    slug: 'canteras-anashuayco',
    name: 'Canteras de Añashuayco — Ruta del Sillar',
    category: 'Artesanía en Sillar',
    district: 'Cerro Colorado',
    points: '+50 PTS',
    image: '/images/places/ruta-sillar.jpg',
  },
  {
    slug: 'monasterio-santa-catalina',
    name: 'Monasterio de Santa Catalina',
    category: 'Patrimonio Histórico',
    district: 'Cercado',
    points: '+50 PTS',
    image: '/images/places/monasterio-santa-catalina.webp',
  },
]

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
        <div className="text-white text-sm animate-pulse flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-tafa-volcán border-t-transparent rounded-full animate-spin" />
          Cargando información del socio TAFA...
        </div>
      </div>
    )
  }

  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen bg-tafa-dark flex flex-col items-center justify-center p-6 text-white text-center">
        <AlertCircle className="w-12 h-12 text-tafa-volcán mb-4" />
        <h1 className="text-2xl font-bold mb-2">QR no encontrado</h1>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">El código QR escaneado no corresponde a un sitio o aliado registrado en TAFA.</p>
        <Link to="/" className="flex items-center gap-2 bg-tafa-volcán text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-tafa-lava transition-colors">
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
  const nearby = NEARBY_RECOMMENDATIONS.filter(r => r.slug !== slug).slice(0, 3)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [memoryPhoto, setMemoryPhoto] = useState<string | null>(null)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [scanTimestamp, setScanTimestamp] = useState<number>(Date.now())

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
  const isReviewExpired = Date.now() - scanTimestamp > SEVEN_DAYS_MS

  return (
    <div className="min-h-screen bg-gradient-to-b from-tafa-dark via-[#1a1025] to-tafa-dark text-white pb-16">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-40 bg-tafa-dark/80">
        <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4 text-tafa-volcán" /> TAFA AREQUIPA
        </Link>
        {profile && (
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{profile.points_earned} pts</span>
          </div>
        )}
      </header>

      <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header del Sitio / Socio */}
          <div className="bg-white/5 border border-white/15 rounded-[28px] p-6 backdrop-blur-md space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-tafa-volcán/20 border border-tafa-volcán/40 flex items-center justify-center shrink-0">
                <QrCode className="w-7 h-7 text-tafa-volcán" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-tafa-volcán flex items-center gap-1.5 bg-tafa-volcán/10 border border-tafa-volcán/30 px-3 py-0.5 rounded-full w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isPlace ? 'Atractivo Oficial DIRCETUR' : 'Aliado Turístico & Gastronómico'}
                </span>
                <h1 className="text-2xl font-extrabold font-outfit text-white leading-tight">{name}</h1>
                {category && <p className="text-amber-400 text-xs font-semibold">{category}</p>}
              </div>
            </div>

            {/* Descripción Completa de Referencia */}
            {description && (
              <p className="text-gray-200 text-xs md:text-sm leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/10">
                {description}
              </p>
            )}

            {/* Ficha de Detalles y Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {address && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-tafa-volcán shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Ubicación / Dirección</span>
                    <span className="text-gray-200 font-medium">{address}</span>
                  </div>
                </div>
              )}

              {isPlace && landing!.place_hours && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Horario Oficial</span>
                    <span className="text-gray-200 font-medium">{landing!.place_hours}</span>
                  </div>
                </div>
              )}

              {isPlace && landing!.place_fee && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <Ticket className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Tarifa de Ingreso</span>
                    <span className="text-gray-200 font-medium">{landing!.place_fee}</span>
                  </div>
                </div>
              )}

              {!isPlace && landing!.business_phone && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Teléfono de Reserva</span>
                    <span className="text-gray-200 font-medium">{landing!.business_phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enlaces de Acción Externa (Google Maps & WhatsApp) */}
            <div className="flex items-center gap-2 pt-2">
              {address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 no-underline border border-white/15"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cómo llegar (Maps)</span>
                </a>
              )}
              <a
                href={`https://wa.me/51921378349?text=Hola%20TAFA%20Arequipa,%20deseo%20información%20u%20orientación%20sobre:%20${encodeURIComponent(name || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 no-underline"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consulta WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Tarjeta de Recompensa Puntos TAFA */}
          <div className="bg-gradient-to-r from-tafa-volcán/25 via-amber-500/10 to-tafa-lava/20 border border-tafa-volcán/40 rounded-[28px] p-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-32 h-32 text-white" />
            </div>
            <Sparkles className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <p className="text-4xl font-extrabold font-outfit text-amber-300">+{landing!.effective_points} PTS TAFA</p>
            <p className="text-gray-300 text-xs mt-1">Recompensa oficial por validar tu visita en el lugar</p>
          </div>

          {/* Resultado de Confirmación de Asistencia */}
          {pageState === 'checked_in' && checkInResult && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/15 border border-emerald-500/40 rounded-[28px] p-6 text-center space-y-4 shadow-2xl"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">¡Visita Confirmada con Éxito!</h3>
              <p className="text-emerald-300 text-xs leading-relaxed max-w-sm mx-auto">
                {checkInResult.already_visited
                  ? `Ya habías registrado tu visita hoy a ${checkInResult.entity_name}. ¡Gracias por seguir explorando Arequipa!`
                  : `Se han añadido +${checkInResult.points_awarded} Puntos TAFA a tu perfil por visitar ${checkInResult.entity_name}.`}
              </p>
              <div className="pt-1 text-xs font-bold text-amber-300">
                Puntos Acumulados: {checkInResult.total_points} PTS TAFA
              </div>

              {/* Formulario Opcional de Calificación & Foto de Recuerdo (Plazo 7 días) */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-left space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Opcional · Recuerdo de tu Visita</span>
                    <h4 className="text-sm font-bold text-white">¿Qué tal tu experiencia en este lugar?</h4>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">Plazo: 7 días</span>
                </div>

                {isReviewExpired ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-center text-xs text-amber-300">
                    El plazo de 7 días para opinar o subir foto de recuerdo ha finalizado. Tu asistencia y tus Puntos TAFA se mantienen guardados permanentemente.
                  </div>
                ) : reviewSubmitted ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center text-xs text-emerald-300 space-y-1">
                    <p className="font-bold">¡Reseña y foto de recuerdo guardadas!</p>
                    <p className="text-[11px] text-gray-300">Tu opinión fortalece la calidad del turismo en Arequipa.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Selector de Estrellas */}
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Calificación por Estrellas:</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            {star <= rating ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comentario */}
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Comentario (Opcional):</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ej: Excelente comida y atención tradicional..."
                        rows={2}
                        className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-tafa-volcán"
                      />
                    </div>

                    {/* Foto Opcional */}
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Foto de Recuerdo (Opcional):</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => setMemoryPhoto(reader.result as string)
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-tafa-volcán file:text-white hover:file:bg-tafa-lava cursor-pointer"
                      />
                      {memoryPhoto && (
                        <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-white/20">
                          <img src={memoryPhoto} alt="Recuerdo de visita" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Guardar Reseña & Foto de Recuerdo
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {pageState === 'error' && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-xs">{errorMsg}</p>
            </div>
          )}

          {/* Botón CTA de Confirmación */}
          {pageState !== 'checked_in' && pageState !== 'checking_in' && (
            profile ? (
              <button
                onClick={handleCheckInClick}
                className="w-full bg-tafa-volcán hover:bg-tafa-lava text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar mi visita y Reclamar +50 PTS
              </button>
            ) : (
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                <p className="text-gray-300 text-xs">
                  Inicia sesión o regístrate para confirmar tu asistencia y añadir los <strong>+{landing!.effective_points} PTS TAFA</strong> a tu Pase Turístico.
                </p>
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-tafa-volcán hover:bg-tafa-lava text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión / Registrarse
                </button>
              </div>
            )
          )}

          {pageState === 'checking_in' && (
            <div className="text-center text-gray-300 text-xs animate-pulse py-4 font-semibold">
              Registrando tu visita en la red oficial de Arequipa...
            </div>
          )}

          {/* ── SECCIÓN DE RECOMENDACIONES CERCANAS ──────────────────────────── */}
          <div className="pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold font-outfit text-lg">
                <Compass className="w-5 h-5 text-tafa-volcán" />
                <span>Lugares y Aliados Cercanos</span>
              </div>
              <span className="text-xs text-gray-400">Arequipa Tradicional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {nearby.map((rec) => (
                <Link
                  key={rec.slug}
                  to={`/qr/${rec.slug}`}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-tafa-volcán/50 rounded-2xl p-4 transition-all no-underline flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {rec.category}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-tafa-volcán transition-colors line-clamp-2">
                      {rec.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-tafa-volcán" /> {rec.district}
                    </p>
                  </div>
                  <div className="pt-3 text-[10px] font-bold text-emerald-400 flex items-center justify-between border-t border-white/10 mt-3">
                    <span>Ver info & QR</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">{rec.points}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
