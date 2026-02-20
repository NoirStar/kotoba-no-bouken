import Phaser from "phaser"
import { BootScene } from "./scenes/BootScene"
import { ConbiniScene } from "./scenes/ConbiniScene"
import { UIScene } from "./scenes/UIScene"

/** Phaser 게임 설정 */
export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 512,   // 16 tiles × 32px
    height: 384,  // 12 tiles × 32px
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, ConbiniScene, UIScene],
    backgroundColor: "#1a1a2e",
  }
}
