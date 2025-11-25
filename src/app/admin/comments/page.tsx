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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Search, RotateCcw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Comment = {
  id: string;
  content: string;
  deletedAt: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    displayName: string | null;
    role: string;
  };
  post: {
    id: string;
    title: string;
    postType: string;
  };
  parent: {
    id: string;
    content: string;
    author: {
      username: string | null;
      displayName: string | null;
    };
  } | null;
};

type CommentsResponse = {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: 'recent',
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (includeDeleted) {
        params.append('includeDeleted', 'true');
      }

      const response = await fetch(`/api/admin/comments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch comments');

      const data: CommentsResponse = await response.json();
      setComments(data.data.comments);
      setTotal(data.data.pagination.total);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      alert('댓글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, includeDeleted]);

  const handleDelete = async (commentId: string, content: string) => {
    const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    if (!confirm(`"${preview}" 댓글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      alert('댓글이 삭제되었습니다.');
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleRestore = async (commentId: string, content: string) => {
    const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    if (!confirm(`"${preview}" 댓글을 복구하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore: true }),
      });

      if (!response.ok) throw new Error('Failed to restore comment');

      alert('댓글이 복구되었습니다.');
      fetchComments();
    } catch (error) {
      console.error('Failed to restore comment:', error);
      alert('댓글 복구에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">댓글 관리</h2>
        <p className="text-muted-foreground">
          댓글 목록 조회 및 관리 (삭제, 복구)
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="댓글 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  fetchComments();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => fetchComments()}>검색</Button>
        </div>

        {/* 삭제된 댓글 표시 토글 */}
        <div className="flex items-center space-x-2">
          <Switch
            id="include-deleted"
            checked={includeDeleted}
            onCheckedChange={setIncludeDeleted}
          />
          <Label htmlFor="include-deleted">삭제된 댓글 포함</Label>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>내용</TableHead>
              <TableHead className="w-32">작성자</TableHead>
              <TableHead className="w-48">게시글</TableHead>
              <TableHead className="w-32">작성일</TableHead>
              <TableHead className="w-32">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  댓글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id} className={comment.deletedAt ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div className="space-y-2">
                      {/* 대댓글 표시 */}
                      {comment.parent && (
                        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                          <span className="font-medium">
                            @{comment.parent.author.displayName || comment.parent.author.username}
                          </span>{' '}
                          님에게 답글
                        </div>
                      )}
                      {/* 댓글 내용 */}
                      <div className="max-w-md">
                        <p className="text-sm line-clamp-2">{comment.content}</p>
                      </div>
                      {/* 삭제 배지 */}
                      {comment.deletedAt && (
                        <Badge variant="destructive" className="text-xs">
                          삭제됨
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">
                        {comment.author.displayName || comment.author.username || '(이름 없음)'}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {comment.author.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/community/posts/${comment.post.id}`}
                      className="hover:underline text-sm flex items-center gap-1"
                      target="_blank"
                    >
                      <span className="line-clamp-2">{comment.post.title}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!comment.deletedAt ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment.id, comment.content)}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(comment.id, comment.content)}
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
          총 {total}개의 댓글
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
