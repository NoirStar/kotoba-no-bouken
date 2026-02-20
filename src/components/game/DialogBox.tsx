import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useDialogStore } from "@/stores/dialogStore"
import { useGameStore } from "@/stores/gameStore"
import { useMoodStore } from "@/stores/moodStore"
import { User, MessageCircle } from "lucide-react"
import type { NPCMood } from "@/types/room"

/** 기분 이모지 + 색상 매핑 */
const moodDisplay: Record<NPCMood, { emoji: string; border: string }> = {
  happy: { emoji: "😊", border: "border-green-500/50" },
  neutral: { emoji: "", border: "border-border" },
  annoyed: { emoji: "😤", border: "border-yellow-500/50" },
  angry: { emoji: "😠", border: "border-red-500/50" },
  sad: { emoji: "😢", border: "border-blue-400/50" },
}

/**
 * 일본어 텍스트에 후리가나를 붙여 HTML로 렌더링
 * text: 漢字混じり文, reading: ひらがな文
 * 간단한 매칭으로 괄호 표기법도 지원: 漢字(かんじ)
 */
function renderFurigana(text: string, reading?: string): React.ReactNode {
  // 괄호 표기법 파싱: 漢字(かんじ)
  const bracketPattern = /([一-龥々]+)\(([ぁ-ゖー]+)\)/g
  const hasBrackets = bracketPattern.test(text)

  if (hasBrackets) {
    bracketPattern.lastIndex = 0
    const parts: React.ReactNode[] = []
    let lastIdx = 0
    let match: RegExpExecArray | null
    let key = 0

    while ((match = bracketPattern.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={key++}>{text.slice(lastIdx, match.index)}</span>)
      }
      parts.push(
        <ruby key={key++} className="text-sm">
          {match[1]}
          <rp>(</rp>
          <rt className="text-[8px] text-muted-foreground">{match[2]}</rt>
          <rp>)</rp>
        </ruby>,
      )
      lastIdx = match.index + match[0].length
    }
    if (lastIdx < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIdx)}</span>)
    }
    return <>{parts}</>
  }

  // reading이 있으면 전체 텍스트 위에 표시
  if (reading && reading !== text) {
    return (
      <ruby className="text-sm font-pixel">
        {text}
        <rp>(</rp>
        <rt className="text-[7px] text-muted-foreground font-pixel">{reading}</rt>
        <rp>)</rp>
      </ruby>
    )
  }

  return <span className="text-sm font-pixel">{text}</span>
}

/**
 * DialogBox - NPC/플레이어 대화 표시 (후리가나 지원)
 */
export function DialogBox() {
  const { messages, isNpcThinking, activeNpcId } = useDialogStore()
  const { settings } = useGameStore()
  const { getMood } = useMoodStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 현재 NPC 기분
  const npcMoodState = activeNpcId ? getMood(activeNpcId) : null
  const npcMood = npcMoodState?.mood ?? "neutral"
  const moodInfo = moodDisplay[npcMood]

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
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative",
                isPlayer ? "bg-pixel-blue" : "bg-pixel-green",
              )}
            >
              {isPlayer ? <User size={14} /> : <MessageCircle size={14} />}
              {/* NPC 기분 표시 */}
              {!isPlayer && moodInfo.emoji && (
                <span className="absolute -top-1 -right-1 text-xs">{moodInfo.emoji}</span>
              )}
            </div>

            {/* 메시지 내용 */}
            <div
              className={cn(
                "max-w-[75%] rounded-lg px-3 py-2",
                isPlayer
                  ? "bg-primary/20 border border-primary/30"
                  : cn("bg-card border", moodInfo.border),
              )}
            >
              <p className="text-xs text-muted-foreground mb-1">
                {msg.speakerName}
              </p>
              <div className="leading-relaxed">{renderFurigana(msg.text, msg.reading)}</div>
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
            <MessageCircle size={14} />
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
