import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { termsContentMap, termsItems } from "@/lib/terms-data";
import { ServiceType } from "@/types/terms";
import { TableOfContents } from "@/components/TableOfContents";

// 정적 경로 생성 (빌드 시 미리 생성)
export function generateStaticParams() {
  return termsItems.map((item) => ({
    service: item.id,
  }));
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const content = termsContentMap[service as ServiceType];

  if (!content) {
    return {
      title: "약관을 찾을 수 없습니다 - Vibe Coding",
    };
  }

  return {
    title: `${content.metadata.title} - Vibe Coding`,
    description: content.metadata.description,
  };
}

export default async function TermsDetailPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const content = termsContentMap[service as ServiceType];

  // 유효하지 않은 서비스 타입이면 404
  if (!content) {
    notFound();
  }

  const Icon = content.metadata.icon;

  return (
    <div className="space-y-8">
      {/* 뒤로가기 버튼 */}
      <div>
        <Button variant="ghost" asChild>
          <Link href="/terms" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            약관 목록으로
          </Link>
        </Button>
      </div>

      {/* 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{content.metadata.title}</h1>
            <p className="text-muted-foreground mt-1">
              {content.metadata.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            최종 업데이트: {new Date(content.metadata.lastUpdated).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      <Separator />

      {/* 약관 내용 + 목차 (2-column 레이아웃) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* 약관 내용 */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {content.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 id={section.id} className="text-2xl font-bold mb-4 scroll-mt-24">
                {section.title}
              </h2>
              <div className="text-base leading-relaxed whitespace-pre-wrap mb-4">
                {section.content}
              </div>
              {section.subsections && (
                <div className="ml-4 space-y-4">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id}>
                      <h3
                        id={subsection.id}
                        className="text-lg font-semibold mb-2 scroll-mt-24"
                      >
                        {subsection.title}
                      </h3>
                      <div className="text-base leading-relaxed whitespace-pre-wrap">
                        {subsection.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 하단 안내 */}
          <div className="bg-muted/50 rounded-lg p-6 not-prose">
            <h3 className="font-semibold mb-2">문의하기</h3>
            <p className="text-muted-foreground text-sm">
              약관과 관련하여 문의사항이 있으시면 고객센터를 통해 연락해 주시기 바랍니다.
            </p>
          </div>
        </div>

        {/* 목차 (TOC) */}
        <TableOfContents sections={content.sections} />
      </div>
    </div>
  );
}
