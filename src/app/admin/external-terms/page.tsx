'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ExternalTerm = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminExternalTermsPage() {
  const [terms, setTerms] = useState<ExternalTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch('/api/external-terms');
      const data = await response.json();
      if (data.success) {
        setTerms(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/external-terms/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setTerms(terms.filter((term) => term.id !== id));
        setDeleteId(null);
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete term:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">외부 약관 관리</h1>
          </div>
          <p className="text-muted-foreground">
            외부 서비스 이용약관을 생성하고 관리합니다.
          </p>
        </div>
        <Link href="/admin/external-terms/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            새 약관 생성
          </Button>
        </Link>
      </div>

      {/* 약관 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>약관 목록</CardTitle>
          <CardDescription>
            총 {terms.length}개의 약관이 등록되어 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {terms.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              등록된 약관이 없습니다. 새 약관을 생성해보세요.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>업데이트</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{term.title}</div>
                        {term.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {term.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {term.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {term.published ? (
                        <Badge variant="default">공개</Badge>
                      ) : (
                        <Badge variant="secondary">비공개</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(term.updatedAt).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {term.published && (
                          <Link href={`/terms/external/${term.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/external-terms/${term.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(term.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>약관 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 약관을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
