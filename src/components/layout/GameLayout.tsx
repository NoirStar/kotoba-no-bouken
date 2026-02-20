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
import { ArrowLeft, Settings } from "lucide-react"

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

  // 이벤트 브릿지: NPC 근접/이탈 시 대화 상태 관리
  const handleNearNpc = useCallback(
    (npcId: unknown) => {
      if (typeof npcId === "string" && !activeNpcId) {
        startConversation(npcId)
      }
    },
    [activeNpcId, startConversation],
  )

  const handleLeftNpc = useCallback(() => {
    endConversation()
  }, [endConversation])

  useEffect(() => {
    eventBridge.on("player-near-npc", handleNearNpc)
    eventBridge.on("player-left-npc", handleLeftNpc)

    return () => {
      eventBridge.off("player-near-npc", handleNearNpc)
      eventBridge.off("player-left-npc", handleLeftNpc)
    }
  }, [handleNearNpc, handleLeftNpc])

  // 전체 퀘스트 클리어 체크
  const allQuestIds = conbiniRoom.quests.map((q) => q.id)
  useEffect(() => {
    if (isRoomCleared(allQuestIds)) {
      const { clearRoom } = useGameStore.getState()
      clearRoom(conbiniRoom.id)
    }
  }, [isRoomCleared, allQuestIds])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
        <button
          onClick={() => setState("room-select")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>방 선택</span>
        </button>
        <h1 className="font-pixel text-sm">
          🏪 コンビニ
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
