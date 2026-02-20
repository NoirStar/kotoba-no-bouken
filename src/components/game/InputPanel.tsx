import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, MicOff, Send, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDialogStore } from "@/stores/dialogStore"
import { useGameStore } from "@/stores/gameStore"
import { useMoodStore } from "@/stores/moodStore"
import { useSpeech } from "@/hooks/useSpeech"
import { eventBridge } from "@/game/EventBridge"
import { sendToNPC, checkQuestCompletion } from "@/services/aiService"
import { useQuestStore } from "@/stores/questStore"
import { conbiniRoom } from "@/data/rooms/conbini"
import type { DialogMessage } from "@/types/room"

/**
 * InputPanel - 텍스트/음성 입력 패널
 * 마이크 버튼으로 음성 입력, 텍스트 입력도 가능
 */
export function InputPanel() {
  const [textInput, setTextInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    activeNpcId,
    isRecording,
    isNpcThinking,
    messages,
    setRecording,
    setInterimText,
    setNpcThinking,
    addMessage,
    setLastFeedback,
  } = useDialogStore()
  const { settings, setInputMode } = useGameStore()
  const { completeQuest, progress } = useQuestStore()
  const { getMood, setMood } = useMoodStore()
  const { startRecording, stopRecording, interimText, speakText, sttSupported } =
    useSpeech()

  const isVoiceMode = settings.inputMode === "voice"

  /** 메시지 전송 처리 */
  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || !activeNpcId || isNpcThinking) return

      // 플레이어 메시지 추가
      const playerMsg: DialogMessage = {
        id: `msg-${Date.now()}`,
        speaker: "player",
        speakerName: "あなた",
        text: text.trim(),
        timestamp: Date.now(),
      }
      addMessage(playerMsg)
      setTextInput("")
      eventBridge.emit("player-speak", text)

      // NPC 찾기
      const npc = conbiniRoom.npcs.find((n) => n.id === activeNpcId)
      if (!npc) return

      // 활성 퀘스트 필터링
      const activeQuests = conbiniRoom.quests.filter(
        (q) =>
          q.targetNpcId === activeNpcId &&
          progress[q.id]?.status !== "completed",
      )

      // AI 응답 요청
      setNpcThinking(true)
      eventBridge.emit("npc-speak", activeNpcId)

      // 현재 NPC 기분 가져오기
      const currentMoodState = getMood(activeNpcId)

      try {
        const response = await sendToNPC({
          playerMessage: text.trim(),
          npc,
          roomName: conbiniRoom.name,
          activeQuests,
          conversationHistory: messages,
          npcMood: currentMoodState.mood,
          refuseService: currentMoodState.refuseService,
        })

        // NPC 메시지 추가
        const npcMsg: DialogMessage = {
          id: `msg-${Date.now()}-npc`,
          speaker: activeNpcId,
          speakerName: npc.name,
          text: response.npcReply,
          reading: response.npcReplyReading,
          translation: response.translation,
          timestamp: Date.now(),
        }
        addMessage(npcMsg)

        // 게임 화면 자막 표시
        eventBridge.emit("npc-subtitle", { name: npc.name, text: response.npcReply })

        // NPC 기분 변화 처리
        if (response.moodChange) {
          const prevMood = currentMoodState.mood
          const newMood = response.moodChange.mood
          setMood(activeNpcId, newMood, response.moodChange.refuseService)

          // 기분이 바뀌었으면 이벤트 발행 (시각적 피드백)
          if (prevMood !== newMood) {
            eventBridge.emit("npc-mood-change", {
              npcId: activeNpcId,
              npcName: npc.name,
              mood: newMood,
              reason: response.moodChange.reason,
              refuseService: response.moodChange.refuseService,
            })
          }
        }

        // TTS로 NPC 대사 읽기
        if (settings.ttsEnabled) {
          speakText(response.npcReply)
        }

        // 퀘스트 완료 체크
        const completedQuestId = checkQuestCompletion(response)
        if (completedQuestId) {
          completeQuest(completedQuestId)
          eventBridge.emit("quest-complete", completedQuestId)
        }

        // 피드백 저장
        setLastFeedback(response.feedback)
      } catch {
        addMessage({
          id: `msg-${Date.now()}-err`,
          speaker: activeNpcId,
          speakerName: "System",
          text: "응답을 가져올 수 없습니다.",
          timestamp: Date.now(),
        })
      } finally {
        setNpcThinking(false)
      }
    },
    [
      activeNpcId,
      isNpcThinking,
      messages,
      progress,
      settings.ttsEnabled,
      addMessage,
      setNpcThinking,
      setLastFeedback,
      completeQuest,
      speakText,
      getMood,
      setMood,
    ],
  )

  /** 마이크 토글 */
  const handleMicToggle = useCallback(() => {
    if (isRecording) {
      stopRecording()
      setRecording(false)
      eventBridge.emit("recording-stop")
      // 최종 인식 텍스트로 전송
      if (interimText.trim()) {
        handleSend(interimText.trim())
      }
    } else {
      setRecording(true)
      eventBridge.emit("recording-start")
      startRecording((finalText) => {
        setInterimText(finalText)
        handleSend(finalText)
        setRecording(false)
        eventBridge.emit("recording-stop")
      })
    }
  }, [
    isRecording,
    interimText,
    startRecording,
    stopRecording,
    setRecording,
    setInterimText,
    handleSend,
  ])

  // Space키에서 mic-toggle 이벤트 수신
  useEffect(() => {
    const onMicToggle = () => {
      handleMicToggle()
    }
    eventBridge.on("mic-toggle", onMicToggle)
    return () => {
      eventBridge.off("mic-toggle", onMicToggle)
    }
  }, [handleMicToggle])

  /** 텍스트 입력 전송 */
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(textInput)
  }

  if (!activeNpcId) {
    return (
      <div className="px-4 py-3 text-center text-muted-foreground text-sm">
        <p className="font-pixel">NPC에게 다가가서 대화해보세요!</p>
        <p className="text-xs mt-1">WASD / 방향키로 이동</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 space-y-2">
      {/* 입력 모드 전환 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">{isVoiceMode ? <><Mic size={12} /> 음성 모드</> : <><Keyboard size={12} /> 텍스트 모드</>}</span>
        </span>
        <button
          onClick={() => setInputMode(isVoiceMode ? "text" : "voice")}
          className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
        >
          {isVoiceMode ? <Keyboard size={12} /> : <Mic size={12} />}
          {isVoiceMode ? "텍스트로 전환" : "음성으로 전환"}
        </button>
      </div>

      {/* 음성 모드 */}
      {isVoiceMode && sttSupported ? (
        <div className="flex flex-col items-center gap-2">
          {/* 인식 중 텍스트 표시 */}
          {(isRecording || interimText) && (
            <div className="w-full px-3 py-2 bg-card/50 rounded text-sm text-center min-h-[36px]">
              {interimText || (
                <span className="text-muted-foreground animate-pulse">
                  聞いています...
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleMicToggle}
            disabled={isNpcThinking}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              isRecording
                ? "bg-primary animate-pulse shadow-[0_0_20px_rgba(233,69,96,0.5)]"
                : "bg-card hover:bg-card/80 border-2 border-primary/50",
              isNpcThinking && "opacity-50 cursor-not-allowed",
            )}
          >
            {isRecording ? (
              <MicOff size={28} className="text-primary-foreground" />
            ) : (
              <Mic size={28} className="text-primary" />
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            {isRecording
              ? "말하고 있어요... 다시 누르면 전송"
              : isNpcThinking
                ? "NPC가 생각 중..."
                : "눌러서 일본어로 말하기"}
          </p>
        </div>
      ) : (
        /* 텍스트 모드 */
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="일본어로 입력하세요..."
            disabled={isNpcThinking}
            className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 input-glow"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isNpcThinking}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      )}
      {!sttSupported && isVoiceMode && (
        <p className="text-xs text-destructive text-center">
          이 브라우저에서 음성 인식을 지원하지 않습니다. 텍스트 모드를
          사용해주세요.
        </p>
      )}
    </div>
  )
}
