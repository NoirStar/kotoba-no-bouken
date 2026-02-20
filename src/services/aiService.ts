import type { NPCDef, QuestDef, NPCResponse, DialogMessage, NPCMood } from "@/types/room"

/**
 * AI NPC 대화 서비스
 * OpenAI API를 통해 NPC가 자연스럽게 대화합니다.
 */

interface ChatRequest {
  playerMessage: string
  npc: NPCDef
  roomName: string
  activeQuests: QuestDef[]
  conversationHistory: DialogMessage[]
  /** 현재 NPC 기분 */
  npcMood?: NPCMood
  /** 서비스 거부 중인지 */
  refuseService?: boolean
}

/**
 * AI NPC에게 플레이어의 메시지를 보내고 응답을 받습니다.
 */
export async function sendToNPC(req: ChatRequest): Promise<NPCResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerMessage: req.playerMessage,
      npcId: req.npc.id,
      npcName: req.npc.name,
      npcRole: req.npc.role,
      npcPersonality: req.npc.personality,
      roomName: req.roomName,
      npcMood: req.npcMood ?? "neutral",
      refuseService: req.refuseService ?? false,
      activeQuests: req.activeQuests.map((q) => ({
        id: q.id,
        title: q.title,
        titleKo: q.titleKo,
        clearCondition: q.clearCondition,
        difficulty: q.difficulty,
      })),
      history: req.conversationHistory.slice(-10).map((m) => ({
        role: m.speaker === "player" ? "user" : "assistant",
        content: m.text,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`)
  }

  return response.json()
}

/**
 * 퀘스트 완료 판정 결과에 따라 완료된 퀘스트 ID를 반환합니다.
 */
export function checkQuestCompletion(aiResponse: NPCResponse): string | null {
  if (aiResponse.questProgress.completed && aiResponse.questProgress.questId) {
    return aiResponse.questProgress.questId
  }
  return null
}
