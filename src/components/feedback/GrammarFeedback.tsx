import { cn } from "@/lib/utils"
import { useDialogStore } from "@/stores/dialogStore"
import { X, BookOpen, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react"

/**
 * GrammarFeedback - 문법 피드백 표시
 * AI가 제공한 문법/어휘 피드백을 카드 형태로 보여줍니다.
 */
export function GrammarFeedback() {
  const { lastFeedback, setLastFeedback } = useDialogStore()

  if (!lastFeedback) return null

  return (
    <div className="px-4 py-2 border-t border-border">
      <div className="relative bg-card/80 rounded-lg border border-border p-3">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setLastFeedback(null)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>

        {/* 자연스러움 평가 */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "text-xs font-pixel px-2 py-0.5 rounded",
              lastFeedback.isNatural
                ? "bg-success/20 text-success"
                : "bg-pixel-yellow/20 text-pixel-yellow",
            )}
          >
            <span className="inline-flex items-center gap-1">{lastFeedback.isNatural ? <><CheckCircle2 size={12} /> 자연스러워요!</> : <><Lightbulb size={12} /> 이렇게 해보세요</>}</span>
          </span>
        </div>

        {/* 교정 */}
        {lastFeedback.corrections && lastFeedback.corrections.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">수정 제안:</p>
            {lastFeedback.corrections.map((c, i) => (
              <p key={i} className="text-xs text-pixel-yellow flex items-center gap-1">
                <ArrowRight size={10} /> {c}
              </p>
            ))}
          </div>
        )}

        {/* 더 나은 표현 */}
        {lastFeedback.betterExpression && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">
              더 자연스러운 표현:
            </p>
            <p className="text-xs text-accent font-pixel">
              {lastFeedback.betterExpression}
            </p>
          </div>
        )}

        {/* 새 어휘 */}
        {lastFeedback.newVocab && lastFeedback.newVocab.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <BookOpen size={10} /> 새로운 단어:
            </p>
            <div className="flex flex-wrap gap-1">
              {lastFeedback.newVocab.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] bg-accent/10 border border-accent/20 rounded px-2 py-0.5"
                >
                  <span className="font-pixel text-accent">{v.word}</span>
                  <span className="text-muted-foreground">({v.reading})</span>
                  <span className="text-foreground">{v.meaning}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
