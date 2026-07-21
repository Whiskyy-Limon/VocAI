import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchSpeechAudioUrl } from '../services/voiceService'

export default function useVoice() {
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const audioRef = useRef(typeof window !== 'undefined' ? new Audio() : null)
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

  // Fallback: síntesis de voz nativa del navegador
  const speakNative = useCallback((text, opts = {}) => {
    return new Promise((resolve) => {
      if (!isSupported || !text) {
        resolve()
        return
      }
      const synth = synthRef.current
      synth.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      if (voice) utter.voice = voice
      utter.rate = opts.rate ?? 0.95
      utter.pitch = opts.pitch ?? 1
      utter.lang = voice?.lang || 'es-ES'
      utter.onend = () => resolve()
      utter.onerror = () => resolve()
      synth.speak(utter)
    })
  }, [isSupported, voice])

  /**
   * Reproduce el texto usando ElevenLabs (vía backend). Si falla
   * (límite del plan gratuito, API key no configurada, error de red),
   * hace fallback automático a la síntesis nativa del navegador.
   * @returns {Promise<'elevenlabs'|'native'|'none'>} qué motor se usó
   */
  const speak = useCallback(async (text) => {
    if (!text || !text.trim()) return 'none'

    try {
      const audioUrl = await fetchSpeechAudioUrl(text)
      const audio = audioRef.current
      audio.pause()
      audio.src = audioUrl
      await new Promise((resolve, reject) => {
        audio.onended = resolve
        audio.onerror = reject
        audio.play().catch(reject)
      })
      URL.revokeObjectURL(audioUrl)
      return 'elevenlabs'
    } catch (err) {
      console.warn('[useVoice] ElevenLabs no disponible, usando voz nativa del navegador:', err?.message)
      await speakNative(text)
      return isSupported ? 'native' : 'none'
    }
  }, [speakNative, isSupported])

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if (isSupported) {
      synthRef.current.cancel()
    }
  }, [isSupported])

  return { speak, cancel, isSupported }
}
