'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/lib/types';

/**
 * 프로필 헤더 컴포넌트
 *
 * 기능:
 * - localStorage에서 프로필 편집 데이터 로드
 * - 편집된 데이터가 있으면 표시, 없으면 Mock 데이터 표시
 * - 본인 프로필인 경우 "프로필 편집" 버튼 표시
 */

interface ProfileEdit {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfileHeaderProps {
  user: User;
  /** 현재 로그인한 사용자의 username (본인 프로필 판단용) */
  currentUsername?: string;
}

/** Reputation 배지 색상 결정 */
function getReputationBadge(reputation: number) {
  if (reputation >= 500) {
    return {
      label: '골드',
      className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    };
  }
  if (reputation >= 100) {
    return {
      label: '실버',
      className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    };
  }
  return {
    label: '브론즈',
    className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };
}

export function ProfileHeader({ user, currentUsername }: ProfileHeaderProps) {
  const [profileData, setProfileData] = useState({
    displayName: user.displayName || user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  });

  // localStorage에서 프로필 편집 데이터 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile_edits');
      if (stored) {
        const edits: Record<string, ProfileEdit> = JSON.parse(stored);
        const userEdit = edits[user.username];

        if (userEdit) {
          setProfileData({
            displayName: userEdit.displayName || user.displayName || user.username,
            bio: userEdit.bio !== undefined ? userEdit.bio : user.bio,
            avatarUrl: userEdit.avatarUrl || user.avatarUrl,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile edits:', error);
    }
  }, [user]);

  const reputationBadge = getReputationBadge(user.reputation);
  const isOwnProfile = currentUsername === user.username;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 아바타 */}
          <img
            src={profileData.avatarUrl}
            alt={profileData.displayName}
            className="w-24 h-24 rounded-full object-cover"
          />

          {/* 사용자 정보 */}
          <div className="flex-1">
            {/* 이름 */}
            <h1 className="text-3xl font-bold mb-1">
              {profileData.displayName}
            </h1>

            {/* Username */}
            <p className="text-muted-foreground mb-3">@{user.username}</p>

            {/* Bio */}
            {profileData.bio && (
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {profileData.bio}
              </p>
            )}

            {/* Reputation 배지 */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={reputationBadge.className}>
                {reputationBadge.label} · {user.reputation}
              </Badge>
            </div>
          </div>

          {/* 프로필 편집 버튼 (본인 프로필인 경우만) */}
          {isOwnProfile && (
            <Link href="/profile/edit">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                프로필 편집
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
