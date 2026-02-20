import Phaser from "phaser"
import { eventBridge } from "../EventBridge"

/**
 * UIScene - 게임 내 UI 오버레이
 * 조작법 힌트 + 자막 시스템
 */
export class UIScene extends Phaser.Scene {
  private subtitleBg!: Phaser.GameObjects.Rectangle
  private subtitleText!: Phaser.GameObjects.Text
  private subtitleSpeaker!: Phaser.GameObjects.Text
  private subtitleTimer?: Phaser.Time.TimerEvent
  private controlsContainer!: Phaser.GameObjects.Container

  constructor() {
    super({ key: "UIScene" })
  }

  create(): void {
    // UIScene은 ConbiniScene 위에 오버레이로 실행
    this.createControlHints()
    this.createSubtitleSystem()
    this.registerEventListeners()
  }

  /** 조작법 힌트 (화면 좌하단) */
  private createControlHints(): void {
    // 한국어 설명 → Noto Sans KR, 키 이름 → DotGothic16
    const hintStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "8px",
      color: "#ffffff",
      fontFamily: "'Noto Sans KR', sans-serif",
      stroke: "#000000",
      strokeThickness: 2,
    }
    const keyStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "8px",
      color: "#fbbf24",
      fontFamily: "DotGothic16, monospace",
      stroke: "#000000",
      strokeThickness: 2,
    }

    const hints = [
      { key: "WASD / ↑↓←→", desc: "이동" },
      { key: "Z", desc: "말걸기" },
      { key: "SPACE", desc: "마이크" },
    ]

    const elements: Phaser.GameObjects.GameObject[] = []
    // 반투명 배경
    const bg = this.add
      .rectangle(0, 0, 120, hints.length * 16 + 8, 0x000000, 0.5)
      .setOrigin(0, 0)
    bg.setStrokeStyle(1, 0x333333, 0.5)
    elements.push(bg)

    hints.forEach((h, i) => {
      const y = 4 + i * 16
      elements.push(
        this.add.text(6, y, h.key, keyStyle),
        this.add.text(82, y, h.desc, hintStyle),
      )
    })

    this.controlsContainer = this.add.container(6, 384 - hints.length * 16 - 16, elements)
    this.controlsContainer.setDepth(100)
    this.controlsContainer.setAlpha(0.8)
  }

  /** 자막 시스템 (화면 하단 중앙) */
  private createSubtitleSystem(): void {
    // 자막 배경
    this.subtitleBg = this.add
      .rectangle(256, 362, 480, 36, 0x000000, 0.75)
      .setDepth(99)
      .setVisible(false)

    this.subtitleBg.setStrokeStyle(1, 0x555555, 0.5)

    // 화자 이름 (일본어 → DotGothic16)
    this.subtitleSpeaker = this.add
      .text(30, 350, "", {
        fontSize: "8px",
        color: "#fbbf24",
        fontFamily: "DotGothic16, monospace",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setDepth(100)
      .setVisible(false)

    // 자막 텍스트 (일본어 → DotGothic16)
    this.subtitleText = this.add
      .text(30, 360, "", {
        fontSize: "9px",
        color: "#ffffff",
        fontFamily: "DotGothic16, monospace",
        wordWrap: { width: 460, useAdvancedWrap: true },
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setDepth(100)
      .setVisible(false)
  }

  /** 자막 표시 */
  private showSubtitle(speaker: string, text: string, color: string, duration = 4000): void {
    // 이전 타이머 취소
    if (this.subtitleTimer) {
      this.subtitleTimer.destroy()
    }

    this.subtitleBg.setVisible(true)
    this.subtitleSpeaker.setVisible(true)
    this.subtitleText.setVisible(true)

    this.subtitleSpeaker.setText(speaker)
    this.subtitleSpeaker.setColor(color)
    this.subtitleText.setText(text)

    // 페이드인
    this.subtitleBg.setAlpha(0)
    this.subtitleSpeaker.setAlpha(0)
    this.subtitleText.setAlpha(0)

    this.tweens.add({
      targets: [this.subtitleBg, this.subtitleSpeaker, this.subtitleText],
      alpha: 1,
      duration: 200,
    })

    // 자동 숨기기
    this.subtitleTimer = this.time.delayedCall(duration, () => {
      this.hideSubtitle()
    })
  }

  /** 자막 숨기기 */
  private hideSubtitle(): void {
    this.tweens.add({
      targets: [this.subtitleBg, this.subtitleSpeaker, this.subtitleText],
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.subtitleBg.setVisible(false)
        this.subtitleSpeaker.setVisible(false)
        this.subtitleText.setVisible(false)
      },
    })
  }

  /** 기분 변화 알림 (화면 상단 중앙, 팝업) */
  private showMoodNotification(
    npcName: string,
    moodText: string,
    reason: string,
    color: string,
    refuseService: boolean,
  ): void {
    // 배경
    const bgWidth = refuseService ? 280 : 220
    const bg = this.add
      .rectangle(256, 50, bgWidth, refuseService ? 44 : 32, 0x000000, 0.85)
      .setDepth(110)
      .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 1)

    // 기분 텍스트 (NPC이름=일본어, 기분=한국어 → Noto Sans KR)
    const line1 = `${npcName} ${moodText}`
    const text1 = this.add
      .text(256, refuseService ? 40 : 50, line1, {
        fontSize: "9px",
        color,
        fontFamily: "'Noto Sans KR', sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(111)

    const elements: Phaser.GameObjects.GameObject[] = [bg, text1]

    // 서비스 거부면 추가 경고
    if (refuseService) {
      const warn = this.add
        .text(256, 56, `⚠ ${reason}`, {
          fontSize: "8px",
          color: "#ff6b6b",
          fontFamily: "'Noto Sans KR', sans-serif",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setDepth(111)
      elements.push(warn)
    }

    // 슬라이드인 + 페이드아웃
    for (const el of elements) {
      (el as Phaser.GameObjects.Components.AlphaSingle).setAlpha(0)
    }
    this.tweens.add({
      targets: elements,
      alpha: 1,
      y: "-=10",
      duration: 300,
      ease: "Back.easeOut",
    })

    // 3초 후 사라짐
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: elements,
        alpha: 0,
        y: "-=20",
        duration: 500,
        onComplete: () => {
          elements.forEach((e) => e.destroy())
        },
      })
    })

    // 화면 흔들림 (화남일 때)
    if (color === "#e94560") {
      this.cameras.main.shake(200, 0.005)
    }
  }

  /** 이벤트 리스너 등록 */
  private registerEventListeners(): void {
    // 플레이어 발화 자막
    eventBridge.on("player-speak", (text: unknown) => {
      if (typeof text === "string") {
        this.showSubtitle("あなた", text, "#60a5fa", 3000)
      }
    })

    // NPC 발화 자막
    eventBridge.on("npc-subtitle", (data: unknown) => {
      const d = data as { name: string; text: string }
      if (d?.name && d?.text) {
        this.showSubtitle(d.name, d.text, "#4ade80", 5000)
      }
    })

    // NPC 기분 변화 알림
    eventBridge.on("npc-mood-change", (data: unknown) => {
      const d = data as { npcId: string; npcName: string; mood: string; reason: string; refuseService: boolean }
      if (!d) return

      const moodLabels: Record<string, { text: string; color: string }> = {
        happy: { text: "😊 기분 좋음!", color: "#10b981" },
        neutral: { text: "😐 기분 회복", color: "#8892b0" },
        annoyed: { text: "😤 짜증남", color: "#f59e0b" },
        angry: { text: "😠 화남!", color: "#e94560" },
        sad: { text: "😢 슬픔", color: "#60a5fa" },
      }

      const info = moodLabels[d.mood] ?? moodLabels.neutral
      this.showMoodNotification(d.npcName, info.text, d.reason, info.color, d.refuseService)
    })

    // 대화 종료 시 자막 숨기기
    eventBridge.on("conversation-ended", () => {
      this.hideSubtitle()
    })
  }
}
