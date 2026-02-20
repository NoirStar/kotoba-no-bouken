import { useCallback, useRef, useState } from "react"
import {
  isSTTSupported,
  startListening,
  stopListening,
  speak,
  stopSpeaking,
} from "@/services/speechService"

/**
 * 음성 입출력 훅
 * STT (마이크 입력) + TTS (음성 출력)을 React에서 쉽게 사용
 */
export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [interimText, setInterimText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const finalTextRef = useRef("")

  /** 마이크 녹음 시작 */
  const startRecording = useCallback(
    (onFinalText: (text: string) => void) => {
      if (!isSTTSupported()) {
        setError("음성 인식을 지원하지 않는 브라우저입니다.")
        return
      }

      setIsRecording(true)
      setInterimText("")
      setError(null)
      finalTextRef.current = ""

      startListening(
        (text, isFinal) => {
          if (isFinal) {
            finalTextRef.current = text
            setInterimText(text)
            onFinalText(text)
          } else {
            setInterimText(text)
          }
        },
        () => {
          setIsRecording(false)
        },
        (err) => {
          setError(err)
          setIsRecording(false)
        },
      )
    },
    [],
  )

  /** 마이크 녹음 중지 */
  const stopRecording = useCallback(() => {
    stopListening()
    setIsRecording(false)
  }, [])

  /** NPC 대사를 TTS로 읽기 */
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      setIsSpeaking(true)
      speak(text, {
        rate: 0.85,
        onEnd: () => {
          setIsSpeaking(false)
          onEnd?.()
        },
      })
    },
    [],
  )

  /** TTS 중지 */
  const stopTTS = useCallback(() => {
    stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return {
    isRecording,
    isSpeaking,
    interimText,
    error,
    sttSupported: isSTTSupported(),
    startRecording,
    stopRecording,
    speakText,
    stopTTS,
  }
}
