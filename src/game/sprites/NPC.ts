import Phaser from "phaser"
import type { NPCDef } from "@/types/room"
import type { CharacterIcon } from "@/types/game"

/**
 * NPC - 편의점 내 NPC 캐릭터
 * 고정 위치, 대화 가능, 머리 위 아이콘 시스템
 */
export class NPC extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string
  readonly npcDef: NPCDef
  private statusIcon: Phaser.GameObjects.Image | null = null
  // @ts-expect-error stored for future reference
  private _nameTag: Phaser.GameObjects.Text
  private interactHint: Phaser.GameObjects.Text | null = null
  private iconTween: Phaser.Tweens.Tween | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, def: NPCDef) {
    super(scene, x, y, def.spriteKey)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.npcId = def.id
    this.npcDef = def
    this.setImmovable(true)
    this.setDepth(10)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(20, 24)
    body.setOffset(6, 20)

    // 이름표
    this._nameTag = scene.add
      .text(x, y - 32, def.name, {
        fontSize: "7px",
        color: "#4ade80",
        fontFamily: "DotGothic16, monospace",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(15)

    // 역할 표시
    scene.add
      .text(x, y - 24, def.role.split(" ")[0], {
        fontSize: "6px",
        color: "#8892b0",
        fontFamily: "DotGothic16, monospace",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setDepth(15)
  }

  /** 머리 위 아이콘 표시 (🎤/💬/❗/✅) */
  showIcon(type: CharacterIcon): void {
    this.hideIcon()
    const iconKey =
      type === "mic"
        ? "icon-mic"
        : type === "speech"
          ? "icon-speech"
          : type === "quest"
            ? "icon-quest"
            : type === "quest-complete"
              ? "icon-check"
              : null

    if (iconKey) {
      this.statusIcon = this.scene.add
        .image(this.x, this.y - 42, iconKey)
        .setDepth(20)

      this.iconTween = this.scene.tweens.add({
        targets: this.statusIcon,
        y: this.y - 48,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  /** 아이콘 숨기기 */
  hideIcon(): void {
    if (this.iconTween) {
      this.iconTween.destroy()
      this.iconTween = null
    }
    if (this.statusIcon) {
      this.statusIcon.destroy()
      this.statusIcon = null
    }
  }

  /** 대화 가능 힌트 표시 ('E' 또는 'Space') */
  showInteractHint(): void {
    if (this.interactHint) return
    this.interactHint = this.scene.add
      .text(this.x, this.y + 28, "[ SPACE ]", {
        fontSize: "7px",
        color: "#fbbf24",
        fontFamily: "DotGothic16, monospace",
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(20)

    this.scene.tweens.add({
      targets: this.interactHint,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    })
  }

  /** 대화 힌트 숨기기 */
  hideInteractHint(): void {
    if (this.interactHint) {
      this.scene.tweens.killTweensOf(this.interactHint)
      this.interactHint.destroy()
      this.interactHint = null
    }
  }
}
