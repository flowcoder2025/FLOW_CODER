import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldAlert, Home } from 'lucide-react';

/**
 * 403 Forbidden 페이지
 *
 * 접근 권한이 없는 사용자가 제한된 리소스에 접근 시 표시
 * - 명확한 에러 메시지
 * - 홈으로 돌아가기 버튼
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          접근 권한이 없습니다
        </h1>

        <p className="text-gray-600 mb-8">
          이 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          관리자 또는 모더레이터 권한이 필요합니다.
        </p>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>

          <Link href="/auth/signin">
            <Button variant="outline" className="w-full">
              다른 계정으로 로그인
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            권한이 필요하다고 생각되시면 관리자에게 문의하세요.
          </p>
        </div>
      </Card>
    </div>
  );
}
