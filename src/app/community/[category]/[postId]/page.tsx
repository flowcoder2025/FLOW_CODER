import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Eye, ChevronRight, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentList } from '@/components/CommentList';
import { VoteButtons } from '@/components/VoteButtons';
import { DeletePostButton } from '@/components/DeletePostButton';
import { SafeHtml } from '@/components/SafeHtml';
import {
  getPostById,
  getPostVoteSummary,
  getUserVoteForPost,
} from '@/lib/data-access/posts';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';

// ISR: 60초마다 재검증
export const revalidate = 60;

/**
 * HTML 태그를 제거하고 텍스트만 추출
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * HTML 콘텐츠에서 첫 번째 이미지 URL 추출
 */
function extractFirstImageUrl(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

/**
 * 동적 메타데이터 생성
 * 각 게시글의 제목, 내용, 썸네일을 OG 태그에 반영
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; postId: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, postId } = await params;

  // news 카테고리는 별도 페이지에서 처리
  if (categorySlug === 'news') {
    return {
      title: '게시글을 찾을 수 없습니다',
    };
  }

  const post = await getPostById(postId);

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다',
      description: '요청하신 게시글이 존재하지 않습니다.',
    };
  }

  // 본문에서 description 생성 (HTML 제거 후 160자 제한)
  const plainText = stripHtml(post.content);
  const description = plainText.length > 160
    ? plainText.substring(0, 160) + '...'
    : plainText;

  // OG 이미지 우선순위: coverImageUrl > 본문 첫 이미지 > 기본 이미지
  const ogImage = post.coverImageUrl
    || extractFirstImageUrl(post.content)
    || '/og-image.jpg';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flow-coder.com';
  const postUrl = `${baseUrl}/community/${categorySlug}/${postId}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: 'FlowCoder',
      type: 'article',
      locale: 'ko_KR',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: typeof post.createdAt === 'string'
        ? post.createdAt
        : post.createdAt.toISOString(),
      modifiedTime: typeof post.updatedAt === 'string'
        ? post.updatedAt
        : post.updatedAt.toISOString(),
      authors: [post.author.displayName || post.author.username || 'FlowCoder'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

/**
 * 게시글 상세 페이지
 *
 * 동적 라우트: /community/[category]/[postId]
 * Next.js 15: params는 Promise이므로 await로 unwrap
 */

interface PostDetailPageProps {
  params: Promise<{
    category: string;
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { category: categorySlug, postId } = await params;

  // news 카테고리는 /news/[id] 페이지에서 처리 (중복 방지)
  if (categorySlug === 'news') {
    notFound();
  }

  // 모든 데이터를 병렬로 가져오기 (성능 최적화)
  const [post, session, voteSummary] = await Promise.all([
    getPostById(postId),
    auth(),
    getPostVoteSummary(postId),
  ]);

  if (!post) {
    notFound();
  }

  // 사용자 투표 상태는 세션에 의존하므로 별도 처리
  const userVoteType = session?.user?.id
    ? await getUserVoteForPost(postId, session.user.id)
    : null;

  // getPostById가 이미 댓글을 포함하므로 별도 조회 불필요
  const allComments = post.comments || [];
  const { upvotes, downvotes } = voteSummary;
  const initialVote =
    userVoteType === 'UP' ? 'up' : userVoteType === 'DOWN' ? 'down' : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          홈
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/community" className="hover:text-foreground transition-colors">
          커뮤니티
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/community/${categorySlug}`}
          className="hover:text-foreground transition-colors"
        >
          {post.category.icon} {post.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      {/* 게시글 카드 */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            {/* 좌측: 투표 섹션 (데스크톱만 표시) */}
            <div className="hidden md:block">
              <VoteButtons
                upvotes={upvotes}
                downvotes={downvotes}
                orientation="vertical"
                size="lg"
                targetType="post"
                targetId={post.id}
                initialVote={initialVote}
              />
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 카테고리 & 고정 배지 */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {post.category.icon} {post.category.name}
                </Badge>
                {post.isPinned && (
                  <Badge variant="secondary" className="text-xs">
                    📌 고정
                  </Badge>
                )}
                {post.isLocked && (
                  <Badge variant="secondary" className="text-xs">
                    🔒 잠김
                  </Badge>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-xl md:text-3xl font-bold mb-3">{post.title}</h1>

              {/* 수정/삭제 버튼 (작성자만 표시) - 제목 아래 배치 */}
              {session?.user?.id === post.author.id && (
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/community/${categorySlug}/${postId}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Link>
                  </Button>
                  <DeletePostButton
                    postId={postId}
                    postTitle={post.title}
                    categorySlug={categorySlug}
                  />
                </div>
              )}

              {/* 작성자 & 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 pb-6 border-b">
                {/* 작성자 */}
                <Link
                  href={`/profile/${post.author.username || 'unknown'}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Image
                    src={post.author.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={post.author.displayName || post.author.username || 'Unknown'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {post.author.displayName || post.author.username || 'Unknown'}
                    </span>
                    {post.author.reputation > 100 && (
                      <span className="text-xs">평판 {post.author.reputation}</span>
                    )}
                  </div>
                </Link>

                <span className="text-muted-foreground/50">•</span>

                {/* 작성 시간 - unstable_cache로 인해 Date가 문자열로 직렬화될 수 있음 */}
                <time dateTime={typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toISOString()}>
                  {(typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>

                <span className="text-muted-foreground/50">•</span>

                {/* 조회수 */}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount}</span>
                </div>

                <span className="text-muted-foreground/50">•</span>

                {/* 댓글 수 */}
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post._count.comments}</span>
                </div>
              </div>

              {/* 커버 이미지 */}
              {post.coverImageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              )}

              {/* 본문 */}
              <SafeHtml
                html={post.content}
                className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-6
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:my-4 prose-ul:pl-6 prose-li:my-1
                  prose-ol:my-4 prose-ol:pl-6
                  prose-img:rounded-lg prose-img:my-6
                  prose-figure:my-6
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-table:border-collapse prose-th:border prose-th:p-2 prose-td:border prose-td:p-2"
                skipFirstImage={!!post.coverImageUrl}
              />

              {/* 태그 */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs hover:bg-secondary/80 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 모바일: 투표 버튼 (하단에 가로 배치) */}
              <div className="md:hidden mt-6 pt-4 border-t">
                <VoteButtons
                  upvotes={upvotes}
                  downvotes={downvotes}
                  orientation="horizontal"
                  size="sm"
                  targetType="post"
                  targetId={post.id}
                  initialVote={initialVote}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CommentList comments={allComments as any} commentCount={post._count.comments} />
    </div>
  );
}
