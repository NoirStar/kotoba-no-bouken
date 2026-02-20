/**
 * 음성 서비스 (STT / TTS)
 * Web Speech API를 사용합니다.
 */

// ─── STT (Speech-to-Text) ─────────────────────────────

type SpeechCallback = (text: string, isFinal: boolean) => void

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : never
let recognition: InstanceType<SpeechRecognitionType> | null = null

/** STT 지원 여부 확인 */
export function isSTTSupported(): boolean {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window
}

/** 음성 인식 시작 (일본어) */
export function startListening(
  onResult: SpeechCallback,
  onEnd?: () => void,
  onError?: (error: string) => void,
): void {
  if (!isSTTSupported()) {
    onError?.("음성 인식을 지원하지 않는 브라우저입니다.")
    return
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.lang = "ja-JP" // 일본어
  recognition.interimResults = true // 중간 결과 표시
  recognition.continuous = false
  recognition.maxAlternatives = 1

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interimTranscript = ""
    let finalTranscript = ""

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript, true)
    } else if (interimTranscript) {
      onResult(interimTranscript, false)
    }
  }

  recognition.onend = () => {
    onEnd?.()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    onError?.(event.error)
  }

  recognition.start()
}

/** 음성 인식 중지 */
export function stopListening(): void {
  if (recognition) {
    recognition.stop()
    recognition = null
  }
}

// ─── TTS (Text-to-Speech) ─────────────────────────────

/** TTS 지원 여부 확인 */
export function isTTSSupported(): boolean {
  return "speechSynthesis" in window
}

/** 일본어 텍스트를 음성으로 읽기 */
export function speak(
  text: string,
  options?: {
    rate?: number    // 속도 (0.1 ~ 10, 기본 1)
    pitch?: number   // 음높이 (0 ~ 2, 기본 1)
    volume?: number  // 볼륨 (0 ~ 1, 기본 1)
    onEnd?: () => void
  },
): void {
  if (!isTTSSupported()) return

  // 이전 음성 중지
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "ja-JP"
  utterance.rate = options?.rate ?? 0.9
  utterance.pitch = options?.pitch ?? 1
  utterance.volume = options?.volume ?? 1

  // 일본어 음성 찾기
  const voices = window.speechSynthesis.getVoices()
  const jaVoice = voices.find((v) => v.lang.startsWith("ja"))
  if (jaVoice) {
    utterance.voice = jaVoice
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd
  }

  window.speechSynthesis.speak(utterance)
}

/** TTS 중지 */
export function stopSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel()
  }
}
