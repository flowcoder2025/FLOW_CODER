import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar } from 'lucide-react';

// 빌드 시 pre-render 건너뛰기 (DB 연결 없이도 빌드 가능)
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const terms = await prisma.externalTerms.findUnique({
    where: { slug, published: true },
  });

  if (!terms) {
    return {
      title: '약관을 찾을 수 없습니다 - Vibe Coding',
    };
  }

  return {
    title: `${terms.title} - Vibe Coding`,
    description: terms.description || `${terms.title} 이용약관`,
  };
}

export async function generateStaticParams() {
  try {
    const terms = await prisma.externalTerms.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return terms.map((term) => ({
      slug: term.slug,
    }));
  } catch (error) {
    // 빌드 시 데이터베이스 연결 불가 시 빈 배열 반환
    console.warn('Failed to generate static params for external terms:', error);
    return [];
  }
}

export default async function ExternalTermsPage({ params }: PageProps) {
  const { slug } = await params;

  const terms = await prisma.externalTerms.findUnique({
    where: { slug, published: true },
  });

  if (!terms) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <FileText className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">{terms.title}</h1>
        {terms.description && (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {terms.description}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            최종 업데이트: {new Date(terms.updatedAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>

      <Separator />

      {/* 마크다운 콘텐츠 */}
      <div className="max-w-4xl mx-auto">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {terms.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
