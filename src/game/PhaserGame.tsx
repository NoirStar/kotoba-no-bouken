import { useEffect, useRef } from "react"
import Phaser from "phaser"
import { createGameConfig } from "./config"

/**
 * PhaserGame - React ↔ Phaser 브릿지 컴포넌트
 * Phaser 게임 인스턴스를 React 컴포넌트 내에서 관리합니다.
 */
export function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config = createGameConfig("game-container")
    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div
      id="game-container"
      ref={containerRef}
      className="game-canvas w-full h-full"
    />
  )
}
