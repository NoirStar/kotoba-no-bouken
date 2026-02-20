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
    npcMood,
    refuseService,
    activeQuests,
    history,
  } = req.body

  const questList = (activeQuests ?? [])
    .map(
      (q: { id: string; title: string; titleKo: string; clearCondition: string; difficulty: string }) =>
        `- [${q.difficulty}] ${q.title} (${q.titleKo}): ${q.clearCondition}`,
    )
    .join("\n")

  const currentMood = npcMood ?? "neutral"
  const isRefusing = refuseService ?? false

  const moodInstruction = `
【現在の気分】${currentMood}
${isRefusing ? "⚠ 現在サービス拒否中（プレイヤーに失礼なことを言われた。謝罪されるまでレジ対応・商品案内などを拒否する）" : ""}

【気分システムルール】
- プレイヤーの発言に応じて気分が変わります。
- 失礼な言葉（バカ、死ね、うるさい等）、セクハラ、暴言 → angry にして refuseService: true
- ちょっと無礼・タメ口の乱用・不快な冗談 → annoyed
- 普通の会話 → neutral のまま
- 褒め言葉、丁寧、面白い冗談 → happy
- プレイヤーが謝罪（ごめんなさい、すみません等） → neutral に戻って refuseService: false
- angry/annoyed の時はキャラクターらしく不機嫌に対応（無視、冷たい返事、あからさまに怒る等）
- refuseService: true の時は「お客様にはお売りできません」等サービスを明確に拒否
- 気分が変わった理由を reason に韓国語で簡潔に書いてください`

  const systemPrompt = `あなたは日本語学習ゲームのNPCです。

【あなたの情報】
名前: ${npcName}
役割: ${npcRole}
性格: ${npcPersonality}

【場所】${roomName}

【アクティブクエスト】
${questList || "なし"}
${moodInstruction}

【ルール】
1. 必ず日本語で自然に返答してください。キャラクターになりきってください。
2. プレイヤーの日本語レベルに合わせて話してください。
3. 気分に合わせてリアクションを変えてください。怒っている時は怒りを表現し、嬉しい時は嬉しそうに。
4. 以下のJSON形式で回答してください:

{
  "npcReply": "NPCの日本語セリフ（漢字にはふりがなを括弧で付ける。例: いらっしゃいませ！何(なに)をお探(さが)しですか？）",
  "npcReplyReading": "NPCのセリフの全文ひらがな読み",
  "translation": "한국어 번역",
  "moodChange": {
    "mood": "happy|neutral|annoyed|angry|sad",
    "reason": "기분 변화 이유 (한국어, 예: '무례한 말을 해서 화남')",
    "refuseService": false
  },
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
