'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPostById, getCommentsByPostId } from '@/lib/mock-data';
import type { CommentWithAuthor } from '@/lib/types';

/**
 * 게시글 상세 페이지
 *
 * 동적 라우트: /community/[category]/[postId]
 * Next.js 15: params는 Promise이므로 use() 훅으로 unwrap
 */

interface PostDetailPageProps {
  params: Promise<{
    category: string;
    postId: string;
  }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { category: categorySlug, postId } = use(params);

  // 게시글 조회
  const post = getPostById(postId);

  if (!post) {
    notFound();
  }

  // 댓글 조회 및 계층 구조 생성
  const allComments = getCommentsByPostId(postId);
  const topLevelComments = allComments.filter((c) => !c.parentId);

  // 대댓글 찾기 헬퍼
  const getReplies = (parentId: string): CommentWithAuthor[] => {
    return allComments.filter((c) => c.parentId === parentId);
  };

  const score = post.upvotes - post.downvotes;

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
            <div className="flex flex-col items-center gap-2 min-w-[50px]">
              <button
                className="p-2 rounded hover:bg-accent transition-colors"
                aria-label="추천"
                type="button"
              >
                <ArrowUp className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </button>
              <span
                className={`text-2xl font-bold ${
                  score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : ''
                }`}
              >
                {score}
              </span>
              <button
                className="p-2 rounded hover:bg-accent transition-colors"
                aria-label="비추천"
                type="button"
              >
                <ArrowDown className="h-6 w-6 text-muted-foreground hover:text-destructive" />
              </button>
            </div>

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
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

              {/* 작성자 & 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 pb-6 border-b">
                {/* 작성자 */}
                <Link
                  href={`/profile/${post.author.username}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.displayName || post.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {post.author.displayName || post.author.username}
                    </span>
                    {post.author.reputation > 100 && (
                      <span className="text-xs">평판 {post.author.reputation}</span>
                    )}
                  </div>
                </Link>

                <span className="text-muted-foreground/50">•</span>

                {/* 작성 시간 */}
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
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
                  <span>{post.commentCount}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap text-base leading-relaxed">{post.content}</p>
              </div>

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
      <div>
        <h2 className="text-2xl font-bold mb-4">
          댓글 {post.commentCount}개
        </h2>

        {allComments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} getReplies={getReplies} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 댓글 스레드 컴포넌트 (재귀)
 */
interface CommentThreadProps {
  comment: CommentWithAuthor;
  getReplies: (parentId: string) => CommentWithAuthor[];
  depth?: number;
}

function CommentThread({ comment, getReplies, depth = 0 }: CommentThreadProps) {
  const replies = getReplies(comment.id);
  const score = comment.upvotes - comment.downvotes;
  const maxDepth = 5; // 최대 중첩 깊이

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : ''}>
      <Card className={depth > 0 ? 'border-l-4 border-l-muted' : ''}>
        <CardContent className="p-4">
          {/* 작성자 & 메타 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/profile/${comment.author.username}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={comment.author.avatarUrl}
                alt={comment.author.displayName || comment.author.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-sm">
                {comment.author.displayName || comment.author.username}
              </span>
              {comment.author.reputation > 100 && (
                <span className="text-xs text-muted-foreground">({comment.author.reputation})</span>
              )}
            </Link>

            <span className="text-muted-foreground/50 text-sm">•</span>

            <time className="text-sm text-muted-foreground" dateTime={comment.createdAt}>
              {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* 댓글 내용 */}
          <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>

          {/* 투표 & 답글 버튼 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ArrowUp className="h-3 w-3" />
              </Button>
              <span className={`text-sm font-medium ${score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : ''}`}>
                {score}
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="h-7 text-xs">
              답글
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 대댓글 (재귀) */}
      {replies.length > 0 && depth < maxDepth && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} getReplies={getReplies} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
