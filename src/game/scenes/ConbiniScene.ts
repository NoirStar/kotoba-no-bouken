import Phaser from "phaser"
import { Player } from "../sprites/Player"
import { NPC } from "../sprites/NPC"
import { eventBridge } from "../EventBridge"
import { conbiniRoom } from "@/data/rooms/conbini"

/**
 * ConbiniScene - 편의점 Room
 * 프로토타입 타일맵 + 플레이어 + NPC
 */
export class ConbiniScene extends Phaser.Scene {
  private player!: Player
  private npcs: NPC[] = []
  private nearestNpc: NPC | null = null
  private walls!: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super({ key: "ConbiniScene" })
  }

  create(): void {
    // 편의점 인테리어 타일맵 생성 (프로토타입)
    this.createTileMap()

    // NPC 배치
    this.createNPCs()

    // 플레이어 생성 (방 중앙 아래)
    this.player = new Player(this, 8 * 32, 10 * 32)

    // 물리 충돌
    this.physics.add.collider(this.player, this.walls)
    for (const npc of this.npcs) {
      this.physics.add.collider(this.player, npc)
    }

    // 카메라
    this.cameras.main.setBounds(0, 0, 512, 384)

    // React 이벤트 리스너
    eventBridge.on("recording-start", () => {
      this.player.showIcon("mic")
    })
    eventBridge.on("recording-stop", () => {
      this.player.hideIcon()
    })
    eventBridge.on("npc-speak", (npcId: unknown) => {
      const npc = this.npcs.find((n) => n.npcId === npcId)
      npc?.showIcon("speech")
      this.time.delayedCall(3000, () => {
        npc?.hideIcon()
      })
    })
    eventBridge.on("quest-complete", () => {
      // 퀘스트 완료 이펙트
      this.cameras.main.flash(300, 16, 185, 129, false)
    })
  }

  update(): void {
    this.player.update()
    this.checkNpcProximity()
  }

  /** NPC 근접 감지 */
  private checkNpcProximity(): void {
    const INTERACT_DISTANCE = 60 // 픽셀 단위

    let closest: NPC | null = null
    let closestDist = Infinity

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y,
      )
      if (dist < INTERACT_DISTANCE && dist < closestDist) {
        closest = npc
        closestDist = dist
      }
    }

    if (closest && closest !== this.nearestNpc) {
      this.nearestNpc = closest
      eventBridge.emit("player-near-npc", closest.npcId, closestDist)
      closest.showInteractHint()
    } else if (!closest && this.nearestNpc) {
      eventBridge.emit("player-left-npc", this.nearestNpc.npcId)
      this.nearestNpc.hideInteractHint()
      this.nearestNpc = null
    }
  }

  /** 프로토타입 타일맵 생성 */
  private createTileMap(): void {
    this.walls = this.physics.add.staticGroup()

    const room = conbiniRoom
    const W = room.width
    const H = room.height

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x * 32 + 16
        const py = y * 32 + 16

        // 벽 (테두리)
        if (y === 0 || y === H - 1 || x === 0 || x === W - 1) {
          // 입구 (아래 가운데)
          if (y === H - 1 && (x === 7 || x === 8)) {
            this.add.image(px, py, "tile-door")
          } else {
            const wall = this.walls.create(px, py, "tile-wall") as Phaser.Physics.Arcade.Image
            wall.setImmovable(true)
            wall.refreshBody()
          }
        }
        // 선반 (상품 진열대)
        else if (
          (y >= 2 && y <= 4 && x === 3) ||
          (y >= 2 && y <= 4 && x === 6) ||
          (y >= 2 && y <= 4 && x === 9) ||
          (y >= 7 && y <= 8 && x === 3) ||
          (y >= 7 && y <= 8 && x === 6)
        ) {
          const shelf = this.walls.create(px, py, "tile-shelf") as Phaser.Physics.Arcade.Image
          shelf.setImmovable(true)
          shelf.refreshBody()
        }
        // 카운터 (오른쪽 위)
        else if (y >= 2 && y <= 4 && x >= 12 && x <= 14) {
          const counter = this.walls.create(px, py, "tile-counter") as Phaser.Physics.Arcade.Image
          counter.setImmovable(true)
          counter.refreshBody()
        }
        // 바닥
        else {
          this.add.image(px, py, "tile-floor")
        }
      }
    }

    // 간판 텍스트
    this.add
      .text(256, 20, "🏪 コンビニ", {
        fontSize: "10px",
        color: "#ffffff",
        fontFamily: "DotGothic16, monospace",
      })
      .setOrigin(0.5)
      .setDepth(5)

    // 선반 라벨
    this.addShelfLabel(3 * 32 + 16, 1 * 32 + 24, "おにぎり")
    this.addShelfLabel(6 * 32 + 16, 1 * 32 + 24, "お弁当")
    this.addShelfLabel(9 * 32 + 16, 1 * 32 + 24, "飲み物")
    this.addShelfLabel(3 * 32 + 16, 6 * 32 + 24, "お菓子")
    this.addShelfLabel(6 * 32 + 16, 6 * 32 + 24, "ラーメン")
    this.addShelfLabel(13 * 32 + 16, 1 * 32 + 24, "レジ")
  }

  private addShelfLabel(x: number, y: number, text: string): void {
    this.add
      .text(x, y, text, {
        fontSize: "7px",
        color: "#fff8e7",
        fontFamily: "DotGothic16, monospace",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 2, y: 1 },
      })
      .setOrigin(0.5)
      .setDepth(5)
  }

  /** NPC 생성 */
  private createNPCs(): void {
    for (const npcDef of conbiniRoom.npcs) {
      const npc = new NPC(
        this,
        npcDef.position.x * 32 + 16,
        npcDef.position.y * 32 + 16,
        npcDef,
      )
      this.npcs.push(npc)
    }
  }
}
