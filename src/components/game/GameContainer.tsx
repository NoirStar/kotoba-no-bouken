import { PhaserGame } from "@/game/PhaserGame"

/**
 * GameContainer - 게임 화면 래퍼
 * Phaser 캔버스를 감싸고 크기를 관리합니다.
 */
export function GameContainer() {
  return (
    <div className="relative w-full aspect-[4/3] max-w-[1024px] mx-auto rounded-lg overflow-hidden border-2 border-border shadow-2xl" style={{ imageRendering: 'pixelated' }}>
      <PhaserGame />
    </div>
  )
}
