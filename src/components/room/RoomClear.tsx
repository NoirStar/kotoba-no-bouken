import { useGameStore } from "@/stores/gameStore"
import { useQuestStore } from "@/stores/questStore"
import { conbiniRoom } from "@/data/rooms/conbini"
import { motion } from "framer-motion"
import { PartyPopper, Trophy, Store } from "lucide-react"

/**
 * RoomClear - 방 클리어 연출 화면
 */
export function RoomClear() {
  const { setState, currentRoomId, clearedRooms } = useGameStore()
  const { getCompletedCount } = useQuestStore()

  const room = currentRoomId
    ? conbiniRoom.id === currentRoomId
      ? conbiniRoom
      : null
    : null

  const isAllCleared = clearedRooms.length >= 1 // MVP: 1개 Room만

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-8xl mb-6"
      >
        <PartyPopper size={80} strokeWidth={1.5} className="text-pixel-yellow" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-pixel text-3xl text-primary mb-2"
      >
        クリア！
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-lg mb-1 flex items-center justify-center gap-2">
          <Store size={20} className="text-primary" /> {room?.name} 클리어!
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          퀘스트 {getCompletedCount()}/{room?.quests.length ?? 0} 완료
        </p>

        {isAllCleared ? (
          <div className="space-y-4">
            <p className="font-pixel text-pixel-yellow text-lg flex items-center justify-center gap-2">
              <Trophy size={20} /> おめでとうございます！ 전체 클리어!
            </p>
            <button
              onClick={() => setState("title")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-pixel hover:bg-primary/80 transition-colors"
            >
              타이틀로 돌아가기
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setState("room-select")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-pixel hover:bg-primary/80 transition-colors"
            >
              다음 방 선택하기
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
