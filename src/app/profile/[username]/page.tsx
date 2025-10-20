import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileTabs } from '@/components/ProfileTabs';
import { mockUsers, mockPosts, mockComments } from '@/lib/mock-data';
import type { User, PostWithAuthor, CommentWithAuthor } from '@/lib/types';

/**
 * 사용자 프로필 페이지
 *
 * 기능:
 * - username 기반 동적 라우팅
 * - 프로필 헤더 (아바타, 이름, bio, reputation)
 * - 통계 카드 (게시글/댓글/평판)
 * - ProfileTabs (게시글/댓글 탭)
 */

/** username으로 사용자 찾기 */
function getUserByUsername(username: string): User | undefined {
  return mockUsers.find((u) => u.username === username);
}

/** 사용자의 모든 게시글 가져오기 */
function getUserPosts(userId: string): PostWithAuthor[] {
  return mockPosts.filter((p) => p.authorId === userId);
}

/** 사용자의 모든 댓글 가져오기 */
function getUserComments(userId: string): CommentWithAuthor[] {
  return mockComments
    .filter((c) => c.authorId === userId)
    .map((comment) => {
      // 댓글에 해당하는 포스트 찾기
      const post = mockPosts.find((p) => p.id === comment.postId);
      if (!post) {
        // 포스트가 없으면 스킵 (드물지만 방어적 처리)
        return null;
      }
      return {
        ...comment,
        post,
      };
    })
    .filter((c) => c !== null) as CommentWithAuthor[];
}


interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = getUserByUsername(username);

  // 존재하지 않는 사용자면 404
  if (!user) {
    notFound();
  }

  const userPosts = getUserPosts(user.id);
  const userComments = getUserComments(user.id);
  // Mock: 현재 로그인한 사용자 (실제로는 useSession으로 가져옴)
  const currentUsername = 'admin';

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* 프로필 헤더 */}
        <ProfileHeader user={user} currentUsername={currentUsername} />

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 게시글 수 */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{userPosts.length}</p>
              <p className="text-sm text-muted-foreground mt-1">게시글</p>
            </CardContent>
          </Card>

          {/* 댓글 수 */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{userComments.length}</p>
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

/** 정적 생성: 모든 사용자 프로필 사전 생성 */
export async function generateStaticParams() {
  return mockUsers.map((user) => ({
    username: user.username,
  }));
}
