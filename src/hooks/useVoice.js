import { useCallback, useEffect, useRef, useState } from 'react'

export default function useVoice() {
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const [isSupported, setIsSupported] = useState(!!(typeof window !== 'undefined' && window.speechSynthesis))
  const [voice, setVoice] = useState(null)

  useEffect(() => {
    if (!isSupported) return
    const synth = synthRef.current
    function loadVoices() {
      const voices = synth.getVoices()
      // Prefer Spanish voices
      const preferred = voices.find(v => /es(-|_)?(ES|PE)?/i.test(v.lang)) || voices.find(v => /es/i.test(v.lang))
      if (preferred) setVoice(preferred)
      else if (voices.length) setVoice(voices[0])
    }
    loadVoices()
    // Some browsers load voices asynchronously
    synth.addEventListener && synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener && synth.removeEventListener('voiceschanged', loadVoices)
  }, [isSupported])

  const speak = useCallback((text, opts = {}) => {
    if (!isSupported) return
    const synth = synthRef.current
    if (!text) return
    // Cancel any ongoing utterances
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    if (voice) utter.voice = voice
    // Alexa-like calm configuration
    utter.rate = opts.rate ?? 0.95
    utter.pitch = opts.pitch ?? 1
    utter.lang = voice?.lang || 'es-ES'
    synth.speak(utter)
    return utter
  }, [isSupported, voice])

  const cancel = useCallback(() => {
    if (!isSupported) return
    const synth = synthRef.current
    synth.cancel()
  }, [isSupported])

  return { speak, cancel, isSupported }
}
