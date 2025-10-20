'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

/**
 * 설정 페이지
 *
 * 기능:
 * - 알림 설정 (이메일, 푸시, 댓글, 답변)
 * - 테마 설정 (시스템, 라이트, 다크)
 * - 언어 설정 (한국어, 영어 - 향후 확장)
 *
 * 데이터 저장:
 * - localStorage['user_settings']
 */

interface NotificationSettings {
  email: boolean;
  push: boolean;
  comments: boolean;
  answers: boolean;
}

interface UserSettings {
  notifications: NotificationSettings;
  language: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    email: true,
    push: true,
    comments: true,
    answers: true,
  },
  language: 'ko',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // localStorage에서 설정 로드
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('user_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // 설정 변경 시 localStorage에 저장
  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('user_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // 알림 설정 변경
  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  // 언어 설정 변경
  const updateLanguage = (language: string) => {
    updateSettings({
      ...settings,
      language,
    });
  };

  // 테마가 로드될 때까지 빈 화면 방지
  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">설정</h1>

        <div className="space-y-6">
          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 이메일 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    새로운 활동에 대한 이메일을 받습니다
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotification('email', checked)}
                />
              </div>

              {/* 푸시 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">푸시 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    브라우저 푸시 알림을 받습니다
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateNotification('push', checked)}
                />
              </div>

              {/* 댓글 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comment-notifications">댓글 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    내 게시글에 댓글이 달리면 알림을 받습니다
                  </p>
                </div>
                <Switch
                  id="comment-notifications"
                  checked={settings.notifications.comments}
                  onCheckedChange={(checked) => updateNotification('comments', checked)}
                />
              </div>

              {/* 답글 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="answer-notifications">답글 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    내 댓글에 답글이 달리면 알림을 받습니다
                  </p>
                </div>
                <Switch
                  id="answer-notifications"
                  checked={settings.notifications.answers}
                  onCheckedChange={(checked) => updateNotification('answers', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 테마 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>테마 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system" className="cursor-pointer">
                    <div>
                      <p className="font-medium">시스템 설정 따르기</p>
                      <p className="text-sm text-muted-foreground">
                        운영체제의 테마 설정을 따릅니다
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="cursor-pointer">
                    <div>
                      <p className="font-medium">라이트 모드</p>
                      <p className="text-sm text-muted-foreground">
                        밝은 테마를 사용합니다
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="cursor-pointer">
                    <div>
                      <p className="font-medium">다크 모드</p>
                      <p className="text-sm text-muted-foreground">
                        어두운 테마를 사용합니다
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 언어 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>언어 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={settings.language} onValueChange={updateLanguage}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ko" id="lang-ko" />
                  <Label htmlFor="lang-ko" className="cursor-pointer">
                    <div>
                      <p className="font-medium">한국어</p>
                      <p className="text-sm text-muted-foreground">
                        인터페이스를 한국어로 표시합니다
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <RadioGroupItem value="en" id="lang-en" disabled />
                  <Label
                    htmlFor="lang-en"
                    className="cursor-not-allowed opacity-50"
                  >
                    <div>
                      <p className="font-medium">English (준비 중)</p>
                      <p className="text-sm text-muted-foreground">
                        향후 지원 예정입니다
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
