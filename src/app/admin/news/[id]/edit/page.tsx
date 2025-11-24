'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader, type UploadedImage } from '@/components/ImageUploader';

import { NEWS_CATEGORIES } from '@/lib/news-categories';

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
) as any;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    newsCategory: '',
    tags: '',
    isPinned: false,
    isFeatured: false,
  });
  const [images, setImages] = useState<UploadedImage[]>([]);

  // 기존 게시글 데이터 로드
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (data.success && data.data.post) {
          const post = data.data.post;

          // 뉴스 카테고리는 tags의 첫 번째 요소 (NEWS_CATEGORIES 중 하나)
          const newsCategory = post.tags?.find((tag: string) =>
            NEWS_CATEGORIES.includes(tag as any)
          ) || '';

          // 나머지 태그들
          const otherTags = post.tags?.filter((tag: string) =>
            !NEWS_CATEGORIES.includes(tag as any)
          ) || [];

          setFormData({
            title: post.title,
            content: post.content,
            newsCategory,
            tags: otherTags.join(', '),
            isPinned: post.isPinned || false,
            isFeatured: post.isFeatured || false,
          });

          // 기존 이미지 로드
          if (post.images && post.images.length > 0) {
            const existingImages: UploadedImage[] = post.images.map((img: any) => ({
              url: img.url,
              isFeatured: img.isFeatured,
              alt: img.alt,
            }));
            setImages(existingImages);
          }
        } else {
          alert('게시글을 불러올 수 없습니다.');
          router.push('/admin/news');
        }
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        router.push('/admin/news');
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 뉴스 카테고리를 tags 배열에 포함
      const additionalTags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const tags = formData.newsCategory
        ? [formData.newsCategory, ...additionalTags]
        : additionalTags;

      // 게시글 업데이트
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // isPinned 또는 isFeatured 설정 업데이트
        await fetch(`/api/admin/posts/${postId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isPinned: formData.isPinned,
            isFeatured: formData.isFeatured,
          }),
        });

        // 이미지 처리 (새 이미지가 있으면)
        if (images.length > 0) {
          // 1. 먼저 모든 이미지를 Supabase Storage에 업로드
          const uploadedImages = [];

          for (const img of images) {
            // file 객체가 있으면 업로드, 없으면 이미 업로드된 URL
            if (img.file) {
              const formData = new FormData();
              formData.append('file', img.file);
              formData.append('postId', postId);

              const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
              });

              const uploadData = await uploadResponse.json();
              if (uploadData.success) {
                uploadedImages.push({
                  url: uploadData.url,
                  alt: img.alt,
                  isFeatured: img.isFeatured,
                });
              } else {
                console.error('이미지 업로드 실패:', uploadData.error);
              }
            } else {
              // 이미 업로드된 이미지 (수정 시)
              uploadedImages.push({
                url: img.url,
                alt: img.alt,
                isFeatured: img.isFeatured,
              });
            }
          }

          // 2. 업로드된 URL들을 PostImage 테이블에 저장
          if (uploadedImages.length > 0) {
            await fetch(`/api/posts/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postId,
                images: uploadedImages.map((img, idx) => ({
                  url: img.url,
                  alt: img.alt,
                  order: idx,
                  isFeatured: img.isFeatured,
                })),
              }),
            });
          }
        }

        router.push('/admin/news');
      } else {
        alert(data.error || '수정에 실패했습니다.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to update news:', error);
      alert('수정 중 오류가 발생했습니다.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">게시글 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">뉴스 수정</h2>
          <p className="text-muted-foreground">
            뉴스 게시글을 수정합니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>뉴스의 기본 정보를 수정하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="뉴스 제목을 입력하세요"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsCategory">뉴스 카테고리 *</Label>
              <Select
                value={formData.newsCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, newsCategory: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="뉴스 카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                선택한 카테고리는 태그로 자동 추가됩니다
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">추가 태그 (선택)</Label>
              <Input
                id="tags"
                placeholder="추가 태그를 쉼표로 구분하여 입력 (예: AI, 개발, 튜토리얼)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                뉴스 카테고리 외 추가 태그 (최대 5개, 각 태그는 20자 이내)
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPinned: checked })
                  }
                />
                <Label htmlFor="isPinned" className="cursor-pointer">
                  카테고리에 고정
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  주목 뉴스로 지정 (홈 캐러셀 표시)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 이미지 첨부 */}
        <Card>
          <CardHeader>
            <CardTitle>이미지 첨부</CardTitle>
            <CardDescription>
              뉴스 게시글에 표시할 이미지를 첨부하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onChange={setImages}
              initialImages={images}
              maxImages={10}
            />
          </CardContent>
        </Card>

        {/* 마크다운 콘텐츠 */}
        <Card>
          <CardHeader>
            <CardTitle>뉴스 내용</CardTitle>
            <CardDescription>
              마크다운 형식으로 뉴스 내용을 작성하세요.
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
                  placeholder="뉴스 내용을 마크다운으로 작성하세요..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="min-h-[400px] font-mono text-sm"
                  maxLength={10000}
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
          <Link href="/admin/news">
            <Button type="button" variant="outline" disabled={submitting}>
              취소
            </Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
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
