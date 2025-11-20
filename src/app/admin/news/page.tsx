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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Pin, PinOff, Trash2, Search, Eye, RotateCcw, Star, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  title: string;
  postType: string;
  isPinned: boolean;
  isFeatured: boolean;
  viewCount: number;
  upvotes: number;
  deletedAt: string | null;
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
    answers: number;
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

export default function AdminNewsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pinnedFilter, setPinnedFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: 'pinned',
        postType: 'NEWS', // NEWS 타입만 가져오기
      });

      if (pinnedFilter === 'pinned') {
        params.append('isPinned', 'true');
      } else if (pinnedFilter === 'unpinned') {
        params.append('isPinned', 'false');
      }

      if (featuredFilter === 'featured') {
        params.append('isFeatured', 'true');
      } else if (featuredFilter === 'unfeatured') {
        params.append('isFeatured', 'false');
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (includeDeleted) {
        params.append('includeDeleted', 'true');
      }

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data: PostsResponse = await response.json();
      setPosts(data.data.posts);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      alert('뉴스 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, pinnedFilter, featuredFilter, includeDeleted]);

  const handleTogglePin = async (postId: string, currentPinned: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentPinned }),
      });

      if (!response.ok) throw new Error('Failed to toggle pin');

      alert(`뉴스가 ${!currentPinned ? '고정' : '고정 해제'}되었습니다.`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      alert('뉴스 고정 상태를 변경하는데 실패했습니다.');
    }
  };

  const handleToggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) throw new Error('Failed to toggle featured');

      alert(`뉴스가 ${!currentFeatured ? '주목 뉴스로 지정' : '주목 뉴스에서 제외'}되었습니다.`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      alert('뉴스 주목 상태를 변경하는데 실패했습니다.');
    }
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`"${title}" 뉴스를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      alert('뉴스가 삭제되었습니다.');
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('뉴스 삭제에 실패했습니다.');
    }
  };

  const handleRestore = async (postId: string, title: string) => {
    if (!confirm(`"${title}" 뉴스를 복구하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore: true }),
      });

      if (!response.ok) throw new Error('Failed to restore post');

      alert('뉴스가 복구되었습니다.');
      fetchPosts();
    } catch (error) {
      console.error('Failed to restore post:', error);
      alert('뉴스 복구에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">뉴스 관리</h2>
          <p className="text-muted-foreground">
            뉴스 게시글 작성 및 관리
          </p>
        </div>
        <Button onClick={() => router.push('/admin/news/new')}>
          <Plus className="h-4 w-4 mr-2" />
          새 뉴스 작성
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <div className="space-y-4">
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

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="주목 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="featured">주목 뉴스</SelectItem>
              <SelectItem value="unfeatured">일반</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 삭제된 뉴스 표시 토글 */}
        <div className="flex items-center space-x-2">
          <Switch
            id="include-deleted"
            checked={includeDeleted}
            onCheckedChange={setIncludeDeleted}
          />
          <Label htmlFor="include-deleted">삭제된 뉴스 포함</Label>
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">고정</TableHead>
              <TableHead className="w-12">주목</TableHead>
              <TableHead>제목</TableHead>
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
                  뉴스가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className={post.deletedAt ? 'bg-red-50' : ''}>
                  <TableCell>
                    <Button
                      variant={post.isPinned ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handleTogglePin(post.id, post.isPinned)}
                      title={post.isPinned ? '고정 해제' : '카테고리에 고정'}
                      disabled={!!post.deletedAt}
                    >
                      {post.isPinned ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={post.isFeatured ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handleToggleFeatured(post.id, post.isFeatured)}
                      title={post.isFeatured ? '주목 뉴스 해제' : '주목 뉴스로 지정'}
                      disabled={!!post.deletedAt}
                      className={post.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    >
                      <Star className={`h-4 w-4 ${post.isFeatured ? 'fill-white' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium max-w-md truncate">
                    <div>
                      <Link
                        href={`/news/${post.id}`}
                        className="hover:underline"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                      {post.deletedAt && (
                        <Badge variant="destructive" className="ml-2">
                          삭제됨
                        </Badge>
                      )}
                    </div>
                  </TableCell>
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
                      {!post.deletedAt ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/news/${post.id}`)}
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
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(post.id, post.title)}
                          title="복구"
                        >
                          <RotateCcw className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
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
          총 {posts.length}개 뉴스
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
