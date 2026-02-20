import { create } from "zustand"
import type { NPCMood } from "@/types/room"

interface NPCMoodState {
  mood: NPCMood
  /** 서비스 거부 중인지 (무례한 유저에게 계산 안 해주기 등) */
  refuseService: boolean
}

interface MoodStore {
  /** NPC별 기분 상태 */
  moods: Record<string, NPCMoodState>

  /** NPC 기분 가져오기 (기본값: neutral) */
  getMood: (npcId: string) => NPCMoodState

  /** NPC 기분 업데이트 */
  setMood: (npcId: string, mood: NPCMood, refuseService?: boolean) => void

  /** 모든 NPC 기분 리셋 (방 나갈 때) */
  resetAll: () => void
}

export const useMoodStore = create<MoodStore>((set, get) => ({
  moods: {},

  getMood: (npcId: string) => {
    return get().moods[npcId] ?? { mood: "neutral", refuseService: false }
  },

  setMood: (npcId, mood, refuseService = false) =>
    set((s) => ({
      moods: {
        ...s.moods,
        [npcId]: { mood, refuseService },
      },
    })),

  resetAll: () => set({ moods: {} }),
}))
