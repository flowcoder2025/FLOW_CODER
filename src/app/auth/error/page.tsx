"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  Configuration: "서버 설정에 문제가 있습니다.",
  AccessDenied: "접근이 거부되었습니다.",
  Verification: "인증 토큰이 만료되었거나 이미 사용되었습니다.",
  Default: "인증 중 오류가 발생했습니다.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">로그인 오류</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>문제가 지속되면 관리자에게 문의해주세요.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">다시 로그인하기</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>

          {/* 디버그 정보 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs font-mono text-muted-foreground">
                Error code: {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
