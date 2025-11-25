'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// 동적 Import: react-markdown과 remark-gfm은 무겁기 때문에 lazy load
const ReactMarkdown = dynamic(
  () => import('react-markdown'),
  {
    loading: () => (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        마크다운 렌더러 로딩 중...
      </div>
    ),
    ssr: false,
  }
);

// remark-gfm은 default export가 아니므로 별도 처리
const remarkGfm = dynamic(
  () => import('remark-gfm').then((mod) => mod.default),
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

export default function NewExternalTermsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    content: '',
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/external-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/external-terms');
      } else {
        alert(data.error || '생성에 실패했습니다.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to create term:', error);
      alert('생성 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8 max-w-6xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/external-terms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">새 약관 생성</h1>
          <p className="text-muted-foreground">
            외부 서비스 이용약관을 작성합니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>약관의 기본 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  placeholder="예: Apps in Toss 이용약관"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL 식별자) *</Label>
                <Input
                  id="slug"
                  placeholder="예: apps-in-toss"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  pattern="[a-z0-9-]+"
                  title="소문자, 숫자, 하이픈(-)만 사용 가능합니다"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL 경로로 사용됩니다: /terms/external/{formData.slug || 'slug'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택)</Label>
              <Input
                id="description"
                placeholder="약관에 대한 간단한 설명"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published" className="cursor-pointer">
                공개 상태로 저장
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* 마크다운 콘텐츠 */}
        <Card>
          <CardHeader>
            <CardTitle>약관 내용</CardTitle>
            <CardDescription>
              마크다운 형식으로 약관 내용을 작성하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="edit">편집</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <Textarea
                  id="content"
                  placeholder="# 제1조 (목적)&#10;&#10;이 약관은..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="min-h-[400px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  GitHub Flavored Markdown을 지원합니다. (표, 체크박스, 코드 블록 등)
                </p>
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-6 min-h-[400px] bg-muted/50">
                  {formData.content ? (
                    <article className="prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content}
                      </ReactMarkdown>
                    </article>
                  ) : (
                    <p className="text-muted-foreground text-center py-20">
                      내용을 입력하면 미리보기가 표시됩니다.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/external-terms">
            <Button type="button" variant="outline" disabled={loading}>
              취소
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              '저장 중...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
