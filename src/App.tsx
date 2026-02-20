import { useGameStore } from "@/stores/gameStore"
import { GameLayout } from "@/components/layout/GameLayout"
import { RoomSelect } from "@/components/room/RoomSelect"
import { DifficultySelect } from "@/components/room/DifficultySelect"
import { RoomClear } from "@/components/room/RoomClear"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Move, Mic, MessageCircle, ClipboardList, Skull, Headphones } from "lucide-react"

/**
 * App - 메인 앱 컴포넌트
 * 게임 상태에 따라 화면을 전환합니다.
 */
export default function App() {
  const { state, setState } = useGameStore()

  return (
    <AnimatePresence mode="wait">
      {state === "title" && (
        <motion.div
          key="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-screen p-8 select-none"
        >
          {/* 타이틀 로고 */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-12"
          >
            <div className="text-primary mb-4"><Gamepad2 size={64} strokeWidth={1.5} /></div>
            <h1 className="font-pixel text-4xl md:text-5xl text-primary mb-3">
              ことばの冒険
            </h1>
            <p className="text-lg text-muted-foreground">
              코토바의 모험
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              일본어로 말하고 퀘스트를 클리어하자!
            </p>
          </motion.div>

          {/* 조작 설명 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 border border-border rounded-xl p-6 mb-8 max-w-md w-full"
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">게임 방법</h2>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Move size={14} className="text-primary shrink-0" /> <span className="text-foreground">WASD / 방향키</span>로 캐릭터를 움직여요</p>
              <p className="flex items-center gap-1.5"><Mic size={14} className="text-primary shrink-0" /> NPC 근처에서 <span className="text-foreground">마이크 버튼</span>을 눌러 일본어로 말해요</p>
              <p className="flex items-center gap-1.5"><MessageCircle size={14} className="text-primary shrink-0" /> NPC가 AI로 자연스럽게 <span className="text-foreground">응답</span>해요</p>
              <p className="flex items-center gap-1.5"><ClipboardList size={14} className="text-primary shrink-0" /> 각 방의 <span className="text-foreground">퀘스트</span>를 모두 클리어하면 성공!</p>
              <p className="flex items-center gap-1.5"><Skull size={14} className="text-primary shrink-0" /> 난이도: EASY → NORMAL → HARD → <span className="text-primary">HELL</span></p>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setState("room-select")}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-pixel text-lg hover:bg-primary/80 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            ▶ スタート
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1"><Headphones size={14} /> 마이크 권한이 필요합니다 · Chrome/Edge 권장</span>
          </motion.p>
        </motion.div>
      )}

      {state === "room-select" && (
        <motion.div
          key="room-select"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <RoomSelect />
        </motion.div>
      )}

      {state === "difficulty-select" && (
        <motion.div
          key="difficulty-select"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <DifficultySelect />
        </motion.div>
      )}

      {state === "playing" && (
        <motion.div
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen"
        >
          <GameLayout />
        </motion.div>
      )}

      {(state === "room-clear" || state === "game-clear") && (
        <motion.div
          key="clear"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RoomClear />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
