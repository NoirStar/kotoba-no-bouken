import { create } from "zustand"
import type { DialogMessage } from "@/types/room"

interface DialogStore {
  /** 현재 대화 기록 */
  messages: DialogMessage[]
  /** 현재 대화 중인 NPC ID */
  activeNpcId: string | null
  /** 플레이어가 현재 녹음(말하기) 중인지 */
  isRecording: boolean
  /** 현재 인식 중인 텍스트 (STT 중간 결과) */
  interimText: string
  /** NPC 응답 로딩 중 */
  isNpcThinking: boolean
  /** 마지막 피드백 */
  lastFeedback: {
    isNatural: boolean
    corrections?: string[]
    betterExpression?: string
    newVocab?: { word: string; reading: string; meaning: string }[]
  } | null

  // Actions
  startConversation: (npcId: string) => void
  endConversation: () => void
  addMessage: (msg: DialogMessage) => void
  setRecording: (recording: boolean) => void
  setInterimText: (text: string) => void
  setNpcThinking: (thinking: boolean) => void
  setLastFeedback: (feedback: DialogStore["lastFeedback"]) => void
  clearMessages: () => void
}

export const useDialogStore = create<DialogStore>((set) => ({
  messages: [],
  activeNpcId: null,
  isRecording: false,
  interimText: "",
  isNpcThinking: false,
  lastFeedback: null,

  startConversation: (npcId) =>
    set({ activeNpcId: npcId, messages: [], lastFeedback: null }),

  endConversation: () =>
    set({
      activeNpcId: null,
      isRecording: false,
      interimText: "",
      isNpcThinking: false,
    }),

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  setRecording: (recording) => set({ isRecording: recording }),
  setInterimText: (text) => set({ interimText: text }),
  setNpcThinking: (thinking) => set({ isNpcThinking: thinking }),
  setLastFeedback: (feedback) => set({ lastFeedback: feedback }),
  clearMessages: () => set({ messages: [] }),
}))
