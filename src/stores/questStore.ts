import { create } from "zustand"
import type { QuestStatus, QuestDifficulty } from "@/types/room"

interface QuestProgress {
  questId: string
  status: QuestStatus
  completedAt?: number
}

interface QuestStore {
  /** 퀘스트 진행 상태 (questId → progress) */
  progress: Record<string, QuestProgress>
  /** 현재 선택/활성화된 퀘스트 ID */
  activeQuestId: string | null
  /** 보고 있는 난이도 탭 */
  selectedDifficulty: QuestDifficulty

  // Actions
  initRoom: (questIds: string[]) => void
  activateQuest: (questId: string) => void
  completeQuest: (questId: string) => void
  setDifficulty: (diff: QuestDifficulty) => void
  isRoomCleared: (questIds: string[]) => boolean
  getCompletedCount: () => number
  reset: () => void
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  progress: {},
  activeQuestId: null,
  selectedDifficulty: "easy",

  initRoom: (questIds: string[]) => {
    const progress: Record<string, QuestProgress> = {}
    for (const id of questIds) {
      progress[id] = { questId: id, status: "active" }
    }
    set({ progress, activeQuestId: null, selectedDifficulty: "easy" })
  },

  activateQuest: (questId) => set({ activeQuestId: questId }),

  completeQuest: (questId) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [questId]: {
          questId,
          status: "completed" as QuestStatus,
          completedAt: Date.now(),
        },
      },
    })),

  setDifficulty: (diff) => set({ selectedDifficulty: diff }),

  isRoomCleared: (questIds: string[]) => {
    const { progress } = get()
    return questIds.every((id) => progress[id]?.status === "completed")
  },

  getCompletedCount: () => {
    const { progress } = get()
    return Object.values(progress).filter((p) => p.status === "completed").length
  },

  reset: () =>
    set({ progress: {}, activeQuestId: null, selectedDifficulty: "easy" }),
}))
