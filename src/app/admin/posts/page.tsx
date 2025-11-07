'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pin, PinOff, Edit, Trash2, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  title: string;
  postType: string;
  isPinned: boolean;
  viewCount: number;
  upvotes: number;
  createdAt: string;
  author: {
    username: string | null;
    displayName: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  _count: {
    comments: number;
  };
};

type PostsResponse = {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postTypeFilter, setPostTypeFilter] = useState<string>('all');
  const [pinnedFilter, setPinnedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: 'pinned',
      });

      if (postTypeFilter !== 'all') {
        params.append('postType', postTypeFilter);
      }

      if (pinnedFilter === 'pinned') {
        params.append('isPinned', 'true');
      } else if (pinnedFilter === 'unpinned') {
        params.append('isPinned', 'false');
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data: PostsResponse = await response.json();
      setPosts(data.data.posts);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      alert('게시물 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, postTypeFilter, pinnedFilter]);

  const handleTogglePin = async (postId: string, currentPinned: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentPinned }),
      });

      if (!response.ok) throw new Error('Failed to toggle pin');

      alert(`게시물이 ${!currentPinned ? '고정' : '고정 해제'}되었습니다.`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      alert('게시물 고정 상태를 변경하는데 실패했습니다.');
    }
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`"${title}" 게시물을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      alert('게시물이 삭제되었습니다.');
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('게시물 삭제에 실패했습니다.');
    }
  };

  const getPostTypeBadge = (postType: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      DISCUSSION: { label: '토론', className: 'bg-blue-100 text-blue-800' },
      QUESTION: { label: '질문', className: 'bg-purple-100 text-purple-800' },
      SHOWCASE: { label: '쇼케이스', className: 'bg-green-100 text-green-800' },
      NEWS: { label: '뉴스', className: 'bg-orange-100 text-orange-800' },
    };

    const config = variants[postType] || { label: postType, className: '' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">게시물 관리</h2>
        <p className="text-muted-foreground">
          홈 화면 게시물 고정 및 관리
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="제목 또는 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  fetchPosts();
                }
              }}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={postTypeFilter} onValueChange={setPostTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="게시물 타입" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 타입</SelectItem>
            <SelectItem value="DISCUSSION">토론</SelectItem>
            <SelectItem value="QUESTION">질문</SelectItem>
            <SelectItem value="SHOWCASE">쇼케이스</SelectItem>
            <SelectItem value="NEWS">뉴스</SelectItem>
          </SelectContent>
        </Select>

        <Select value={pinnedFilter} onValueChange={setPinnedFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="고정 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="pinned">고정됨</SelectItem>
            <SelectItem value="unpinned">고정 안됨</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 게시물 목록 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">고정</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">타입</TableHead>
              <TableHead className="w-32">카테고리</TableHead>
              <TableHead className="w-32">작성자</TableHead>
              <TableHead className="w-24 text-center">조회</TableHead>
              <TableHead className="w-24 text-center">추천</TableHead>
              <TableHead className="w-24 text-center">댓글</TableHead>
              <TableHead className="w-40">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  게시물이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Button
                      variant={post.isPinned ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handleTogglePin(post.id, post.isPinned)}
                      title={post.isPinned ? '고정 해제' : '홈에 고정'}
                    >
                      {post.isPinned ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium max-w-md truncate">
                    <Link
                      href={`/community/posts/${post.id}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{getPostTypeBadge(post.postType)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {post.author.displayName || post.author.username || '익명'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {post.viewCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {post.upvotes}
                  </TableCell>
                  <TableCell className="text-center">
                    {post._count.comments}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/community/posts/${post.id}`)}
                        title="보기"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id, post.title)}
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {posts.length}개 게시물
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            이전
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm">
              {page} / {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
