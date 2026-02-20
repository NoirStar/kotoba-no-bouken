// ─── Room / Quest / NPC 타입 ─────────────────────────

/** 퀘스트 난이도 */
export type QuestDifficulty = "easy" | "normal" | "hard" | "hell"

/** 퀘스트 상태 */
export type QuestStatus = "locked" | "active" | "completed"

/** Room 상태 */
export type RoomStatus = "locked" | "available" | "cleared"

/** NPC 정의 */
export interface NPCDef {
  id: string
  name: string             // 일본어 이름 (ex: "田中さん")
  nameReading: string      // 읽기 (ex: "たなかさん")
  role: string             // 역할 (ex: "점원", "손님")
  personality: string      // 성격 설명 (AI system prompt용)
  spriteKey: string        // 스프라이트 키
  position: { x: number; y: number }  // 타일 좌표
  direction: "up" | "down" | "left" | "right"
}

/** 퀘스트 정의 */
export interface QuestDef {
  id: string
  roomId: string
  title: string            // 일본어 퀘스트명
  titleKo: string          // 한국어 설명
  description: string      // 상세 설명
  difficulty: QuestDifficulty
  targetNpcId: string      // 대화 대상 NPC
  /** 퀘스트 클리어 조건 키워드/의도. AI가 판정에 참고 */
  clearCondition: string
  /** 힌트 표현 */
  hints: string[]
  /** 학습 포인트 */
  grammarPoint?: string
  /** 보상 어휘 */
  rewardVocab?: { word: string; reading: string; meaning: string }[]
  /** 순서 (같은 난이도 내 정렬) */
  order: number
}

/** Room 정의 */
export interface RoomDef {
  id: string
  name: string             // 일본어 방 이름
  nameKo: string           // 한국어
  icon: string             // 이모지
  description: string
  tileMapKey: string       // Phaser 타일맵 키
  npcs: NPCDef[]
  quests: QuestDef[]
  /** 방 배경색 (프로토타입) */
  bgColor: number
  /** 방 크기 (타일 단위) */
  width: number
  height: number
}

/** AI NPC 응답 */
export interface NPCResponse {
  npcReply: string
  npcReplyReading: string
  translation: string
  questProgress: {
    questId: string | null
    completed: boolean
    hint?: string
  }
  feedback: {
    isNatural: boolean
    corrections?: string[]
    betterExpression?: string
    newVocab?: { word: string; reading: string; meaning: string }[]
  }
}

/** 대화 메시지 */
export interface DialogMessage {
  id: string
  speaker: "player" | string  // "player" 또는 NPC id
  speakerName: string
  text: string
  translation?: string
  timestamp: number
}
