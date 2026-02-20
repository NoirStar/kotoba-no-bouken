import Phaser from "phaser"

/**
 * BootScene - 에셋 로딩 및 초기화
 * 프로토타입에서는 도형으로 대체 스프라이트를 생성합니다.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" })
  }

  preload(): void {
    // 로딩 바 표시
    const bar = this.add.rectangle(256, 192, 300, 20, 0x333333)
    const fill = this.add.rectangle(256, 192, 0, 16, 0xe94560)
    bar.setStrokeStyle(2, 0x555555)

    this.load.on("progress", (value: number) => {
      fill.width = 296 * value
    })

    this.load.on("complete", () => {
      bar.destroy()
      fill.destroy()
    })

    // TODO: 실제 에셋 로드
    // this.load.spritesheet("player", "assets/sprites/player.png", { ... })
    // this.load.tilemapTiledJSON("conbini-map", "assets/tilesets/conbini.json")
  }

  create(): void {
    // 프로토타입 텍스처 생성 (컬러 도형)
    this.createPlaceholderTextures()

    // 편의점 씬으로 전환
    this.scene.start("ConbiniScene")
    this.scene.start("UIScene")
  }

  private createPlaceholderTextures(): void {
    // 플레이어 - 파란색 사각형 + 얼굴
    const playerGfx = this.make.graphics({ x: 0, y: 0 })
    playerGfx.fillStyle(0x60a5fa)
    playerGfx.fillRoundedRect(4, 8, 24, 32, 4)
    // 머리
    playerGfx.fillStyle(0xfbbf24)
    playerGfx.fillCircle(16, 10, 10)
    // 눈
    playerGfx.fillStyle(0x1a1a2e)
    playerGfx.fillCircle(13, 9, 2)
    playerGfx.fillCircle(19, 9, 2)
    playerGfx.generateTexture("player-sprite", 32, 48)
    playerGfx.destroy()

    // NPC 점원 - 초록색
    const clerkGfx = this.make.graphics({ x: 0, y: 0 })
    clerkGfx.fillStyle(0x4ade80)
    clerkGfx.fillRoundedRect(4, 8, 24, 32, 4)
    clerkGfx.fillStyle(0xfbbf24)
    clerkGfx.fillCircle(16, 10, 10)
    clerkGfx.fillStyle(0x1a1a2e)
    clerkGfx.fillCircle(13, 9, 2)
    clerkGfx.fillCircle(19, 9, 2)
    // 앞치마
    clerkGfx.fillStyle(0xffffff)
    clerkGfx.fillRect(8, 22, 16, 12)
    clerkGfx.generateTexture("npc-clerk", 32, 48)
    clerkGfx.destroy()

    // NPC 손님1 - 주황색 (회사원)
    const cust1Gfx = this.make.graphics({ x: 0, y: 0 })
    cust1Gfx.fillStyle(0xfb923c)
    cust1Gfx.fillRoundedRect(4, 8, 24, 32, 4)
    cust1Gfx.fillStyle(0x8b5e3c)
    cust1Gfx.fillCircle(16, 10, 10)
    cust1Gfx.fillStyle(0x1a1a2e)
    cust1Gfx.fillCircle(13, 9, 2)
    cust1Gfx.fillCircle(19, 9, 2)
    cust1Gfx.generateTexture("npc-customer1", 32, 48)
    cust1Gfx.destroy()

    // NPC 손님2 - 분홍색 (여고생)
    const cust2Gfx = this.make.graphics({ x: 0, y: 0 })
    cust2Gfx.fillStyle(0xf472b6)
    cust2Gfx.fillRoundedRect(4, 8, 24, 32, 4)
    cust2Gfx.fillStyle(0x1a1a2e)
    cust2Gfx.fillCircle(16, 10, 10)
    // 리본
    cust2Gfx.fillStyle(0xe94560)
    cust2Gfx.fillTriangle(12, 4, 16, 0, 20, 4)
    cust2Gfx.fillStyle(0xfbbf24)
    cust2Gfx.fillCircle(13, 9, 2)
    cust2Gfx.fillCircle(19, 9, 2)
    cust2Gfx.generateTexture("npc-customer2", 32, 48)
    cust2Gfx.destroy()

    // 마이크 아이콘 (빨간색)
    const micGfx = this.make.graphics({ x: 0, y: 0 })
    micGfx.fillStyle(0xe94560)
    micGfx.fillRoundedRect(6, 0, 12, 16, 6)
    micGfx.lineStyle(2, 0xe94560)
    micGfx.strokeRoundedRect(2, 6, 20, 14, 8)
    micGfx.fillRect(11, 20, 2, 4)
    micGfx.fillRect(8, 24, 8, 2)
    micGfx.generateTexture("icon-mic", 24, 26)
    micGfx.destroy()

    // 말풍선 아이콘
    const speechGfx = this.make.graphics({ x: 0, y: 0 })
    speechGfx.fillStyle(0xffffff)
    speechGfx.fillRoundedRect(0, 0, 28, 20, 6)
    speechGfx.fillTriangle(10, 20, 14, 26, 18, 20)
    // 점 세 개
    speechGfx.fillStyle(0x333333)
    speechGfx.fillCircle(8, 10, 2)
    speechGfx.fillCircle(14, 10, 2)
    speechGfx.fillCircle(20, 10, 2)
    speechGfx.generateTexture("icon-speech", 28, 26)
    speechGfx.destroy()

    // 퀘스트 아이콘 (느낌표)
    const questGfx = this.make.graphics({ x: 0, y: 0 })
    questGfx.fillStyle(0xfbbf24)
    questGfx.fillCircle(10, 10, 10)
    questGfx.fillStyle(0x1a1a2e)
    questGfx.fillRect(8, 4, 4, 10)
    questGfx.fillRect(8, 16, 4, 3)
    questGfx.generateTexture("icon-quest", 20, 20)
    questGfx.destroy()

    // 체크 아이콘 (퀘스트 완료)
    const checkGfx = this.make.graphics({ x: 0, y: 0 })
    checkGfx.fillStyle(0x10b981)
    checkGfx.fillCircle(10, 10, 10)
    checkGfx.lineStyle(3, 0xffffff)
    checkGfx.beginPath()
    checkGfx.moveTo(5, 10)
    checkGfx.lineTo(9, 14)
    checkGfx.lineTo(16, 5)
    checkGfx.strokePath()
    checkGfx.generateTexture("icon-check", 20, 20)
    checkGfx.destroy()

    // 타일 텍스처들
    // 바닥
    const floorGfx = this.make.graphics({ x: 0, y: 0 })
    floorGfx.fillStyle(0xfff8e7)
    floorGfx.fillRect(0, 0, 32, 32)
    floorGfx.lineStyle(1, 0xe5e0d5)
    floorGfx.strokeRect(0, 0, 32, 32)
    floorGfx.generateTexture("tile-floor", 32, 32)
    floorGfx.destroy()

    // 벽
    const wallGfx = this.make.graphics({ x: 0, y: 0 })
    wallGfx.fillStyle(0x8b7d6b)
    wallGfx.fillRect(0, 0, 32, 32)
    wallGfx.lineStyle(1, 0x6b5d4b)
    wallGfx.strokeRect(0, 0, 32, 32)
    wallGfx.fillStyle(0x9b8d7b)
    wallGfx.fillRect(2, 2, 12, 12)
    wallGfx.fillRect(18, 2, 12, 12)
    wallGfx.fillRect(2, 18, 12, 12)
    wallGfx.fillRect(18, 18, 12, 12)
    wallGfx.generateTexture("tile-wall", 32, 32)
    wallGfx.destroy()

    // 선반
    const shelfGfx = this.make.graphics({ x: 0, y: 0 })
    shelfGfx.fillStyle(0xd4a574)
    shelfGfx.fillRect(0, 0, 32, 32)
    shelfGfx.lineStyle(1, 0xb08050)
    shelfGfx.strokeRect(0, 0, 32, 32)
    // 선반 라인
    shelfGfx.lineStyle(2, 0xb08050)
    shelfGfx.beginPath()
    shelfGfx.moveTo(0, 10)
    shelfGfx.lineTo(32, 10)
    shelfGfx.moveTo(0, 22)
    shelfGfx.lineTo(32, 22)
    shelfGfx.strokePath()
    // 상품 같은 컬러 블록
    shelfGfx.fillStyle(0xe94560)
    shelfGfx.fillRect(3, 3, 6, 6)
    shelfGfx.fillStyle(0x60a5fa)
    shelfGfx.fillRect(12, 3, 6, 6)
    shelfGfx.fillStyle(0x4ade80)
    shelfGfx.fillRect(23, 3, 6, 6)
    shelfGfx.fillStyle(0xfbbf24)
    shelfGfx.fillRect(3, 13, 6, 6)
    shelfGfx.fillStyle(0xf472b6)
    shelfGfx.fillRect(12, 13, 6, 6)
    shelfGfx.generateTexture("tile-shelf", 32, 32)
    shelfGfx.destroy()

    // 카운터
    const counterGfx = this.make.graphics({ x: 0, y: 0 })
    counterGfx.fillStyle(0x4a4a6a)
    counterGfx.fillRect(0, 0, 32, 32)
    counterGfx.fillStyle(0x5a5a7a)
    counterGfx.fillRect(2, 2, 28, 10)
    // 레지스터
    counterGfx.fillStyle(0x2a2a4a)
    counterGfx.fillRect(8, 14, 16, 12)
    counterGfx.fillStyle(0x60a5fa)
    counterGfx.fillRect(10, 16, 12, 6)
    counterGfx.generateTexture("tile-counter", 32, 32)
    counterGfx.destroy()

    // 문
    const doorGfx = this.make.graphics({ x: 0, y: 0 })
    doorGfx.fillStyle(0x87ceeb)
    doorGfx.fillRect(0, 0, 32, 32)
    doorGfx.lineStyle(2, 0x4a90b0)
    doorGfx.strokeRect(0, 0, 32, 32)
    doorGfx.beginPath()
    doorGfx.moveTo(16, 0)
    doorGfx.lineTo(16, 32)
    doorGfx.strokePath()
    doorGfx.generateTexture("tile-door", 32, 32)
    doorGfx.destroy()
  }
}
