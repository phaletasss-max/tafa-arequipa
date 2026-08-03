import { useState } from 'react'
import { ShieldAlert, PhoneCall, CloudSun, AlertTriangle, X, ChevronRight } from 'lucide-react'

export default function EmergencyBanner() {
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <>
      {/* Banner superior flotante de prevención */}
      <div className="bg-gradient-to-r from-red-950 via-tafa-dark to-red-950 text-white border-b border-red-900/40 px-4 py-2.5 text-xs font-medium relative z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 flex-wrap">

          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Seguridad & Prevención Turística:
            </span>
            <span className="text-gray-200 hidden sm:inline">
              Arequipa 2,335 msnm · Radiación UV Alta · Usa transporte empadronado por DIRCETUR
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600/80 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Teléfonos de Emergencia / POLTUR</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-white p-1"
              title="Cerrar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Modal de Emergencia / Asistencia Turística */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-tafa-dark border border-red-900/60 rounded-[32px] max-w-lg w-full p-7 text-white relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center text-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Asistencia Oficial 24/7
                </span>
                <h3 className="text-2xl font-bold font-outfit text-white">
                  Policía de Turismo & Emergencias
                </h3>
              </div>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed mb-6 bg-red-950/40 p-3.5 rounded-2xl border border-red-900/30">
              Servicios oficiales de auxilio y atención inmediata al visitante en la Región Arequipa.
            </p>

            <div className="space-y-3 mb-6">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Policía de Turismo (POLTUR Arequipa)</div>
                  <div className="text-xs text-gray-400">Atención bilingüe para denuncias y resguardo</div>
                </div>
                <a
                  href="tel:054201258"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl no-underline"
                >
                  (054) 201258
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Emergencias Policía Nacional (PNP)</div>
                  <div className="text-xs text-gray-400">Central de emergencias gratuitas a nivel nacional</div>
                </div>
                <a
                  href="tel:105"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl no-underline"
                >
                  105
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Hospital Regional Goyeneche</div>
                  <div className="text-xs text-gray-400">Atención médica de urgencia en el Cercado</div>
                </div>
                <a
                  href="tel:054232200"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl no-underline"
                >
                  (054) 232200
                </a>
              </div>
            </div>

            {/* Consejos Soroche / Clima */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3.5 rounded-2xl text-xs text-yellow-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-yellow-300 mb-0.5">Recomendaciones para Soroche (Mal de Altura):</strong>
                Reposa tus primeras 4 horas, bebe mate de coca y mantén hidratación constante antes de ascender al Colca (3,630 msnm).
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
