import { create } from "zustand"
import type { GameState, GameSettings, InputMode } from "@/types/game"
import type { QuestDifficulty } from "@/types/room"

interface GameStore {
  /** 현재 게임 상태 */
  state: GameState
  /** 현재 Room ID */
  currentRoomId: string | null
  /** 현재 선택된 난이도 */
  currentDifficulty: QuestDifficulty | null
  /** 설정 */
  settings: GameSettings
  /** 클리어한 Room 목록 */
  clearedRooms: string[]
  /** 클리어한 난이도 (roomId-difficulty 형태) */
  clearedDifficulties: string[]

  // Actions
  setState: (state: GameState) => void
  selectRoom: (roomId: string) => void
  enterRoom: (roomId: string) => void
  startWithDifficulty: (difficulty: QuestDifficulty) => void
  clearDifficulty: (roomId: string, difficulty: QuestDifficulty) => void
  clearRoom: (roomId: string) => void
  isDifficultyUnlocked: (roomId: string, difficulty: QuestDifficulty) => boolean
  isDifficultyCleared: (roomId: string, difficulty: QuestDifficulty) => boolean
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

const DIFFICULTY_ORDER: QuestDifficulty[] = ["easy", "normal", "hard", "hell"]

export const useGameStore = create<GameStore>((set, get) => ({
  state: "title",
  currentRoomId: null,
  currentDifficulty: null,
  settings: defaultSettings,
  clearedRooms: [],
  clearedDifficulties: [],

  setState: (state) => set({ state }),

  selectRoom: (roomId) =>
    set({ state: "difficulty-select", currentRoomId: roomId }),

  enterRoom: (roomId) =>
    set({ state: "playing", currentRoomId: roomId }),

  startWithDifficulty: (difficulty) =>
    set({ state: "playing", currentDifficulty: difficulty }),

  clearDifficulty: (roomId, difficulty) =>
    set((s) => {
      const key = `${roomId}-${difficulty}`
      return {
        clearedDifficulties: s.clearedDifficulties.includes(key)
          ? s.clearedDifficulties
          : [...s.clearedDifficulties, key],
      }
    }),

  clearRoom: (roomId) =>
    set((s) => ({
      state: "room-clear",
      clearedRooms: s.clearedRooms.includes(roomId)
        ? s.clearedRooms
        : [...s.clearedRooms, roomId],
    })),

  isDifficultyUnlocked: (roomId, difficulty) => {
    const { clearedDifficulties } = get()
    const idx = DIFFICULTY_ORDER.indexOf(difficulty)
    if (idx === 0) return true // EASY는 항상 열림
    const prevDiff = DIFFICULTY_ORDER[idx - 1]
    return clearedDifficulties.includes(`${roomId}-${prevDiff}`)
  },

  isDifficultyCleared: (roomId, difficulty) => {
    const { clearedDifficulties } = get()
    return clearedDifficulties.includes(`${roomId}-${difficulty}`)
  },

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
      currentDifficulty: null,
      clearedRooms: [],
      clearedDifficulties: [],
      settings: defaultSettings,
    }),
}))
