import { useState, useEffect, lazy, Suspense, startTransition } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { AccessibilityProvider } from '@/features/accessibility/context/AccessibilityContext'
import QuickAccessBar from '@/features/accessibility/components/QuickAccessBar'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import Highlights from '@/components/Highlights'
import PartnersDirectory from '@/features/partners/PartnersDirectory'
import Footer from '@/components/Footer'
import EmergencyBanner from '@/components/safety/EmergencyBanner'
import { loadSessionProfile } from '@/services/authService'

/**
 * PT-09 — Secciones diferidas.
 * Van por debajo del primer pantallazo, así que no necesitan estar en el bundle
 * inicial: se descargan mientras el visitante recorre el hero y los destacados.
 */
const MapPreview = lazy(() => import('@/components/MapPreview'))
const UnexploredRoutes = lazy(() => import('@/components/UnexploredRoutes'))
const Stats = lazy(() => import('@/components/Stats'))
const Problem = lazy(() => import('@/components/Problem'))
const AboutProject = lazy(() => import('@/components/AboutProject'))
const JoinEcosystem = lazy(() => import('@/components/ecosystem/JoinEcosystem'))

/**
 * PT-09 — Carga diferida.
 * La página QR es una ruta aparte y los modales solo aparecen tras una acción
 * del usuario: sacarlos del bundle inicial evita que quien entra a la landing
 * (o quien escanea un QR) descargue código que no va a usar.
 */
const QRCheckInPage = lazy(() => import('@/features/qr/QRCheckInPage'))
const TouristAIAssistant = lazy(() => import('@/components/ai/TouristAIAssistant'))
const AuthModal = lazy(() => import('@/components/auth/AuthModal'))
const TAFAExplorerPassModal = lazy(() => import('@/components/rewards/TAFAExplorerPassModal'))
const QRStudioModal = lazy(() => import('@/features/qr/QRStudioModal'))

/** Indicador mientras se descarga un fragmento diferido. */
function ChunkFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Cargando contenido…</span>
      <div className="w-6 h-6 border-2 border-tafa-volcán border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function LandingPage({
  onOpenAuth,
  onOpenSettings,
  onOpenAI,
  onOpenSignLanguage,
  onOpenQRStudio,
}: {
  onOpenAuth: () => void
  onOpenSettings: () => void
  onOpenAI: () => void
  onOpenSignLanguage: () => void
  onOpenQRStudio: () => void
}) {
  return (
    <div className="w-full overflow-x-hidden bg-white text-tafa-text font-sans relative">
      {/* Skip to Main Content Link (WCAG 2.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:p-4 focus:bg-tafa-volcán focus:text-white focus:font-bold"
      >
        Ir al contenido principal
      </a>

      {/* Aviso de seguridad y auxilio al visitante. Va por encima de la barra
          sticky: si quedara debajo, se perdería al hacer scroll. */}
      <EmergencyBanner />

      {/* Barra Superior de Configuración Institucional */}
      <QuickAccessBar
        onOpenAuth={onOpenAuth}
        onOpenSettings={onOpenSettings}
        onOpenAI={onOpenAI}
        onOpenSignLanguage={onOpenSignLanguage}
      />

      {/* Orden: primero el recorrido del turista (qué ver → dónde queda → qué
          hay fuera de la ciudad → con quién comer y reservar) y después el
          bloque institucional (cifras → diagnóstico → proyecto → postulación).
          Con estas secciones montadas se reparan además los enlaces #mapa,
          #inexplorada, #sobre-proyecto y #ecosistema del pie de página. */}
      <main id="main-content" role="main">
        <CinematicStoryteller />
        <Highlights />
        <Suspense fallback={<ChunkFallback />}>
          <MapPreview />
          <UnexploredRoutes />
          <PartnersDirectory />
          <Stats />
          <Problem />
          <AboutProject />
          <JoinEcosystem />
          <TouristAIAssistant />
        </Suspense>
      </main>

      {/* Botón Flotante para Generador / Estudio de QRs de Socios */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={onOpenQRStudio}
          title="Generador de Códigos QR Oficiales TAFA"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-emerald-400/40"
        >
          <QrCode className="w-5 h-5 text-white" />
          <span className="hidden md:inline">Estudio QR Socios</span>
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isPassOpen, setIsPassOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isSignLanguageOpen, setIsSignLanguageOpen] = useState(false)
  const [isQRStudioOpen, setIsQRStudioOpen] = useState(false)

  /**
   * Abrir un modal diferido desde un clic es una actualización síncrona que
   * suspende mientras se descarga su fragmento, y React lo rechaza con
   * "A component suspended while responding to synchronous input".
   * `startTransition` marca la apertura como no urgente y lo evita.
   */
  const abrirDiferido = (set: (v: boolean) => void) => () => startTransition(() => set(true))

  // Rehidrata el perfil desde la sesión de Supabase Auth. La caché de
  // localStorage puede sobrevivir a una sesión ya expirada, y sin esto la UI
  // seguiría mostrando como conectado a alguien que ya no lo está.
  useEffect(() => {
    void loadSessionProfile()
  }, [])

  // El asistente IA y la guía en lengua de señas se abren desde QuickAccessBar,
  // que gestiona su propio estado; aquí solo se conserva el de los modales
  // globales montados más abajo.
  void isAIOpen
  void isSignLanguageOpen

  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onOpenAuth={abrirDiferido(setIsAuthOpen)}
                onOpenSettings={abrirDiferido(setIsPassOpen)}
                onOpenAI={() => setIsAIOpen(true)}
                onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
                onOpenQRStudio={abrirDiferido(setIsQRStudioOpen)}
              />
            }
          />
          <Route
            path="/qr/:slug"
            element={<Suspense fallback={<ChunkFallback />}><QRCheckInPage /></Suspense>}
          />
          <Route
            path="/aliados/:slug"
            element={<Suspense fallback={<ChunkFallback />}><QRCheckInPage /></Suspense>}
          />
          <Route
            path="*"
            element={
              <LandingPage
                onOpenAuth={abrirDiferido(setIsAuthOpen)}
                onOpenSettings={abrirDiferido(setIsPassOpen)}
                onOpenAI={() => setIsAIOpen(true)}
                onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
                onOpenQRStudio={abrirDiferido(setIsQRStudioOpen)}
              />
            }
          />
        </Routes>

        {/* Modales globales: se montan solo al abrirse, para que su fragmento
            no se descargue hasta que el usuario realmente lo necesite. */}
        <Suspense fallback={null}>
          {isAuthOpen && (
            <AuthModal isOpen onClose={() => setIsAuthOpen(false)} />
          )}
          {isPassOpen && (
            <TAFAExplorerPassModal isOpen onClose={() => setIsPassOpen(false)} />
          )}
          {isQRStudioOpen && (
            <QRStudioModal isOpen onClose={() => setIsQRStudioOpen(false)} />
          )}
        </Suspense>
      </BrowserRouter>
    </AccessibilityProvider>
  )
}
