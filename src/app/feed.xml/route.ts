import { getRecentPosts } from '@/lib/data-access';

/**
 * RSS 2.0 피드 생성
 *
 * AI 검색 엔진 및 RSS 리더를 위한 콘텐츠 피드
 * GET /feed.xml
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flow-coder.com';

  let posts: Awaited<ReturnType<typeof getRecentPosts>> = [];
  try {
    posts = await getRecentPosts(50);
  } catch (error) {
    console.error('[RSS] 게시글 조회 실패:', error);
  }

  const escapeXml = (str: string): string =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const stripHtml = (html: string): string =>
    html.replace(/<[^>]*>/g, '').trim();

  const items = posts
    .map((post) => {
      const postUrl = `${baseUrl}/community/${post.category.slug}/${post.id}`;
      const plainText = stripHtml(post.content);
      const description =
        plainText.length > 300 ? plainText.substring(0, 300) + '...' : plainText;
      const pubDate =
        typeof post.createdAt === 'string'
          ? new Date(post.createdAt).toUTCString()
          : post.createdAt.toUTCString();
      const authorName = post.author.displayName || post.author.username || 'FlowCoder';

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(authorName)}</author>
      <category>${escapeXml(post.category.name)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FlowCoder - AI와 함께하는 바이브 코딩 커뮤니티</title>
    <link>${baseUrl}</link>
    <description>AI 도구를 활용한 바이브 코딩 커뮤니티. 팁, 쇼케이스, 자유게시판의 최신 글을 확인하세요.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/FlowCoder.png</url>
      <title>FlowCoder</title>
      <link>${baseUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
