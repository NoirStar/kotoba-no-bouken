import Phaser from "phaser"
import type { CharacterIcon } from "@/types/game"

/**
 * Player - 플레이어 캐릭터 스프라이트
 * WASD/방향키로 4방향 이동
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  }
  private speed = 120
  private statusIcon: Phaser.GameObjects.Image | null = null
  private nameText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player-sprite")
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setDepth(10)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(20, 24)
    body.setOffset(6, 20)

    // 이름 표시 (일본어 → DotGothic16)
    this.nameText = scene.add
      .text(x, y - 32, "あなた", {
        fontSize: "8px",
        color: "#60a5fa",
        fontFamily: "DotGothic16, monospace",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(15)

    // 키보드 입력 설정
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys()
      this.wasd = {
        W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      }
    }
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    // 이동 처리
    const left = this.cursors?.left?.isDown || this.wasd?.A?.isDown
    const right = this.cursors?.right?.isDown || this.wasd?.D?.isDown
    const up = this.cursors?.up?.isDown || this.wasd?.W?.isDown
    const down = this.cursors?.down?.isDown || this.wasd?.S?.isDown

    if (left) {
      body.setVelocityX(-this.speed)
    } else if (right) {
      body.setVelocityX(this.speed)
    }

    if (up) {
      body.setVelocityY(-this.speed)
    } else if (down) {
      body.setVelocityY(this.speed)
    }

    // 대각선 이동 속도 정규화
    if (body.velocity.length() > 0) {
      body.velocity.normalize().scale(this.speed)
    }

    // 이름/아이콘 위치 업데이트
    this.nameText.setPosition(this.x, this.y - 32)
    if (this.statusIcon) {
      this.statusIcon.setPosition(this.x, this.y - 42)
    }
  }

  /** 머리 위 아이콘 표시 */
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

      // 바운스 애니메이션
      this.scene.tweens.add({
        targets: this.statusIcon,
        y: this.y - 48,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      })
    }
  }

  /** 아이콘 숨기기 */
  hideIcon(): void {
    if (this.statusIcon) {
      this.scene.tweens.killTweensOf(this.statusIcon)
      this.statusIcon.destroy()
      this.statusIcon = null
    }
  }
}
