import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { termsItems } from "@/lib/terms-data";
import { FileText } from "lucide-react";

export const metadata = {
  title: "이용약관 및 정책 - Vibe Coding",
  description: "Vibe Coding 플랫폼의 서비스별 이용약관 및 개인정보처리방침을 확인하세요.",
};

export default function TermsPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <FileText className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">이용약관 및 정책</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Vibe Coding 플랫폼의 서비스별 이용약관과 개인정보처리방침을 확인하실 수 있습니다.
        </p>
      </div>

      {/* 약관 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {termsItems.map((item) => {
          const Icon = item.icon || FileText;
          return (
            <Link key={item.id} href={`/terms/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    최종 업데이트: {new Date(item.lastUpdated).toLocaleDateString("ko-KR")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold mb-2">약관 변경 안내</h2>
        <p className="text-muted-foreground">
          약관이 변경되는 경우, 변경 사항은 시행일자 7일 전부터 공지사항을 통해 안내됩니다.
          변경된 약관에 동의하지 않으실 경우, 서비스 이용을 중단하고 탈퇴하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
