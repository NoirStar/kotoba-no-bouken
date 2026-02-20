import { cn } from "@/lib/utils"
import { useQuestStore } from "@/stores/questStore"
import { conbiniRoom } from "@/data/rooms/conbini"
import { Check, Lock, Star, Skull, ChevronRight } from "lucide-react"
import type { QuestDifficulty } from "@/types/room"

const DIFFICULTY_CONFIG: Record<
  QuestDifficulty,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  easy: {
    label: "EASY ⭐",
    icon: <Star size={14} />,
    color: "text-pixel-green",
    bg: "bg-pixel-green/10 border-pixel-green/30",
  },
  normal: {
    label: "NORMAL ⭐⭐",
    icon: <Star size={14} />,
    color: "text-pixel-blue",
    bg: "bg-pixel-blue/10 border-pixel-blue/30",
  },
  hard: {
    label: "HARD ⭐⭐⭐",
    icon: <Star size={14} />,
    color: "text-pixel-yellow",
    bg: "bg-pixel-yellow/10 border-pixel-yellow/30",
  },
  hell: {
    label: "HELL 💀",
    icon: <Skull size={14} />,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
}

/**
 * QuestPanel - 퀘스트 목록 & 진행도
 */
export function QuestPanel() {
  const { progress, selectedDifficulty, setDifficulty, activeQuestId, activateQuest } =
    useQuestStore()

  const quests = conbiniRoom.quests.filter(
    (q) => q.difficulty === selectedDifficulty,
  )
  const totalQuests = conbiniRoom.quests.length
  const completedCount = Object.values(progress).filter(
    (p) => p.status === "completed",
  ).length

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-sm">🏪 コンビニ クエスト</h2>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalQuests}
          </span>
        </div>
        {/* 진행 바 */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / totalQuests) * 100}%` }}
          />
        </div>
      </div>

      {/* 난이도 탭 */}
      <div className="flex border-b border-border">
        {(["easy", "normal", "hard", "hell"] as QuestDifficulty[]).map(
          (diff) => {
            const cfg = DIFFICULTY_CONFIG[diff]
            const count = conbiniRoom.quests.filter(
              (q) => q.difficulty === diff,
            ).length
            const done = conbiniRoom.quests.filter(
              (q) =>
                q.difficulty === diff &&
                progress[q.id]?.status === "completed",
            ).length
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={cn(
                  "flex-1 py-2 text-xs font-pixel transition-colors border-b-2",
                  selectedDifficulty === diff
                    ? `${cfg.color} border-current`
                    : "text-muted-foreground border-transparent hover:text-foreground",
                )}
              >
                {diff.toUpperCase()}
                <span className="ml-1 text-[10px] opacity-60">
                  {done}/{count}
                </span>
              </button>
            )
          },
        )}
      </div>

      {/* 퀘스트 목록 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {quests
          .sort((a, b) => a.order - b.order)
          .map((quest) => {
            const status = progress[quest.id]?.status ?? "active"
            const isCompleted = status === "completed"
            const isActive = quest.id === activeQuestId
            const cfg = DIFFICULTY_CONFIG[quest.difficulty]

            return (
              <button
                key={quest.id}
                onClick={() => !isCompleted && activateQuest(quest.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg border transition-all text-xs",
                  isCompleted
                    ? "bg-success/10 border-success/30 opacity-70"
                    : isActive
                      ? cfg.bg + " border-current " + cfg.color
                      : "bg-card/50 border-border hover:border-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">
                  {/* 상태 아이콘 */}
                  {isCompleted ? (
                    <Check size={14} className="text-success shrink-0" />
                  ) : status === "locked" ? (
                    <Lock size={14} className="text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight
                      size={14}
                      className={cn("shrink-0", isActive ? cfg.color : "text-muted-foreground")}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-pixel truncate">{quest.title}</div>
                    <div className="text-muted-foreground text-[10px] truncate">
                      {quest.titleKo}
                    </div>
                  </div>
                </div>

                {/* 활성 퀘스트 상세 */}
                {isActive && !isCompleted && (
                  <div className="mt-2 pl-6 space-y-1">
                    <p className="text-muted-foreground">{quest.description}</p>
                    {quest.hints.length > 0 && (
                      <p className="text-pixel-yellow text-[10px]">
                        💡 {quest.hints[0]}
                      </p>
                    )}
                    {quest.grammarPoint && (
                      <p className="text-accent text-[10px]">
                        📚 {quest.grammarPoint}
                      </p>
                    )}
                  </div>
                )}
              </button>
            )
          })}
      </div>
    </div>
  )
}
