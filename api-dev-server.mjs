/**
 * 로컬 개발용 API 서버.
 * Vercel serverless function (api/chat.ts) 대신 로컬에서 동일 로직 실행.
 *
 * 사용: node api-dev-server.mjs
 * → http://localhost:3001 에서 /api/chat 처리
 */
import http from "http"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, ".env.local") })

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found. Set it in .env.local")
  process.exit(1)
}

// ── 핸들러: /api/chat ────────────────────────────────
async function handleChat(body) {
  const {
    playerMessage,
    npcName,
    npcRole,
    npcPersonality,
    roomName,
    activeQuests,
    history,
  } = body

  const questList = (activeQuests ?? [])
    .map((q) => `- [${q.difficulty}] ${q.title} (${q.titleKo}): ${q.clearCondition}`)
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
    { role: "system", content: systemPrompt },
    ...(history ?? []),
    { role: "user", content: playerMessage },
  ]

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
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
    throw new Error(`OpenAI API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty response from OpenAI")

  return JSON.parse(content)
}

// ── HTTP 서버 ────────────────────────────────────────
const PORT = 3001

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Method not allowed" }))
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  let body = ""
  req.on("data", (chunk) => (body += chunk))
  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body)

      let result
      if (url.pathname === "/api/chat") {
        result = await handleChat(parsed)
      } else {
        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Not found" }))
        return
      }

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(result))
    } catch (err) {
      console.error("❌ Error:", err.message)
      res.writeHead(500, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: err.message }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`\n🎮 ことばの冒険 API server running`)
  console.log(`   http://localhost:${PORT}/api/chat`)
  console.log(`   Press Ctrl+C to stop\n`)
})
