import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useDialogStore } from "@/stores/dialogStore"
import { useGameStore } from "@/stores/gameStore"

/**
 * DialogBox - NPC/플레이어 대화 표시
 */
export function DialogBox() {
  const { messages, isNpcThinking, activeNpcId } = useDialogStore()
  const { settings } = useGameStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isNpcThinking])

  if (!activeNpcId && messages.length === 0) return null

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0"
    >
      {messages.map((msg) => {
        const isPlayer = msg.speaker === "player"
        return (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              isPlayer ? "flex-row-reverse" : "flex-row",
            )}
          >
            {/* 아바타 */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                isPlayer ? "bg-pixel-blue" : "bg-pixel-green",
              )}
            >
              {isPlayer ? "🎮" : "💬"}
            </div>

            {/* 메시지 내용 */}
            <div
              className={cn(
                "max-w-[75%] rounded-lg px-3 py-2",
                isPlayer
                  ? "bg-primary/20 border border-primary/30"
                  : "bg-card border border-border",
              )}
            >
              <p className="text-xs text-muted-foreground mb-1">
                {msg.speakerName}
              </p>
              <p className="text-sm font-pixel">{msg.text}</p>
              {/* 한국어 번역 표시 */}
              {msg.translation && settings.showTranslation && (
                <p className="text-xs text-muted-foreground mt-1 border-t border-border/50 pt-1">
                  {msg.translation}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {/* NPC thinking indicator */}
      {isNpcThinking && (
        <div className="flex gap-2 items-end">
          <div className="w-8 h-8 rounded-full bg-pixel-green flex items-center justify-center text-xs">
            💬
          </div>
          <div className="bg-card border border-border rounded-lg px-3 py-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
