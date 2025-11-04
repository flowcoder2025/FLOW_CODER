import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { termsItems, termsContentMap } from "@/lib/terms-data";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "이용약관 - Vibe Coding",
  description: "Vibe Coding 플랫폼의 서비스 이용약관 및 정책을 확인하세요.",
};

type ExternalTerm = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  updatedAt: Date;
};

export default async function TermsPage() {
  // 공개된 외부 약관 목록 조회
  let externalTerms: ExternalTerm[] = [];
  try {
    externalTerms = await prisma.externalTerms.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    // 빌드 시 데이터베이스 연결 불가 시 빈 배열 사용
    console.warn('Failed to fetch external terms:', error);
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <FileText className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">이용약관 및 정책</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Vibe Coding 플랫폼의 서비스 이용약관과 정책을 확인하실 수 있습니다.
        </p>
      </div>

      <Separator />

      {/* 약관 아코디언 */}
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {termsItems.map((item) => {
            const Icon = item.icon || FileText;
            const content = termsContentMap[item.id];

            return (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg mb-4 px-6">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        최종 업데이트: {new Date(item.lastUpdated).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {content.sections.map((section) => (
                      <div key={section.id} className="mb-6">
                        <h3 className="text-lg font-bold mb-3">
                          {section.title}
                        </h3>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap mb-3 text-muted-foreground">
                          {section.content}
                        </div>
                        {section.subsections && (
                          <div className="ml-4 space-y-3">
                            {section.subsections.map((subsection) => (
                              <div key={subsection.id}>
                                <h4 className="text-base font-semibold mb-2">
                                  {subsection.title}
                                </h4>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                  {subsection.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Separator className="my-12" />

      {/* 외부 관련 약관 섹션 */}
      {externalTerms.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">관련 서비스 약관</h2>
            <p className="text-muted-foreground text-sm">
              Vibe Coding과 연관된 외부 서비스의 이용약관입니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalTerms.map((term) => (
              <Link key={term.id} href={`/terms/external/${term.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{term.title}</CardTitle>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {term.description && (
                      <CardDescription className="text-sm">
                        {term.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      최종 업데이트: {new Date(term.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-muted/50 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">약관 변경 안내</h3>
        <p className="text-muted-foreground text-sm">
          약관이 변경되는 경우, 변경 사항은 시행일자 7일 전부터 공지사항을 통해 안내됩니다.
          변경된 약관에 동의하지 않으실 경우, 서비스 이용을 중단하고 탈퇴하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
