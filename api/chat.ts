/**
 * Vercel Serverless Function: AI NPC 대화
 * POST /api/chat
 */

import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" })
  }

  const {
    playerMessage,
    npcName,
    npcRole,
    npcPersonality,
    roomName,
    activeQuests,
    history,
  } = req.body

  const questList = (activeQuests ?? [])
    .map(
      (q: { id: string; title: string; titleKo: string; clearCondition: string; difficulty: string }) =>
        `- [${q.difficulty}] ${q.title} (${q.titleKo}): ${q.clearCondition}`,
    )
    .join("\n")

  const systemPrompt = `あなたは日本語学習ゲームのNPCです。

【あなたの情報】
名前: ${npcName}
役割: ${npcRole}
性格: ${npcPersonality}

【場所】${roomName}

【アクティブクエスト】
${questList || "なし"}

【ルール】
1. 必ず日本語で自然に返答してください。キャラクターになりきってください。
2. プレイヤーの日本語レベルに合わせて話してください。
3. 以下のJSON形式で回答してください:

{
  "npcReply": "NPCの日本語セリフ",
  "npcReplyReading": "ふりがな付き読み",
  "translation": "한국어 번역",
  "questProgress": {
    "questId": "完了したクエストID or null",
    "completed": true/false,
    "hint": "次のヒント（任意）"
  },
  "feedback": {
    "isNatural": true/false,
    "corrections": ["修正候補（あれば）"],
    "betterExpression": "より自然な表現（あれば）",
    "newVocab": [{"word": "単語", "reading": "よみ", "meaning": "의미"}]
  }
}

プレイヤーの発言がクエストの達成条件を満たしたら、questProgress.completedをtrueにして、対応するquestIdを入れてください。
文法的に正しくなくても、意図が伝わればクエストは達成できます。
フィードバックでは、より自然な表現を提案してください。`

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...(history ?? []),
    { role: "user" as const, content: playerMessage },
  ]

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(500).json({ error: `OpenAI error: ${error}` })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(500).json({ error: "Empty response from OpenAI" })
    }

    const parsed = JSON.parse(content)
    return res.status(200).json(parsed)
  } catch (error) {
    console.error("Chat API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
