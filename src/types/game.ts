// ─── 게임 전체 타입 ─────────────────────────────────

/** 게임 상태 */
export type GameState = "title" | "room-select" | "playing" | "room-clear" | "game-clear"

/** 방향 */
export type Direction = "up" | "down" | "left" | "right"

/** 입력 모드 */
export type InputMode = "voice" | "text"

/** 캐릭터 위에 뜨는 상태 아이콘 */
export type CharacterIcon = "mic" | "speech" | "quest" | "quest-complete" | "none"

/** 플레이어 위치 */
export interface Position {
  x: number
  y: number
}

/** 게임 설정 */
export interface GameSettings {
  inputMode: InputMode
  volume: number
  ttsEnabled: boolean
  showTranslation: boolean
  showFurigana: boolean
}
