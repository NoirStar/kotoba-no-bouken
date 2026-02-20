import Phaser from "phaser"

/**
 * BootScene - 에셋 로딩 및 초기화
 * 캔버스 기반 픽셀아트 텍스처를 생성합니다.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" })
  }

  preload(): void {
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
  }

  create(): void {
    this.createCharacterTextures()
    this.createTileTextures()
    this.createIconTextures()

    this.scene.start("ConbiniScene")
    this.scene.start("UIScene")
  }

  // ─── 캐릭터 텍스처 ───────────────────────────────────

  private createCharacterTextures(): void {
    this.createPlayerSprite()
    this.createClerkSprite()
    this.createCustomer1Sprite()
    this.createCustomer2Sprite()
  }

  /** 플레이어 - 귀여운 치비 캐릭터 (파란 후드) */
  private createPlayerSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 })
    // 그림자
    g.fillStyle(0x000000, 0.15)
    g.fillEllipse(16, 46, 18, 6)
    // 몸통 (파란 후드)
    g.fillStyle(0x4a90d9)
    g.fillRoundedRect(7, 20, 18, 20, 3)
    // 후드 줄
    g.lineStyle(1, 0x3a70b9)
    g.beginPath(); g.moveTo(16, 22); g.lineTo(16, 34); g.strokePath()
    // 후드 포켓
    g.fillStyle(0x3a70b9)
    g.fillRoundedRect(10, 30, 12, 6, 2)
    // 다리
    g.fillStyle(0x3d3d5c)
    g.fillRect(10, 38, 5, 8)
    g.fillRect(17, 38, 5, 8)
    // 신발
    g.fillStyle(0xe94560)
    g.fillRoundedRect(9, 44, 6, 3, 1)
    g.fillRoundedRect(17, 44, 6, 3, 1)
    // 머리 (둥글게)
    g.fillStyle(0xfdd9b5)
    g.fillCircle(16, 14, 11)
    // 머리카락 (갈색)
    g.fillStyle(0x6b4226)
    g.fillEllipse(16, 8, 22, 12)
    g.fillRect(6, 8, 4, 8)
    g.fillRect(22, 8, 4, 8)
    // 앞머리
    g.fillStyle(0x7b5236)
    g.fillRect(8, 6, 16, 5)
    // 눈 (큰 애니메이션 눈)
    g.fillStyle(0xffffff)
    g.fillCircle(12, 14, 4)
    g.fillCircle(20, 14, 4)
    g.fillStyle(0x2d2d4e)
    g.fillCircle(13, 14, 2.5)
    g.fillCircle(21, 14, 2.5)
    // 눈 하이라이트
    g.fillStyle(0xffffff)
    g.fillCircle(14, 13, 1)
    g.fillCircle(22, 13, 1)
    // 입 (미소)
    g.lineStyle(1, 0xd4836b)
    g.beginPath()
    g.arc(16, 17, 3, 0.2, Math.PI - 0.2, false)
    g.strokePath()
    // 볼 홍조
    g.fillStyle(0xffb3b3, 0.4)
    g.fillCircle(8, 16, 3)
    g.fillCircle(24, 16, 3)
    // 팔
    g.fillStyle(0x4a90d9)
    g.fillRoundedRect(3, 22, 5, 14, 2)
    g.fillRoundedRect(24, 22, 5, 14, 2)
    // 손
    g.fillStyle(0xfdd9b5)
    g.fillCircle(5, 36, 3)
    g.fillCircle(27, 36, 3)

    g.generateTexture("player-sprite", 32, 48)
    g.destroy()
  }

  /** NPC 점원 - 초록 앞치마 유니폼 */
  private createClerkSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 })
    // 그림자
    g.fillStyle(0x000000, 0.15)
    g.fillEllipse(16, 46, 18, 6)
    // 몸통 (흰색 셔츠)
    g.fillStyle(0xf0f0f0)
    g.fillRoundedRect(7, 20, 18, 20, 3)
    // 앞치마 (초록)
    g.fillStyle(0x2ecc71)
    g.fillRoundedRect(8, 24, 16, 14, 2)
    // 앞치마 포켓
    g.fillStyle(0x27ae60)
    g.fillRoundedRect(11, 28, 10, 6, 1)
    // 앞치마 끈
    g.lineStyle(1, 0x27ae60)
    g.beginPath(); g.moveTo(8, 24); g.lineTo(5, 22); g.strokePath()
    g.beginPath(); g.moveTo(24, 24); g.lineTo(27, 22); g.strokePath()
    // 다리
    g.fillStyle(0x2c3e50)
    g.fillRect(10, 38, 5, 8)
    g.fillRect(17, 38, 5, 8)
    // 신발
    g.fillStyle(0x1a1a2e)
    g.fillRoundedRect(9, 44, 6, 3, 1)
    g.fillRoundedRect(17, 44, 6, 3, 1)
    // 머리
    g.fillStyle(0xfdd9b5)
    g.fillCircle(16, 14, 11)
    // 머리카락 (검정, 단정하게)
    g.fillStyle(0x1a1a2e)
    g.fillEllipse(16, 7, 20, 10)
    g.fillRect(7, 7, 3, 6)
    g.fillRect(22, 7, 3, 6)
    // 모자 (편의점 캡)
    g.fillStyle(0x2ecc71)
    g.fillRoundedRect(6, 2, 20, 8, 3)
    g.fillStyle(0x27ae60)
    g.fillRect(5, 8, 22, 3)
    // 모자 로고
    g.fillStyle(0xffffff)
    g.fillRect(14, 4, 4, 4)
    // 눈
    g.fillStyle(0xffffff)
    g.fillCircle(12, 14, 3.5)
    g.fillCircle(20, 14, 3.5)
    g.fillStyle(0x2d2d4e)
    g.fillCircle(13, 14, 2)
    g.fillCircle(21, 14, 2)
    g.fillStyle(0xffffff)
    g.fillCircle(14, 13, 0.8)
    g.fillCircle(22, 13, 0.8)
    // 미소
    g.lineStyle(1, 0xd4836b)
    g.beginPath()
    g.arc(16, 16, 3, 0.3, Math.PI - 0.3, false)
    g.strokePath()
    // 팔
    g.fillStyle(0xf0f0f0)
    g.fillRoundedRect(3, 22, 5, 14, 2)
    g.fillRoundedRect(24, 22, 5, 14, 2)
    // 손
    g.fillStyle(0xfdd9b5)
    g.fillCircle(5, 36, 3)
    g.fillCircle(27, 36, 3)

    g.generateTexture("npc-clerk", 32, 48)
    g.destroy()
  }

  /** NPC 손님1 - 회사원 (남성, 넥타이) */
  private createCustomer1Sprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 })
    // 그림자
    g.fillStyle(0x000000, 0.15)
    g.fillEllipse(16, 46, 18, 6)
    // 몸통 (감색 정장)
    g.fillStyle(0x34495e)
    g.fillRoundedRect(7, 20, 18, 20, 3)
    // 셔츠 칼라
    g.fillStyle(0xf0f0f0)
    g.fillTriangle(12, 20, 16, 24, 20, 20)
    // 넥타이
    g.fillStyle(0xc0392b)
    g.fillTriangle(14, 22, 16, 36, 18, 22)
    // 다리
    g.fillStyle(0x2c3e50)
    g.fillRect(10, 38, 5, 8)
    g.fillRect(17, 38, 5, 8)
    // 신발
    g.fillStyle(0x1a1a2e)
    g.fillRoundedRect(9, 44, 6, 3, 1)
    g.fillRoundedRect(17, 44, 6, 3, 1)
    // 머리
    g.fillStyle(0xf5cba7)
    g.fillCircle(16, 14, 11)
    // 머리카락 (짧은 검정)
    g.fillStyle(0x2c3e50)
    g.fillEllipse(16, 7, 20, 10)
    g.fillRect(7, 7, 2, 4)
    g.fillRect(23, 7, 2, 4)
    // 안경
    g.lineStyle(1, 0x555555)
    g.strokeCircle(12, 14, 3.5)
    g.strokeCircle(20, 14, 3.5)
    g.beginPath(); g.moveTo(15.5, 14); g.lineTo(16.5, 14); g.strokePath()
    // 눈
    g.fillStyle(0x2d2d4e)
    g.fillCircle(12, 14, 2)
    g.fillCircle(20, 14, 2)
    g.fillStyle(0xffffff)
    g.fillCircle(13, 13, 0.8)
    g.fillCircle(21, 13, 0.8)
    // 입
    g.lineStyle(1, 0xc9956b)
    g.beginPath(); g.moveTo(14, 18); g.lineTo(18, 18); g.strokePath()
    // 팔
    g.fillStyle(0x34495e)
    g.fillRoundedRect(3, 22, 5, 14, 2)
    g.fillRoundedRect(24, 22, 5, 14, 2)
    // 손 (서류가방)
    g.fillStyle(0xf5cba7)
    g.fillCircle(5, 36, 3)
    g.fillStyle(0x8b6914)
    g.fillRoundedRect(0, 34, 8, 10, 2)
    g.fillStyle(0xa37b1c)
    g.fillRect(2, 38, 4, 1)

    g.generateTexture("npc-customer1", 32, 48)
    g.destroy()
  }

  /** NPC 손님2 - 여고생 (세라복 + 리본) */
  private createCustomer2Sprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 })
    // 그림자
    g.fillStyle(0x000000, 0.15)
    g.fillEllipse(16, 46, 18, 6)
    // 몸통 (네이비 세라복)
    g.fillStyle(0x2c3e6e)
    g.fillRoundedRect(7, 20, 18, 16, 3)
    // 세라복 칼라
    g.fillStyle(0xf0f0f0)
    g.fillTriangle(7, 20, 16, 26, 25, 20)
    g.lineStyle(1, 0x2c3e6e)
    g.beginPath(); g.moveTo(9, 21); g.lineTo(16, 25); g.lineTo(23, 21); g.strokePath()
    // 리본 (빨강)
    g.fillStyle(0xe94560)
    g.fillTriangle(13, 22, 16, 20, 19, 22)
    g.fillTriangle(13, 22, 16, 25, 19, 22)
    // 스커트
    g.fillStyle(0x2c3e6e)
    g.fillTriangle(7, 34, 16, 34, 7, 42)
    g.fillTriangle(25, 34, 16, 34, 25, 42)
    g.fillRect(7, 34, 18, 8)
    // 스커트 주름
    g.lineStyle(0.5, 0x1a2a5e)
    for (let i = 9; i < 24; i += 3) {
      g.beginPath(); g.moveTo(i, 34); g.lineTo(i, 42); g.strokePath()
    }
    // 다리(양말)
    g.fillStyle(0xf0f0f0)
    g.fillRect(10, 40, 4, 6)
    g.fillRect(18, 40, 4, 6)
    // 신발 (로퍼)
    g.fillStyle(0x8b4513)
    g.fillRoundedRect(9, 44, 6, 3, 1)
    g.fillRoundedRect(17, 44, 6, 3, 1)
    // 머리 (긴 머리)
    g.fillStyle(0xfdd9b5)
    g.fillCircle(16, 14, 11)
    g.fillStyle(0x4a2815)
    g.fillEllipse(16, 7, 22, 12)
    // 긴 머리 옆
    g.fillRect(5, 7, 4, 18)
    g.fillRect(23, 7, 4, 18)
    // 앞머리
    g.fillStyle(0x5a3825)
    g.fillRect(7, 5, 18, 6)
    // 앞머리 가르마
    g.lineStyle(0.5, 0x3a1810)
    g.beginPath(); g.moveTo(16, 4); g.lineTo(16, 10); g.strokePath()
    // 헤어핀 (핑크) - 사각형으로 대체
    g.fillStyle(0xff69b4)
    g.fillRect(6, 6, 4, 4)
    // 눈 (큰 반짝이는 눈)
    g.fillStyle(0xffffff)
    g.fillCircle(12, 14, 4)
    g.fillCircle(20, 14, 4)
    g.fillStyle(0x6b3fa0)
    g.fillCircle(13, 14, 2.5)
    g.fillCircle(21, 14, 2.5)
    g.fillStyle(0xffffff)
    g.fillCircle(14, 13, 1.2)
    g.fillCircle(22, 13, 1.2)
    g.fillCircle(12, 15, 0.5)
    g.fillCircle(20, 15, 0.5)
    // 속눈썹
    g.lineStyle(0.8, 0x2d2d4e)
    g.beginPath(); g.moveTo(9, 12); g.lineTo(8, 11); g.strokePath()
    g.beginPath(); g.moveTo(23, 12); g.lineTo(24, 11); g.strokePath()
    // 입 (^^)
    g.lineStyle(1, 0xe88b8b)
    g.beginPath()
    g.arc(16, 17, 2.5, 0.3, Math.PI - 0.3, false)
    g.strokePath()
    // 볼 홍조
    g.fillStyle(0xffb3b3, 0.5)
    g.fillCircle(8, 17, 3)
    g.fillCircle(24, 17, 3)
    // 팔
    g.fillStyle(0x2c3e6e)
    g.fillRoundedRect(3, 22, 5, 12, 2)
    g.fillRoundedRect(24, 22, 5, 12, 2)
    g.fillStyle(0xfdd9b5)
    g.fillCircle(5, 34, 3)
    g.fillCircle(27, 34, 3)

    g.generateTexture("npc-customer2", 32, 48)
    g.destroy()
  }

  // ─── 타일 텍스처 ───────────────────────────────────

  private createTileTextures(): void {
    // 바닥 (체크 패턴)
    const floorGfx = this.make.graphics({ x: 0, y: 0 })
    floorGfx.fillStyle(0xfff5e6)
    floorGfx.fillRect(0, 0, 32, 32)
    floorGfx.fillStyle(0xffe8cc)
    floorGfx.fillRect(0, 0, 16, 16)
    floorGfx.fillRect(16, 16, 16, 16)
    floorGfx.lineStyle(0.5, 0xddd0c0, 0.3)
    floorGfx.strokeRect(0, 0, 16, 16)
    floorGfx.strokeRect(16, 0, 16, 16)
    floorGfx.strokeRect(0, 16, 16, 16)
    floorGfx.strokeRect(16, 16, 16, 16)
    floorGfx.generateTexture("tile-floor", 32, 32)
    floorGfx.destroy()

    // 벽 (타일 벽돌 패턴)
    const wallGfx = this.make.graphics({ x: 0, y: 0 })
    wallGfx.fillStyle(0x7a6b5e)
    wallGfx.fillRect(0, 0, 32, 32)
    wallGfx.fillStyle(0x8b7d70)
    wallGfx.fillRect(1, 1, 14, 7)
    wallGfx.fillRect(17, 1, 14, 7)
    wallGfx.fillRect(1, 17, 14, 7)
    wallGfx.fillRect(17, 17, 14, 7)
    wallGfx.fillRect(8, 9, 14, 7)
    wallGfx.fillRect(24, 9, 7, 7)
    wallGfx.fillRect(1, 9, 5, 7)
    wallGfx.fillRect(8, 25, 14, 7)
    wallGfx.fillRect(24, 25, 7, 7)
    wallGfx.fillRect(1, 25, 5, 7)
    wallGfx.lineStyle(0.5, 0x9a8d80, 0.5)
    wallGfx.strokeRect(1, 1, 14, 7)
    wallGfx.strokeRect(17, 1, 14, 7)
    wallGfx.generateTexture("tile-wall", 32, 32)
    wallGfx.destroy()

    // 선반 (상품이 보이는 진열대)
    const shelfGfx = this.make.graphics({ x: 0, y: 0 })
    shelfGfx.fillStyle(0xc4a67a)
    shelfGfx.fillRect(0, 0, 32, 32)
    shelfGfx.fillStyle(0xd4b88a)
    shelfGfx.fillRect(1, 1, 30, 30)
    shelfGfx.fillStyle(0xb89060)
    shelfGfx.fillRect(0, 10, 32, 2)
    shelfGfx.fillRect(0, 22, 32, 2)
    shelfGfx.fillStyle(0xe74c3c); shelfGfx.fillRoundedRect(3, 2, 5, 7, 1)
    shelfGfx.fillStyle(0x3498db); shelfGfx.fillRoundedRect(10, 2, 5, 7, 1)
    shelfGfx.fillStyle(0x2ecc71); shelfGfx.fillRoundedRect(17, 2, 5, 7, 1)
    shelfGfx.fillStyle(0xf39c12); shelfGfx.fillRoundedRect(24, 2, 5, 7, 1)
    shelfGfx.fillStyle(0x9b59b6); shelfGfx.fillRoundedRect(3, 13, 5, 7, 1)
    shelfGfx.fillStyle(0xe67e22); shelfGfx.fillRoundedRect(10, 13, 5, 7, 1)
    shelfGfx.fillStyle(0x1abc9c); shelfGfx.fillRoundedRect(17, 13, 5, 7, 1)
    shelfGfx.fillStyle(0xe74c3c); shelfGfx.fillRoundedRect(24, 13, 5, 7, 1)
    shelfGfx.fillStyle(0x3498db); shelfGfx.fillRoundedRect(3, 24, 5, 6, 1)
    shelfGfx.fillStyle(0xf1c40f); shelfGfx.fillRoundedRect(10, 24, 5, 6, 1)
    shelfGfx.fillStyle(0xe74c3c); shelfGfx.fillRoundedRect(17, 24, 5, 6, 1)
    shelfGfx.fillStyle(0x2ecc71); shelfGfx.fillRoundedRect(24, 24, 5, 6, 1)
    shelfGfx.generateTexture("tile-shelf", 32, 32)
    shelfGfx.destroy()

    // 카운터
    const counterGfx = this.make.graphics({ x: 0, y: 0 })
    counterGfx.fillStyle(0x5a5a7a)
    counterGfx.fillRect(0, 0, 32, 32)
    counterGfx.fillStyle(0x6a6a8a)
    counterGfx.fillRect(1, 1, 30, 12)
    counterGfx.fillStyle(0x2a2a4a)
    counterGfx.fillRoundedRect(6, 14, 20, 14, 2)
    counterGfx.fillStyle(0x60a5fa)
    counterGfx.fillRoundedRect(9, 16, 14, 6, 1)
    counterGfx.fillStyle(0xffffff)
    counterGfx.fillRect(11, 18, 2, 2)
    counterGfx.fillRect(15, 18, 2, 2)
    counterGfx.fillRect(19, 18, 2, 2)
    counterGfx.fillStyle(0x888888)
    for (let bx = 10; bx < 24; bx += 4) {
      counterGfx.fillRect(bx, 24, 3, 2)
    }
    counterGfx.generateTexture("tile-counter", 32, 32)
    counterGfx.destroy()

    // 문 (자동문)
    const doorGfx = this.make.graphics({ x: 0, y: 0 })
    doorGfx.fillStyle(0xa8d8ea)
    doorGfx.fillRect(0, 0, 32, 32)
    doorGfx.fillStyle(0xc8e8fa, 0.5)
    doorGfx.fillTriangle(0, 0, 16, 0, 0, 32)
    doorGfx.lineStyle(2, 0x7ab5cc)
    doorGfx.strokeRect(0, 0, 32, 32)
    doorGfx.lineStyle(2, 0x6a9db5)
    doorGfx.beginPath(); doorGfx.moveTo(16, 0); doorGfx.lineTo(16, 32); doorGfx.strokePath()
    doorGfx.lineStyle(1, 0xffffff, 0.6)
    doorGfx.beginPath(); doorGfx.moveTo(8, 16); doorGfx.lineTo(4, 16); doorGfx.strokePath()
    doorGfx.beginPath(); doorGfx.moveTo(24, 16); doorGfx.lineTo(28, 16); doorGfx.strokePath()
    doorGfx.generateTexture("tile-door", 32, 32)
    doorGfx.destroy()
  }

  // ─── 아이콘 텍스처 ───────────────────────────────────

  private createIconTextures(): void {
    // 마이크 아이콘
    const micGfx = this.make.graphics({ x: 0, y: 0 })
    micGfx.fillStyle(0xe94560)
    micGfx.fillRoundedRect(8, 0, 8, 14, 4)
    micGfx.lineStyle(2, 0xe94560)
    micGfx.beginPath()
    micGfx.arc(12, 10, 8, Math.PI, 0, false)
    micGfx.strokePath()
    micGfx.fillRect(11, 18, 2, 4)
    micGfx.fillRect(8, 22, 8, 2)
    micGfx.generateTexture("icon-mic", 24, 24)
    micGfx.destroy()

    // 말풍선 아이콘
    const speechGfx = this.make.graphics({ x: 0, y: 0 })
    speechGfx.fillStyle(0xffffff)
    speechGfx.fillRoundedRect(0, 0, 24, 16, 5)
    speechGfx.fillTriangle(8, 16, 12, 22, 16, 16)
    speechGfx.fillStyle(0x333333)
    speechGfx.fillCircle(6, 8, 1.5)
    speechGfx.fillCircle(12, 8, 1.5)
    speechGfx.fillCircle(18, 8, 1.5)
    speechGfx.generateTexture("icon-speech", 24, 22)
    speechGfx.destroy()

    // 느낌표 아이콘
    const questGfx = this.make.graphics({ x: 0, y: 0 })
    questGfx.fillStyle(0xfbbf24)
    questGfx.fillCircle(10, 10, 10)
    questGfx.fillStyle(0x1a1a2e)
    questGfx.fillRoundedRect(8, 3, 4, 10, 1)
    questGfx.fillCircle(10, 16, 2)
    questGfx.generateTexture("icon-quest", 20, 20)
    questGfx.destroy()

    // 체크 아이콘
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

    // Z키 아이콘 (말걸기)
    const zGfx = this.make.graphics({ x: 0, y: 0 })
    zGfx.fillStyle(0xfbbf24)
    zGfx.fillRoundedRect(0, 0, 20, 16, 3)
    zGfx.lineStyle(2, 0x1a1a2e)
    zGfx.beginPath()
    zGfx.moveTo(6, 4); zGfx.lineTo(14, 4)
    zGfx.lineTo(6, 12); zGfx.lineTo(14, 12)
    zGfx.strokePath()
    zGfx.generateTexture("icon-z-key", 20, 16)
    zGfx.destroy()

    // 기분 아이콘들
    this.createMoodIcons()
  }

  /** NPC 기분 아이콘 텍스처 생성 */
  private createMoodIcons(): void {
    // 😊 Happy - 녹색 웃는 얼굴
    const happyGfx = this.make.graphics({ x: 0, y: 0 })
    happyGfx.fillStyle(0x10b981)
    happyGfx.fillCircle(10, 10, 10)
    happyGfx.fillStyle(0x1a1a2e)
    happyGfx.fillCircle(7, 8, 1.5)
    happyGfx.fillCircle(13, 8, 1.5)
    happyGfx.lineStyle(1.5, 0x1a1a2e)
    happyGfx.beginPath()
    happyGfx.arc(10, 11, 4, 0.3, Math.PI - 0.3, false)
    happyGfx.strokePath()
    happyGfx.generateTexture("icon-mood-happy", 20, 20)
    happyGfx.destroy()

    // 😠 Angry - 빨간 화난 얼굴
    const angryGfx = this.make.graphics({ x: 0, y: 0 })
    angryGfx.fillStyle(0xe94560)
    angryGfx.fillCircle(10, 10, 10)
    angryGfx.fillStyle(0x1a1a2e)
    // 찡그린 눈
    angryGfx.lineStyle(2, 0x1a1a2e)
    angryGfx.beginPath(); angryGfx.moveTo(4, 6); angryGfx.lineTo(8, 9); angryGfx.strokePath()
    angryGfx.beginPath(); angryGfx.moveTo(16, 6); angryGfx.lineTo(12, 9); angryGfx.strokePath()
    angryGfx.fillCircle(7, 9, 1.5)
    angryGfx.fillCircle(13, 9, 1.5)
    // 화난 입
    angryGfx.lineStyle(1.5, 0x1a1a2e)
    angryGfx.beginPath()
    angryGfx.arc(10, 16, 3, Math.PI + 0.3, -0.3, false)
    angryGfx.strokePath()
    // 분노 마크 (💢)
    angryGfx.lineStyle(1.5, 0xffffff)
    angryGfx.beginPath()
    angryGfx.moveTo(16, 1); angryGfx.lineTo(18, 3)
    angryGfx.moveTo(18, 1); angryGfx.lineTo(16, 3)
    angryGfx.strokePath()
    angryGfx.generateTexture("icon-mood-angry", 20, 20)
    angryGfx.destroy()

    // 😤 Annoyed - 오렌지 짜증 얼굴
    const annoyedGfx = this.make.graphics({ x: 0, y: 0 })
    annoyedGfx.fillStyle(0xf59e0b)
    annoyedGfx.fillCircle(10, 10, 10)
    annoyedGfx.fillStyle(0x1a1a2e)
    // 반감 눈
    annoyedGfx.lineStyle(1.5, 0x1a1a2e)
    annoyedGfx.beginPath(); annoyedGfx.moveTo(5, 7); annoyedGfx.lineTo(9, 8); annoyedGfx.strokePath()
    annoyedGfx.beginPath(); annoyedGfx.moveTo(15, 7); annoyedGfx.lineTo(11, 8); annoyedGfx.strokePath()
    annoyedGfx.fillCircle(7, 9, 1.2)
    annoyedGfx.fillCircle(13, 9, 1.2)
    // 일자 입
    annoyedGfx.beginPath(); annoyedGfx.moveTo(7, 14); annoyedGfx.lineTo(13, 14); annoyedGfx.strokePath()
    // 땀방울
    annoyedGfx.fillStyle(0x60a5fa)
    annoyedGfx.fillTriangle(17, 2, 18, 6, 19, 2)
    annoyedGfx.generateTexture("icon-mood-annoyed", 20, 20)
    annoyedGfx.destroy()

    // 😢 Sad - 파란 슬픈 얼굴
    const sadGfx = this.make.graphics({ x: 0, y: 0 })
    sadGfx.fillStyle(0x60a5fa)
    sadGfx.fillCircle(10, 10, 10)
    sadGfx.fillStyle(0x1a1a2e)
    sadGfx.fillCircle(7, 8, 1.5)
    sadGfx.fillCircle(13, 8, 1.5)
    // 슬픈 입
    sadGfx.lineStyle(1.5, 0x1a1a2e)
    sadGfx.beginPath()
    sadGfx.arc(10, 16, 3, Math.PI + 0.3, -0.3, false)
    sadGfx.strokePath()
    // 눈물
    sadGfx.fillStyle(0xbfdbfe)
    sadGfx.fillTriangle(14, 10, 15, 14, 16, 10)
    sadGfx.generateTexture("icon-mood-sad", 20, 20)
    sadGfx.destroy()
  }
}
