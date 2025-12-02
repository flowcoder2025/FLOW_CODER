import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/data-access';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';

/**
 * 프로필 기본 페이지 (Server Component)
 *
 * 기능:
 * - 로그인 상태: 현재 사용자의 프로필 페이지로 리다이렉트
 * - 비로그인 상태: 로그인 안내 메시지 표시
 */
export default async function ProfilePage() {
  const session = await auth();

  // 로그인된 경우: 현재 사용자의 프로필로 리다이렉트
  if (session?.user?.id) {
    const user = await getUserById(session.user.id);

    if (user?.username) {
      redirect(`/profile/${user.username}`);
    }
  }

  // 비로그인 상태: 로그인 안내
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>프로필 페이지</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              프로필을 확인하려면 로그인이 필요합니다.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/signin">로그인</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
