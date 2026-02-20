/**
 * React ↔ Phaser 이벤트 브릿지
 * 양쪽 간의 통신을 위한 이벤트 시스템
 */

type EventCallback = (...args: unknown[]) => void

class EventBridge {
  private listeners: Map<string, Set<EventCallback>> = new Map()

  /** 이벤트 리스너 등록 */
  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  /** 이벤트 리스너 제거 */
  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback)
  }

  /** 이벤트 발행 */
  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((cb) => cb(...args))
  }

  /** 모든 리스너 제거 */
  clear(): void {
    this.listeners.clear()
  }
}

/**
 * 싱글톤 이벤트 브릿지
 *
 * 이벤트 목록:
 * - "player-near-npc"   (npcId: string, distance: number)  Phaser → React
 * - "player-left-npc"   (npcId: string)                    Phaser → React
 * - "npc-speak"         (npcId: string, text: string)      React → Phaser
 * - "player-speak"      (text: string)                     React → Phaser
 * - "recording-start"   ()                                 React → Phaser
 * - "recording-stop"    ()                                 React → Phaser
 * - "quest-complete"    (questId: string)                  React → Phaser
 * - "room-clear"        ()                                 React → Phaser
 */
export const eventBridge = new EventBridge()
