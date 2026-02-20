import { cn } from "@/lib/utils"
import { useGameStore } from "@/stores/gameStore"
import { useQuestStore } from "@/stores/questStore"
import { allRooms } from "@/data/rooms/conbini"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Lock,
  Check,
  Star,
  Skull,
  Play,
  Store,
} from "lucide-react"
import type { QuestDifficulty } from "@/types/room"

const DIFFICULTIES: {
  key: QuestDifficulty
  label: string
  labelJa: string
  icon: React.ReactNode
  color: string
  bg: string
  border: string
  description: string
}[] = [
  {
    key: "easy",
    label: "EASY",
    labelJa: "かんたん",
    icon: <Star size={20} />,
    color: "text-pixel-green",
    bg: "bg-pixel-green/10",
    border: "border-pixel-green/40",
    description: "기본적인 인사와 간단한 쇼핑 표현을 익혀요",
  },
  {
    key: "normal",
    label: "NORMAL",
    labelJa: "ふつう",
    icon: <><Star size={20} /><Star size={20} /></>,
    color: "text-pixel-blue",
    bg: "bg-pixel-blue/10",
    border: "border-pixel-blue/40",
    description: "점원에게 요청하고 상황에 맞는 표현을 사용해요",
  },
  {
    key: "hard",
    label: "HARD",
    labelJa: "むずかしい",
    icon: <><Star size={20} /><Star size={20} /><Star size={20} /></>,
    color: "text-pixel-yellow",
    bg: "bg-pixel-yellow/10",
    border: "border-pixel-yellow/40",
    description: "복잡한 상황을 일본어로 해결해야 해요",
  },
  {
    key: "hell",
    label: "HELL",
    labelJa: "じごく",
    icon: <Skull size={22} />,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/40",
    description: "부끄럽고 어려운 상황을 일본어로 돌파하세요",
  },
]

/**
 * DifficultySelect - 난이도 선택 화면
 * EASY 클리어 → NORMAL 해금, NORMAL 클리어 → HARD 해금 ...
 */
export function DifficultySelect() {
  const {
    currentRoomId,
    setState,
    startWithDifficulty,
    isDifficultyUnlocked,
    isDifficultyCleared,
  } = useGameStore()
  const { initRoom, setDifficulty } = useQuestStore()

  const room = allRooms.find((r) => r.id === currentRoomId)
  if (!room) return null

  const handleSelect = (diff: QuestDifficulty) => {
    if (!isDifficultyUnlocked(room.id, diff)) return
    // 해당 난이도의 퀘스트만 초기화
    const questIds = room.quests
      .filter((q) => q.difficulty === diff)
      .map((q) => q.id)
    initRoom(questIds)
    setDifficulty(diff)
    startWithDifficulty(diff)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* 뒤로가기 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setState("room-select")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        방 선택
      </motion.button>

      {/* 방 정보 */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center text-primary mb-3">
          <Store size={48} strokeWidth={1.5} />
        </div>
        <h1 className="font-pixel text-2xl mb-1">{room.name}</h1>
        <p className="text-sm text-muted-foreground">{room.nameKo}</p>
      </motion.div>

      {/* 난이도 선택 */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-semibold text-foreground mb-6"
      >
        난이도를 선택하세요
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {DIFFICULTIES.map((diff, i) => {
          const unlocked = isDifficultyUnlocked(room.id, diff.key)
          const cleared = isDifficultyCleared(room.id, diff.key)
          const questCount = room.quests.filter(
            (q) => q.difficulty === diff.key,
          ).length

          return (
            <motion.button
              key={diff.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              onClick={() => handleSelect(diff.key)}
              disabled={!unlocked}
              className={cn(
                "relative p-5 rounded-xl border-2 transition-all text-left",
                cleared
                  ? "border-success/50 bg-success/5 hover:bg-success/10 cursor-pointer"
                  : unlocked
                    ? `${diff.border} ${diff.bg} hover:brightness-110 cursor-pointer`
                    : "border-border/30 bg-muted/10 cursor-not-allowed opacity-40",
              )}
            >
              {/* 상태 아이콘 */}
              <div className="absolute top-3 right-3">
                {cleared ? (
                  <Check size={18} className="text-success" />
                ) : !unlocked ? (
                  <Lock size={18} className="text-muted-foreground" />
                ) : null}
              </div>

              {/* 난이도 아이콘 + 라벨 */}
              <div className={cn("flex items-center gap-2 mb-2", cleared ? "text-success" : unlocked ? diff.color : "text-muted-foreground")}>
                <div className="flex items-center gap-0.5">{diff.icon}</div>
                <span className="font-pixel text-lg">{diff.label}</span>
                <span className="text-xs opacity-60">({diff.labelJa})</span>
              </div>

              {/* 설명 */}
              <p className="text-xs text-muted-foreground mb-3">
                {unlocked ? diff.description : "이전 난이도를 클리어하면 해금됩니다"}
              </p>

              {/* 퀘스트 수 + 시작 */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  퀘스트 {questCount}개
                </span>
                {unlocked && !cleared && (
                  <span className={cn("flex items-center gap-1 font-pixel", diff.color)}>
                    <Play size={12} /> 시작
                  </span>
                )}
                {cleared && (
                  <span className="flex items-center gap-1 text-success font-pixel">
                    <Play size={12} /> 다시 도전
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
