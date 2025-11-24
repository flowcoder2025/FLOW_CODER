import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/placeholder/[width]/[height]
 * 동적 크기의 플레이스홀더 이미지 생성 (SVG)
 *
 * @param width - 이미지 너비 (px)
 * @param height - 이미지 높이 (px)
 *
 * 예시:
 * - /api/placeholder/200/200 → 200x200 정사각형
 * - /api/placeholder/400/300 → 400x300 직사각형
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  const { width, height } = await params;

  // 파라미터 유효성 검사
  const w = parseInt(width);
  const h = parseInt(height);

  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || w > 2000 || h > 2000) {
    return new NextResponse('Invalid dimensions', { status: 400 });
  }

  // SVG 플레이스홀더 생성
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${Math.min(w, h) / 8}"
        fill="#9ca3af"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${w}×${h}
      </text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable', // 1년 캐싱
    },
  });
}
