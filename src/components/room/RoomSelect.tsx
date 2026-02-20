import { cn } from "@/lib/utils"
import { useGameStore } from "@/stores/gameStore"
import { allRooms } from "@/data/rooms/conbini"
import { useQuestStore } from "@/stores/questStore"
import { Lock, Check, Play } from "lucide-react"

/**
 * RoomSelect - 방 선택 화면
 */
export function RoomSelect() {
  const { enterRoom, clearedRooms } = useGameStore()
  const { initRoom } = useQuestStore()

  const handleEnterRoom = (roomId: string) => {
    const room = allRooms.find((r) => r.id === roomId)
    if (!room) return
    initRoom(room.quests.map((q) => q.id))
    enterRoom(roomId)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="font-pixel text-3xl text-primary mb-2">ことばの冒険</h1>
      <p className="text-muted-foreground text-sm mb-8">
        방을 선택하고, 일본어로 NPC와 대화하며 퀘스트를 클리어하세요!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {allRooms.map((room) => {
          const isCleared = clearedRooms.includes(room.id)
          const isAvailable = true // MVP에서는 첫 방만 열려있음

          return (
            <button
              key={room.id}
              onClick={() => isAvailable && handleEnterRoom(room.id)}
              disabled={!isAvailable}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all text-left",
                isCleared
                  ? "border-success/50 bg-success/5"
                  : isAvailable
                    ? "border-border hover:border-primary/50 hover:bg-card/50 cursor-pointer"
                    : "border-border/50 bg-muted/20 cursor-not-allowed opacity-50",
              )}
            >
              {/* 상태 뱃지 */}
              <div className="absolute top-3 right-3">
                {isCleared ? (
                  <Check size={20} className="text-success" />
                ) : !isAvailable ? (
                  <Lock size={20} className="text-muted-foreground" />
                ) : null}
              </div>

              <div className="text-4xl mb-3">{room.icon}</div>
              <h3 className="font-pixel text-lg">{room.name}</h3>
              <p className="text-sm text-muted-foreground">{room.nameKo}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {room.description}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>👤 NPC {room.npcs.length}명</span>
                <span>•</span>
                <span>📋 퀘스트 {room.quests.length}개</span>
              </div>

              {isAvailable && !isCleared && (
                <div className="mt-3 flex items-center gap-1 text-primary text-xs font-pixel">
                  <Play size={12} /> 시작하기
                </div>
              )}
            </button>
          )
        })}

        {/* 미래 Room 플레이스홀더 */}
        {["🍜 レストラン", "🏫 学校", "🏥 病院", "🏨 ホテル", "🚉 駅"].map(
          (name) => (
            <div
              key={name}
              className="p-6 rounded-xl border-2 border-dashed border-border/30 text-center opacity-40"
            >
              <div className="text-4xl mb-3">{name.split(" ")[0]}</div>
              <h3 className="font-pixel text-lg text-muted-foreground">
                {name.split(" ")[1]}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Coming Soon</p>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
