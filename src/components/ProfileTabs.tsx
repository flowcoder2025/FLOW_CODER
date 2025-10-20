'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { PostCard } from '@/components/PostCard';
import type { PostWithAuthor, CommentWithAuthor } from '@/lib/types';

/**
 * 프로필 탭 컴포넌트
 *
 * 기능:
 * - 게시글/댓글 탭 전환
 * - 게시글 목록 (PostCard 재사용)
 * - 댓글 목록 (게시글 링크 포함)
 */

export interface ProfileTabsProps {
  userPosts: PostWithAuthor[];
  userComments: CommentWithAuthor[];
}

export function ProfileTabs({ userPosts, userComments }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">
          게시글 ({userPosts.length})
        </TabsTrigger>
        <TabsTrigger value="comments">
          댓글 ({userComments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              아직 작성한 게시글이 없습니다.
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="comments" className="mt-6">
        {userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  {/* 게시글 링크 */}
                  {comment.post && (
                    <Link
                      href={`/${comment.post.postType.toLowerCase()}/${comment.post.id}`}
                      className="block mb-3 text-sm font-medium hover:text-primary transition-colors"
                    >
                      📝 {comment.post.title}
                    </Link>
                  )}

                  {/* 댓글 본문 */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {comment.content}
                  </p>

                  {/* 메타 정보 */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              아직 작성한 댓글이 없습니다.
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
