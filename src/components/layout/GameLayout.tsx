import { useEffect, useCallback } from "react"
import { GameContainer } from "@/components/game/GameContainer"
import { DialogBox } from "@/components/game/DialogBox"
import { InputPanel } from "@/components/game/InputPanel"
import { QuestPanel } from "@/components/game/QuestPanel"
import { GrammarFeedback } from "@/components/feedback/GrammarFeedback"
import { useDialogStore } from "@/stores/dialogStore"
import { useGameStore } from "@/stores/gameStore"
import { useQuestStore } from "@/stores/questStore"
import { eventBridge } from "@/game/EventBridge"
import { conbiniRoom } from "@/data/rooms/conbini"
import { ArrowLeft, Settings, Store } from "lucide-react"

/**
 * GameLayout - 게임 플레이 중 전체 레이아웃
 *
 * ┌──────────────────────────────────────────┐
 * │ Header (방 이름, 뒤로가기)                    │
 * ├──────────────────┬───────────────────────┤
 * │                  │                       │
 * │   게임 화면       │   퀘스트 패널           │
 * │   (Phaser)       │                       │
 * │                  │                       │
 * ├──────────────────┤                       │
 * │  대화창           │                       │
 * │  피드백           │                       │
 * │  입력 패널        │                       │
 * └──────────────────┴───────────────────────┘
 */
export function GameLayout() {
  const { setState } = useGameStore()
  const { startConversation, endConversation, activeNpcId } = useDialogStore()
  const { isRoomCleared } = useQuestStore()

  // 이벤트 브릿지: Z키로 대화 시작, 이탈 시 종료
  const handleStartConversation = useCallback(
    (npcId: unknown) => {
      if (typeof npcId === "string" && !activeNpcId) {
        startConversation(npcId)
      }
    },
    [activeNpcId, startConversation],
  )

  const handleLeftNpc = useCallback(() => {
    endConversation()
    eventBridge.emit("conversation-ended")
  }, [endConversation])

  useEffect(() => {
    eventBridge.on("start-conversation", handleStartConversation)
    eventBridge.on("player-left-npc", handleLeftNpc)

    return () => {
      eventBridge.off("start-conversation", handleStartConversation)
      eventBridge.off("player-left-npc", handleLeftNpc)
    }
  }, [handleStartConversation, handleLeftNpc])

  // 현재 난이도의 퀘스트 클리어 체크
  const { currentDifficulty } = useGameStore()
  const difficultyQuestIds = conbiniRoom.quests
    .filter((q) => q.difficulty === currentDifficulty)
    .map((q) => q.id)

  useEffect(() => {
    if (difficultyQuestIds.length > 0 && isRoomCleared(difficultyQuestIds)) {
      const { clearDifficulty, currentRoomId: roomId, currentDifficulty: diff } = useGameStore.getState()
      if (roomId && diff) {
        clearDifficulty(roomId, diff)
      }
      // 전체 난이도 클리어 체크
      const allCleared = ["easy", "normal", "hard", "hell"].every(
        (d) => useGameStore.getState().isDifficultyCleared(roomId!, d as import("@/types/room").QuestDifficulty),
      )
      if (allCleared) {
        const { clearRoom } = useGameStore.getState()
        clearRoom(conbiniRoom.id)
      } else {
        // 난이도 선택 화면으로 돌아가기
        const { setState } = useGameStore.getState()
        setState("difficulty-select")
      }
    }
  }, [isRoomCleared, difficultyQuestIds])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
        <button
          onClick={() => setState("difficulty-select")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>난이도 선택</span>
        </button>
        <h1 className="font-pixel text-sm flex items-center gap-1.5">
          <Store size={14} className="text-primary" /> コンビニ
        </h1>
        <button className="text-muted-foreground hover:text-foreground">
          <Settings size={16} />
        </button>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex min-h-0">
        {/* 좌측: 게임 + 대화 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 게임 화면 */}
          <div className="flex-shrink-0">
            <GameContainer />
          </div>

          {/* 대화 영역 */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-border">
            <DialogBox />
            <GrammarFeedback />
            <div className="border-t border-border">
              <InputPanel />
            </div>
          </div>
        </div>

        {/* 우측: 퀘스트 패널 */}
        <div className="w-72 border-l border-border hidden md:flex flex-col">
          <QuestPanel />
        </div>
      </div>
    </div>
  )
}
