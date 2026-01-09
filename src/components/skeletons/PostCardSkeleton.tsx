import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 게시글 카드 스켈레톤 컴포넌트
 * 목록 페이지에서 사용
 */
export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* 투표 영역 */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 min-w-0">
            {/* 배지 */}
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* 제목 */}
            <Skeleton className="h-6 w-full max-w-md mb-2" />

            {/* 본문 미리보기 */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-3" />

            {/* 태그 */}
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 게시글 목록 스켈레톤
 */
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
