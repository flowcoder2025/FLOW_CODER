'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface UserRoleDialogProps {
  /**
   * Dialog 열림 상태
   */
  open: boolean;

  /**
   * Dialog 닫기 핸들러
   */
  onOpenChange: (open: boolean) => void;

  /**
   * 사용자 정보
   */
  user: {
    id: string;
    username: string | null;
    email: string;
    role: string;
  };

  /**
   * 역할 변경 성공 시 콜백
   */
  onRoleChanged?: () => void;
}

/**
 * 사용자 역할 변경 다이얼로그 (Client Component)
 *
 * - shadcn/ui Dialog + Select
 * - 역할 변경 API 호출 (/api/admin/users/[id]/role)
 * - 낙관적 업데이트 없이 서버 응답 후 새로고침
 */
export function UserRoleDialog({
  open,
  onOpenChange,
  user,
  onRoleChanged,
}: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (selectedRole === user.role) {
      setError('동일한 역할입니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change role');
      }

      // 성공 메시지
      alert(
        `역할 변경 완료: ${user.username || user.email}의 역할이 ${selectedRole}(으)로 변경되었습니다.`
      );

      onOpenChange(false);
      onRoleChanged?.();
    } catch (error: any) {
      console.error('Role change error:', error);
      setError(error.message || '역할 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 역할 변경</DialogTitle>
          <DialogDescription>
            {user.username || user.email}의 역할을 변경합니다. 역할 변경 시
            Zanzibar 권한이 자동으로 부여/제거됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">현재 역할</label>
            <div className="text-sm text-muted-foreground">{user.role}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">새 역할</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• USER: 일반 사용자 권한</p>
            <p>• MODERATOR: 콘텐츠 관리 권한 (게시글/댓글 관리)</p>
            <p>• ADMIN: 모든 관리 권한 (사용자/약관/뉴스 관리)</p>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '변경 중...' : '변경'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
