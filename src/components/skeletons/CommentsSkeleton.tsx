import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 댓글 섹션 스켈레톤 컴포넌트
 * 재사용 가능한 댓글 로딩 UI
 */
export function CommentsSkeleton({ count = 3 }: { count?: number }) {
  return (
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
          {Array.from({ length: count }).map((_, i) => (
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
  );
}
