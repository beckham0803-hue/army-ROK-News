import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type NaverItem = {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

const MEDIA_PATTERNS: { name: string; test: RegExp }[] = [
  { name: "연합뉴스", test: /yna\.co\.kr|yonhap/i },
  { name: "KBS", test: /kbs\.co\.kr/i },
  { name: "MBC", test: /imbc\.com|mbc\./i },
  { name: "SBS", test: /sbs\.co\.kr/i },
  { name: "조선일보", test: /chosun\.com/i },
  { name: "동아일보", test: /donga\.com/i },
  { name: "중앙일보", test: /joongang|joins\.com/i },
  { name: "YTN", test: /ytn\.co\.kr/i },
  { name: "국방일보", test: /dema\.mil\.kr|kookbang/i },
  { name: "한겨레", test: /hani\.co\.kr/i },
  { name: "경향신문", test: /khan\.co\.kr/i },
  { name: "뉴시스", test: /newsis\.com/i },
]

const ALERT_WORDS = [
  "논란",
  "의혹",
  "사고",
  "사망",
  "비리",
  "부실",
  "갑질",
  "폭행",
  "징계",
  "은폐",
  "규탄",
  "반발",
  "우려",
  "위기",
  "실패",
]
const POSITIVE_WORDS = [
  "성공",
  "성과",
  "강화",
  "발전",
  "혁신",
  "승진",
  "표창",
  "복지",
  "지원",
  "협력",
  "우수",
  "최초",
  "완료",
  "달성",
  "선도",
  "명예",
]

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .trim()
}

function detectMedia(link: string): string {
  const hit = MEDIA_PATTERNS.find((m) => m.test.test(link))
  return hit ? hit.name : "기타 언론"
}

function analyzeSentiment(text: string): "positive" | "neutral" | "alert" {
  const alertHits = ALERT_WORDS.filter((w) => text.includes(w)).length
  const posHits = POSITIVE_WORDS.filter((w) => text.includes(w)).length
  if (alertHits > posHits && alertHits > 0) return "alert"
  if (posHits > 0) return "positive"
  return "neutral"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get("query") || "육군").trim()
  const display = Math.min(Number(searchParams.get("display") || 40) || 40, 100)
  const sort = searchParams.get("sort") === "sim" ? "sim" : "date"

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "NAVER_API_KEYS_MISSING",
        message:
          "네이버 API 키가 설정되지 않았습니다. NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수를 확인해주세요.",
      },
      { status: 500 },
    )
  }

  const endpoint = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
    query,
  )}&display=${display}&sort=${sort}`

  try {
    const res = await fetch(endpoint, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const detail = await res.text()
      return NextResponse.json(
        {
          error: "NAVER_API_ERROR",
          status: res.status,
          message: `네이버 API 요청 실패 (HTTP ${res.status})`,
          detail: detail.slice(0, 400),
        },
        { status: 502 },
      )
    }

    const data = (await res.json()) as { items?: NaverItem[] }
    const items = data.items || []

    const articles = items.map((item, index) => {
      const title = stripHtml(item.title)
      const description = stripHtml(item.description)
      const link = item.originallink || item.link || ""
      return {
        id: `naver_${sort}_${index}_${Date.parse(item.pubDate) || index}`,
        title,
        description,
        pubDate: item.pubDate,
        link,
        media: detectMedia(link),
        keyword: query,
        sentiment: analyzeSentiment(`${title} ${description}`),
      }
    })

    return NextResponse.json({
      query,
      total: articles.length,
      fetchedAt: new Date().toISOString(),
      articles,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "FETCH_FAILED",
        message: "네이버 API 연결 중 오류가 발생했습니다.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
