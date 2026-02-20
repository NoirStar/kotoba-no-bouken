import Phaser from "phaser"

/**
 * UIScene - 게임 내 UI 오버레이
 * 대사창, 아이콘 등 게임 위에 표시되는 UI를 관리합니다.
 * (대부분의 복잡한 UI는 React 쪽에서 처리하므로, 여기서는 최소한만)
 */
export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" })
  }

  create(): void {
    // UIScene은 ConbiniScene 위에 오버레이로 실행
    // React UI와 중복하지 않도록 최소한의 인게임 표시만 처리
  }
}
