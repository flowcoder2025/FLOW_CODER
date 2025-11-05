import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileTabs } from '@/components/ProfileTabs';
import {
  getUserByUsername,
  getPostsByUser,
  getCommentsByUser,
} from '@/lib/data-access';
import type { PostWithAuthor, CommentWithAuthor } from '@/lib/types';

/**
 * 사용자 프로필 페이지 (Server Component)
 *
 * 기능:
 * - username 기반 동적 라우팅
 * - 프로필 헤더 (아바타, 이름, bio, reputation)
 * - 통계 카드 (게시글/댓글/평판)
 * - ProfileTabs (게시글/댓글 탭)
 */


interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // DB에서 사용자 조회
  const user = await getUserByUsername(username);

  // 존재하지 않는 사용자면 404
  if (!user) {
    notFound();
  }

  // DB에서 사용자 게시글 및 댓글 조회
  const dbPosts = await getPostsByUser(user.id);
  const dbComments = await getCommentsByUser(user.id);

  // Mock: 현재 로그인한 사용자 (실제로는 getServerSession으로 가져옴)
  const currentUsername = 'admin';

  // PostWithAuthor 타입으로 변환
  const userPosts: PostWithAuthor[] = dbPosts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    categoryId: post.categoryId,
    postType: post.postType,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    viewCount: post.viewCount,
    isPinned: post.isPinned,
    isLocked: post.isLocked,
    tags: post.tags,
    coverImageUrl: post.coverImageUrl || undefined,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: user.id,
      username: user.username || '',
      displayName: user.displayName || undefined,
      avatarUrl: user.image || undefined,
      reputation: user.reputation,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
      icon: post.category.icon || undefined,
      color: post.category.color || undefined,
    },
    commentCount: post._count.comments,
  }));

  // CommentWithAuthor 타입으로 변환
  const userComments: CommentWithAuthor[] = dbComments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    authorId: comment.authorId,
    postId: comment.postId,
    parentId: comment.parentId || undefined,
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    author: {
      id: user.id,
      username: user.username || '',
      displayName: user.displayName || undefined,
      avatarUrl: user.image || undefined,
      reputation: user.reputation,
    },
    post: {
      id: comment.post.id,
      title: comment.post.title,
      content: '',
      authorId: user.id,
      categoryId: '',
      postType: 'DISCUSSION' as const,
      upvotes: 0,
      downvotes: 0,
      viewCount: 0,
      isPinned: false,
      isLocked: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: user.id,
        username: user.username || '',
        displayName: user.displayName || undefined,
        avatarUrl: user.image || undefined,
        reputation: user.reputation,
      },
      category: {
        id: '',
        name: comment.post.category.slug,
        slug: comment.post.category.slug,
      },
      commentCount: 0,
    },
  }));

  // User 타입으로 변환
  const userForHeader = {
    id: user.id,
    username: user.username || '',
    email: '', // ProfileHeader에서는 email이 표시되지 않음
    displayName: user.displayName || undefined,
    bio: user.bio || undefined,
    avatarUrl: user.image || undefined,
    reputation: user.reputation,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.createdAt.toISOString(), // DB에서 updatedAt이 없으므로 createdAt 사용
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* 프로필 헤더 */}
        <ProfileHeader user={userForHeader} currentUsername={currentUsername} />

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 게시글 수 */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{user._count.posts}</p>
              <p className="text-sm text-muted-foreground mt-1">게시글</p>
            </CardContent>
          </Card>

          {/* 댓글 수 */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{user._count.comments}</p>
              <p className="text-sm text-muted-foreground mt-1">댓글</p>
            </CardContent>
          </Card>

          {/* 평판 */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{user.reputation}</p>
              <p className="text-sm text-muted-foreground mt-1">평판</p>
            </CardContent>
          </Card>
        </div>

        {/* 게시글/댓글 탭 */}
        <ProfileTabs userPosts={userPosts} userComments={userComments} />
      </div>
    </div>
  );
}
