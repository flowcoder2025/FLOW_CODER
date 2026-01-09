import { Skeleton } from '@/components/ui/skeleton';
import { PostListSkeleton } from '@/components/skeletons/PostCardSkeleton';

/**
 * 카테고리 게시글 목록 로딩 스켈레톤
 */
export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-5 w-64 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* 정렬/필터 영역 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* 게시글 목록 */}
      <PostListSkeleton count={5} />
    </div>
  );
}
