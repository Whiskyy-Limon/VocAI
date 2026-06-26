import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useVoice from '../hooks/useVoice'
import useSpeechToText from '../hooks/useSpeechToText'
import { askVocationalAssistant } from '../services/assistantService'
import AssistantHeader from '../components/assistant/AssistantHeader'
import ChatMessage from '../components/assistant/ChatMessage'
import VoiceButton from '../components/assistant/VoiceButton'
import ListeningIndicator from '../components/assistant/ListeningIndicator'
import EmptyChatState from '../components/assistant/EmptyChatState'
import VocAIAvatar from '../components/assistant/VocAIAvatar'

const STATUS_LABELS = {
  idle: 'Esperando tu voz',
  listening: 'Escuchando',
  processing: 'Procesando',
  responding: 'Respondiendo',
}

export default function Assistant() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vocai_chat_history') || '[]')
    } catch (e) {
      return []
    }
  })
  const [status, setStatus] = useState('idle')
  const [voiceOn, setVoiceOn] = useState(true)
  const [liveTranscript, setLiveTranscript] = useState('')
  const { speak, cancel, isSupported } = useVoice()
  const { startListening, stopListening, isListening, isSupported: isSpeechSupported } = useSpeechToText()
  const listRef = useRef(null)
  const statusRef = useRef(status)
  const hasFinalRef = useRef(false)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (messages.length === 0) {
      const introText = 'Hola, soy VocAI, tu asistente de orientacion vocacional para las carreras del Departamento de Tecnologia Digital de TECSUP - Sede Lima.'
      const introMsg = { id: 'intro', from: 'assistant', text: introText }
      setMessages([introMsg])
      if (voiceOn && isSupported) {
        setTimeout(() => speak(introText), 300)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem('vocai_chat_history', JSON.stringify(messages))
    const last = messages[messages.length - 1]
    if (last) {
      setTimeout(() => {
        try {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
        } catch (e) {
          // ignore
        }
      }, 80)
    }
  }, [messages])

  const addSystemMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}:s`, from: 'system', text }])
  }, [])

  const send = useCallback(async (text) => {
    const trimmed = text ? text.trim() : ''
    if (!trimmed) {
      addSystemMessage('No pude escucharte bien, intenta nuevamente.')
      setStatus('idle')
      return
    }

    const userMsg = { id: `${Date.now()}:u`, from: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setStatus('processing')

    try {
      const res = await askVocationalAssistant(trimmed)
      const recommended = res.recommendedCareers || res.topCareers || []
      const assistantMsg = {
        id: `${Date.now()}:a`,
        from: 'assistant',
        text: res.text,
        recommendedCareers: recommended,
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMsg])
        setStatus('responding')

        if (voiceOn && isSupported) {
          const utter = speak(assistantMsg.text)
          if (utter) {
            utter.onend = () => setStatus('idle')
            utter.onerror = () => setStatus('idle')
          } else {
            setStatus('idle')
          }
        } else {
          setStatus('idle')
        }
      }, 450)
    } catch (err) {
      const errorText = err?.message || 'Ocurrio un problema al procesar tu solicitud.'
      addSystemMessage(errorText)
      setStatus('idle')
    }
  }, [addSystemMessage, isSupported, speak, voiceOn])

  const handleFinalTranscript = useCallback((text) => {
    hasFinalRef.current = true
    setLiveTranscript(text)
    send(text)
  }, [send])

  const handleMicrophone = useCallback(() => {
    if (!isSpeechSupported) {
      addSystemMessage('Tu navegador no soporta reconocimiento de voz.')
      return
    }

    if (isListening) {
      stopListening()
      setStatus('idle')
      return
    }

    hasFinalRef.current = false
    setLiveTranscript('')
    startListening({
      interimResults: true,
      onStart: () => {
        setStatus('listening')
      },
      onResult: (transcript, isFinal) => {
        setLiveTranscript(transcript)
        if (isFinal && !hasFinalRef.current) {
          handleFinalTranscript(transcript)
        }
      },
      onError: () => {
        setStatus('idle')
        setLiveTranscript('')
        addSystemMessage('No pude escucharte bien, intenta nuevamente.')
      },
      onEnd: () => {
        if (statusRef.current === 'listening' && !hasFinalRef.current) {
          setStatus('idle')
        }
      },
    })
  }, [addSystemMessage, handleFinalTranscript, isListening, isSpeechSupported, startListening, stopListening])

  const statusLabel = STATUS_LABELS[status] || STATUS_LABELS.idle

  return (
    <div className="assistant-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <AssistantHeader
          statusLabel={statusLabel}
          status={status}
          voiceOn={voiceOn}
          onToggleVoice={() => {
            setVoiceOn((prev) => !prev)
            if (voiceOn) cancel()
          }}
        />

        <div className="assistant-grid mt-6">
          <div className="assistant-chat card-premium">
            <div ref={listRef} className="assistant-chat__log">
              {messages.length === 0 && (
                <EmptyChatState
                  userEmail={user?.email}
                  onSuggestion={(text) => send(text)}
                />
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>

          <div className="assistant-control card-premium">
            <ListeningIndicator status={status} transcript={liveTranscript} />

            {/* Avatar animado */}
            <VocAIAvatar status={status} />

            {/* Botón de micrófono */}
            <VoiceButton
              status={status}
              onClick={handleMicrophone}
              disabled={!isSpeechSupported}
            />
            <div className="assistant-hint">
              {isSpeechSupported
                ? 'Presiona para hablar. La respuesta se enviará automáticamente.'
                : 'Tu navegador no soporta reconocimiento de voz.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
