import { create } from "zustand"
import type { GameState, GameSettings, InputMode } from "@/types/game"

interface GameStore {
  /** 현재 게임 상태 */
  state: GameState
  /** 현재 Room ID */
  currentRoomId: string | null
  /** 설정 */
  settings: GameSettings
  /** 클리어한 Room 목록 */
  clearedRooms: string[]

  // Actions
  setState: (state: GameState) => void
  enterRoom: (roomId: string) => void
  clearRoom: (roomId: string) => void
  setInputMode: (mode: InputMode) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  resetGame: () => void
}

const defaultSettings: GameSettings = {
  inputMode: "voice",
  volume: 80,
  ttsEnabled: true,
  showTranslation: true,
  showFurigana: true,
}

export const useGameStore = create<GameStore>((set) => ({
  state: "title",
  currentRoomId: null,
  settings: defaultSettings,
  clearedRooms: [],

  setState: (state) => set({ state }),

  enterRoom: (roomId) =>
    set({ state: "playing", currentRoomId: roomId }),

  clearRoom: (roomId) =>
    set((s) => ({
      state: "room-clear",
      clearedRooms: s.clearedRooms.includes(roomId)
        ? s.clearedRooms
        : [...s.clearedRooms, roomId],
    })),

  setInputMode: (mode) =>
    set((s) => ({
      settings: { ...s.settings, inputMode: mode },
    })),

  updateSettings: (partial) =>
    set((s) => ({
      settings: { ...s.settings, ...partial },
    })),

  resetGame: () =>
    set({
      state: "title",
      currentRoomId: null,
      clearedRooms: [],
      settings: defaultSettings,
    }),
}))
