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

  const sessionPromise = auth();
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  const session = await sessionPromise;

  const [voteSummary, userVoteType] = await Promise.all([
    getPostVoteSummary(postId),
    session?.user?.id
      ? getUserVoteForPost(postId, session.user.id)
      : Promise.resolve(null),
  ]);

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
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* 좌측: 투표 섹션 */}
            <VoteButtons
              upvotes={upvotes}
              downvotes={downvotes}
              orientation="vertical"
              size="lg"
              targetType="post"
              targetId={post.id}
              initialVote={initialVote}
            />

            {/* 우측: 콘텐츠 섹션 */}
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
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold flex-1">{post.title}</h1>

                {/* 수정/삭제 버튼 (작성자만 표시) */}
                {session?.user?.id === post.author.id && (
                  <div className="flex gap-2">
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
              </div>

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

                {/* 작성 시간 */}
                <time dateTime={post.createdAt.toISOString()}>
                  {post.createdAt.toLocaleDateString('ko-KR', {
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

              {/* 본문 */}
              <SafeHtml
                html={post.content}
                className="prose prose-neutral dark:prose-invert max-w-none mb-6"
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
