import { useGameStore } from "@/stores/gameStore"
import { GameLayout } from "@/components/layout/GameLayout"
import { RoomSelect } from "@/components/room/RoomSelect"
import { RoomClear } from "@/components/room/RoomClear"
import { motion, AnimatePresence } from "framer-motion"

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
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="font-pixel text-4xl md:text-5xl text-primary mb-3">
              ことばの冒険
            </h1>
            <p className="text-lg text-muted-foreground">
              Kotoba no Bōken
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              일본어로 말해서 퀘스트를 클리어하자!
            </p>
          </motion.div>

          {/* 조작 설명 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 border border-border rounded-xl p-6 mb-8 max-w-md w-full"
          >
            <h2 className="font-pixel text-sm text-accent mb-3">놀이 방법</h2>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>🎮 <span className="text-foreground">WASD / 방향키</span>로 캐릭터를 움직여요</p>
              <p>🎤 NPC 근처에서 <span className="text-foreground">마이크 버튼</span>을 눌러 일본어로 말해요</p>
              <p>💬 NPC가 AI로 자연스럽게 <span className="text-foreground">응답</span>해요</p>
              <p>📋 각 방의 <span className="text-foreground">퀘스트</span>를 모두 클리어하면 성공!</p>
              <p>💀 난이도: EASY → NORMAL → HARD → <span className="text-primary">HELL</span></p>
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
            🎧 마이크 권한이 필요합니다 · Chrome/Edge 권장
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
