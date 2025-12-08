import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-middleware';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Shield,
  Activity,
  Webhook,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * 관리자 페이지 레이아웃
 *
 * - requireAdmin() 미들웨어로 접근 제어 (관리자 권한 필수)
 * - 사이드바 네비게이션
 * - Server Component
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 관리자 권한 확인
  try {
    await requireAdmin();
  } catch {
    // 권한 없으면 403 페이지로 리다이렉트
    redirect('/403');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">관리자 대시보드</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LayoutDashboard className="h-4 w-4" />
                대시보드
              </Button>
            </Link>

            <Separator className="my-2" />

            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                사용자 관리
              </Button>
            </Link>

            <Link href="/admin/external-terms">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                약관 관리
              </Button>
            </Link>

            <Separator className="my-2" />

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              콘텐츠 관리
            </div>

            <Link href="/admin/posts">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                게시글 관리
              </Button>
            </Link>

            <Link href="/admin/comments">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                댓글 관리
              </Button>
            </Link>

            <Separator className="my-2" />

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              시스템
            </div>

            <Link href="/admin/monitoring">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Activity className="h-4 w-4" />
                성능 모니터링
              </Button>
            </Link>

            <Link href="/admin/webhooks">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Webhook className="h-4 w-4" />
                웹훅 관리
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Card className="p-6">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
