'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserRoleDialog } from '@/components/admin/UserRoleDialog';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string;
  image: string | null;
  role: string;
  reputation: number;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

/**
 * 사용자 관리 페이지 (Client Component)
 *
 * - 사용자 목록 테이블 (shadcn/ui Table)
 * - 검색 기능 (username, email)
 * - 역할 필터 (USER, MODERATOR, ADMIN)
 * - 페이지네이션
 * - 역할 변경 다이얼로그
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 역할 변경 다이얼로그 상태
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const limit = 20;

  // 사용자 목록 조회
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 검색/필터/페이지 변경 시 재조회
  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  // 검색 입력 디바운스
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // 검색 시 첫 페이지로
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 역할 변경 핸들러
  const handleRoleClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // 역할 변경 성공 후 새로고침
  const handleRoleChanged = () => {
    fetchUsers();
  };

  // 역할 배지 색상
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MODERATOR':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">사용자 관리</h2>
        <p className="text-muted-foreground">
          사용자 목록 조회 및 역할 관리
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="사용자 이름, 이메일로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="역할 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="MODERATOR">MODERATOR</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 사용자 테이블 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>평판</TableHead>
              <TableHead>게시글</TableHead>
              <TableHead>댓글</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.displayName || user.username || '(이름 없음)'}
                      </div>
                      {user.username && (
                        <div className="text-sm text-muted-foreground">
                          @{user.username}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.reputation}</TableCell>
                  <TableCell>{user._count.posts}</TableCell>
                  <TableCell>{user._count.comments}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleClick(user)}
                    >
                      역할 변경
                    </Button>
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
          총 {total}명의 사용자
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <div className="text-sm">
            {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 역할 변경 다이얼로그 */}
      {selectedUser && (
        <UserRoleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          user={selectedUser}
          onRoleChanged={handleRoleChanged}
        />
      )}
    </div>
  );
}
