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

  const startListening = useCallback((callbackOrOptions) => {
    if (!isSupported || !recognitionRef.current) return

    const recognition = recognitionRef.current
    const options = typeof callbackOrOptions === 'function'
      ? { onResult: callbackOrOptions }
      : (callbackOrOptions || {})

    const {
      onResult,
      onError,
      onStart,
      onEnd,
      interimResults = false,
      continuous = false,
    } = options

    recognition.continuous = !!continuous
    recognition.interimResults = !!interimResults
    recognition.lang = 'es-ES'

    recognition.onstart = () => {
      setIsListening(true)
      if (onStart) onStart()
    }

    recognition.onresult = (event) => {
      let transcript = ''
      let isFinal = false
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
        if (event.results[i].isFinal) isFinal = true
      }

      if (onResult) {
        if (interimResults) {
          onResult(transcript, isFinal)
        } else if (isFinal) {
          onResult(transcript, true)
        }
      }

      if (!interimResults && isFinal) {
        setIsListening(false)
      }
    }

    recognition.onerror = (event) => {
      console.error('[useSpeechToText] Error:', event.error)
      if (onError) onError(event)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (onEnd) onEnd()
    }

    try {
      recognition.start()
    } catch (e) {
      console.error('[useSpeechToText] Error starting recognition:', e)
      if (onError) onError(e)
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
