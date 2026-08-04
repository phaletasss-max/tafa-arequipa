import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AccessibilityProvider } from '@/features/accessibility/context/AccessibilityContext'
import QuickAccessBar from '@/features/accessibility/components/QuickAccessBar'
import Hero from '@/components/Hero'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import Highlights from '@/components/Highlights'
import Footer from '@/components/Footer'
import TouristAIAssistant from '@/components/ai/TouristAIAssistant'
import AuthModal from '@/components/auth/AuthModal'
import TAFAExplorerPassModal from '@/components/rewards/TAFAExplorerPassModal'
import QRCheckInPage from '@/features/qr/QRCheckInPage'

function LandingPage({
  onOpenAuth,
  onOpenSettings,
  onOpenAI,
  onOpenSignLanguage,
}: {
  onOpenAuth: () => void
  onOpenSettings: () => void
  onOpenAI: () => void
  onOpenSignLanguage: () => void
}) {
  return (
    <div className="w-full overflow-x-hidden bg-white text-tafa-text font-sans">
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
        <TouristAIAssistant />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isPassOpen, setIsPassOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isSignLanguageOpen, setIsSignLanguageOpen] = useState(false)
  const [touristUser, setTouristUser] = useState<{ nombre: string; docType: string; docNum: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tafa_tourist_user')
    if (saved) {
      try { setTouristUser(JSON.parse(saved)); } catch (e) {}
    }
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
              />
            } 
          />
        </Routes>

        {/* Modales Globales */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(u) => setTouristUser(u)}
        />

        <TAFAExplorerPassModal
          isOpen={isPassOpen}
          onClose={() => setIsPassOpen(false)}
        />
      </BrowserRouter>
    </AccessibilityProvider>
  )
}
