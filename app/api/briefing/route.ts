import { generateText } from "ai"

export const maxDuration = 30

type BriefArticle = {
  title: string
  description?: string
  media?: string
  sentiment?: string
}

export async function POST(request: Request) {
  let body: { query?: string; articles?: BriefArticle[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "잘못된 요청 형식입니다." }, { status: 400 })
  }

  const query = body.query?.trim() || "육군"
  const articles = (body.articles || []).slice(0, 25)

  if (articles.length === 0) {
    return Response.json(
      { error: "분석할 기사가 없습니다. 먼저 뉴스를 수집해주세요." },
      { status: 400 },
    )
  }

  const dossier = articles
    .map(
      (a, i) =>
        `${i + 1}. [${a.media || "미상"} / ${a.sentiment || "neutral"}] ${a.title}${
          a.description ? ` — ${a.description}` : ""
        }`,
    )
    .join("\n")

  const system = `당신은 대한민국 육군 공보정훈 분야의 베테랑 언론 분석 참모입니다.
지휘관에게 보고하는 간결하고 전문적인 군사 브리핑 문체(개조식)를 사용합니다.
과장 없이 사실에 근거하며, 여론의 위험 신호와 대응 방향을 명확히 제시합니다.
반드시 한국어로 작성합니다.`

  const prompt = `아래는 '${query}' 관련 실시간 수집 언론 기사 목록입니다.

${dossier}

위 기사들을 종합 분석하여 지휘관 보고용 브리핑을 아래 형식(마크다운)으로 작성하십시오:

## 핵심 요약
- (3줄 이내로 전체 언론 동향의 핵심)

## 여론 흐름 분석
- (긍정/중립/부정 기류와 주요 논점)

## 위험 신호 (Alert)
- (부정적/논란 소지가 있는 사안, 없으면 "특이사항 없음")

## 대응 권고
- (공보 및 여론 대응 방향 제언)`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system,
      prompt,
      temperature: 0.4,
    })

    return Response.json({ briefing: text, generatedAt: new Date().toISOString() })
  } catch (err) {
    return Response.json(
      {
        error: "AI 분석 생성에 실패했습니다.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
