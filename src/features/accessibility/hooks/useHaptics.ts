// Hook para Retroalimentación Háptica (Vibración Móvil Web Haptics API)

export function useHaptics() {
  function triggerYesHaptic() {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        // Patrón SÍ: Dos pulsos cortos
        navigator.vibrate([100, 40, 100])
      } catch (_) {}
    }
  }

  function triggerNoHaptic() {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        // Patrón NO: Un pulso único medio
        navigator.vibrate(80)
      } catch (_) {}
    }
  }

  function triggerAlertHaptic() {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        // Patrón Alerta / Salir: Tres pulsos rápidos
        navigator.vibrate([60, 40, 60, 40, 60])
      } catch (_) {}
    }
  }

  return { triggerYesHaptic, triggerNoHaptic, triggerAlertHaptic }
}
