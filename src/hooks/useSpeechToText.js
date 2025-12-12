import { useCallback, useEffect, useRef, useState } from 'react'

export default function useSpeechToText() {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  // Check if browser supports Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
    }
  }, [])

  const startListening = useCallback((callback) => {
    if (!isSupported || !recognitionRef.current) return

    const recognition = recognitionRef.current
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'es-ES'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (callback) callback(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('[useSpeechToText] Error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (e) {
      console.error('[useSpeechToText] Error starting recognition:', e)
      setIsListening(false)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  return { startListening, stopListening, isListening, isSupported }
}
