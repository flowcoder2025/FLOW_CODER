import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserProfile(id);

  if (!user) {
    notFound();
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* 프로필 헤더 */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl">{user.name || "익명 사용자"}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">가입일: {memberSince}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 활동 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-muted-foreground">게시글</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-muted-foreground">댓글</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-muted-foreground">좋아요</p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>아직 활동 내역이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
