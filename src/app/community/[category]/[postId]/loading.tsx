import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 게시글 상세페이지 로딩 스켈레톤
 * Next.js의 loading.tsx 컨벤션을 활용한 즉각적인 로딩 피드백
 */
export default function PostDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb 스켈레톤 */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </nav>

      {/* 게시글 카드 스켈레톤 */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            {/* 좌측: 투표 섹션 (데스크톱만) */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 카테고리 배지 */}
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>

              {/* 제목 */}
              <Skeleton className="h-8 md:h-10 w-full max-w-xl mb-3" />

              {/* 작성자 & 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* 본문 스켈레톤 */}
              <div className="space-y-4 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* 태그 스켈레톤 */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>

              {/* 모바일 투표 버튼 */}
              <div className="md:hidden mt-6 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 스켈레톤 */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <Skeleton className="h-7 w-24 mb-6" />

          {/* 댓글 입력 폼 스켈레톤 */}
          <div className="mb-6">
            <Skeleton className="h-24 w-full rounded-md mb-2" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>

          {/* 댓글 목록 스켈레톤 */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
