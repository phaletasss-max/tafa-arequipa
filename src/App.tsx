import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { AccessibilityProvider } from '@/features/accessibility/context/AccessibilityContext'
import QuickAccessBar from '@/features/accessibility/components/QuickAccessBar'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import Highlights from '@/components/Highlights'
import PartnersDirectory from '@/features/partners/PartnersDirectory'
import Footer from '@/components/Footer'
import TouristAIAssistant from '@/components/ai/TouristAIAssistant'
import AuthModal from '@/components/auth/AuthModal'
import TAFAExplorerPassModal from '@/components/rewards/TAFAExplorerPassModal'
import QRCheckInPage from '@/features/qr/QRCheckInPage'
import QRStudioModal from '@/features/qr/QRStudioModal'
import { loadSessionProfile } from '@/services/authService'

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

      {/* Barra Superior de Configuración Institucional */}
      <QuickAccessBar
        onOpenAuth={onOpenAuth}
        onOpenSettings={onOpenSettings}
        onOpenAI={onOpenAI}
        onOpenSignLanguage={onOpenSignLanguage}
      />

      {/* Main Content Area */}
      <main id="main-content" role="main">
        <CinematicStoryteller />
        <Highlights />
        <PartnersDirectory />
        <TouristAIAssistant />
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
  // Rehidrata el perfil desde la sesión de Supabase Auth. La caché de
  // localStorage puede sobrevivir a una sesión ya expirada, y sin esto la UI
  // seguiría mostrando como conectado a alguien que ya no lo está.
  useEffect(() => {
    void loadSessionProfile()
  }, [])

  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenSettings={() => setIsPassOpen(true)}
                onOpenAI={() => setIsAIOpen(true)}
                onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
                onOpenQRStudio={() => setIsQRStudioOpen(true)}
              />
            } 
          />
          <Route path="/qr/:slug" element={<QRCheckInPage />} />
          <Route path="/aliados/:slug" element={<QRCheckInPage />} />
          <Route 
            path="*" 
            element={
              <LandingPage 
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenSettings={() => setIsPassOpen(true)}
                onOpenAI={() => setIsAIOpen(true)}
                onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
                onOpenQRStudio={() => setIsQRStudioOpen(true)}
              />
            } 
          />
        </Routes>

        {/* Modales Globales */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />

        <TAFAExplorerPassModal
          isOpen={isPassOpen}
          onClose={() => setIsPassOpen(false)}
        />

        <QRStudioModal
          isOpen={isQRStudioOpen}
          onClose={() => setIsQRStudioOpen(false)}
        />
      </BrowserRouter>
    </AccessibilityProvider>
  )
}
