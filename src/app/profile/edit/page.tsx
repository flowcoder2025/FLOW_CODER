'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/**
 * 프로필 편집 페이지
 *
 * 기능:
 * - 아바타 선택 (dicebear.com API)
 * - displayName, bio 편집
 * - localStorage에 저장
 * - 저장 후 프로필 페이지로 리다이렉트
 *
 * Mock 환경:
 * - 현재 사용자: 'admin' (하드코딩)
 * - 데이터 저장: localStorage['profile_edits'][username]
 */

interface ProfileFormData {
  displayName: string;
  bio: string;
  avatarSeed: string;
}

const AVATAR_SEEDS = [
  'felix',
  'aneka',
  'oliver',
  'sophia',
  'liam',
  'emma',
  'noah',
  'ava',
];

export default function ProfileEditPage() {
  const router = useRouter();
  const [currentUser] = useState('admin'); // Mock: 하드코딩된 사용자
  const [selectedSeed, setSelectedSeed] = useState('felix');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();

  // localStorage에서 기존 프로필 데이터 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile_edits');
      if (stored) {
        const edits = JSON.parse(stored);
        const userEdit = edits[currentUser];

        if (userEdit) {
          setValue('displayName', userEdit.displayName || '관리자');
          setValue('bio', userEdit.bio || '');
          if (userEdit.avatarUrl) {
            // dicebear URL에서 seed 추출
            const seedMatch = userEdit.avatarUrl.match(/seed=([^&]+)/);
            if (seedMatch) {
              setSelectedSeed(seedMatch[1]);
            }
          }
        }
      } else {
        // 초기값 설정 (Mock 데이터)
        setValue('displayName', '관리자');
        setValue('bio', '');
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

    try {
      // localStorage에 저장
      const stored = localStorage.getItem('profile_edits');
      const edits = stored ? JSON.parse(stored) : {};

      edits[currentUser] = {
        displayName: data.displayName,
        bio: data.bio,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeed}`,
      };

      localStorage.setItem('profile_edits', JSON.stringify(edits));

      // 프로필 페이지로 리다이렉트
      router.push(`/profile/${currentUser}`);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>프로필 편집</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 아바타 선택 */}
              <div className="space-y-4">
                <Label>프로필 이미지</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeed}`}
                      alt="프로필 이미지 미리보기"
                    />
                    <AvatarFallback>PR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      아바타를 선택하세요
                    </p>
                    <RadioGroup
                      value={selectedSeed}
                      onValueChange={setSelectedSeed}
                      className="grid grid-cols-4 gap-4"
                    >
                      {AVATAR_SEEDS.map((seed) => (
                        <div key={seed} className="flex flex-col items-center gap-2">
                          <RadioGroupItem
                            value={seed}
                            id={seed}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={seed}
                            className={`cursor-pointer rounded-full border-2 transition-all ${
                              selectedSeed === seed
                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                : 'border-transparent hover:border-muted-foreground'
                            }`}
                          >
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                                alt={seed}
                              />
                              <AvatarFallback>{seed[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 표시 이름 */}
              <div className="space-y-2">
                <Label htmlFor="displayName">표시 이름</Label>
                <Input
                  id="displayName"
                  placeholder="프로필에 표시될 이름"
                  {...register('displayName', {
                    required: '표시 이름을 입력하세요',
                    maxLength: {
                      value: 50,
                      message: '표시 이름은 50자 이내로 입력하세요',
                    },
                  })}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              {/* 자기소개 */}
              <div className="space-y-2">
                <Label htmlFor="bio">자기소개</Label>
                <Textarea
                  id="bio"
                  placeholder="자신에 대해 간단히 소개해주세요"
                  rows={4}
                  {...register('bio', {
                    maxLength: {
                      value: 200,
                      message: '자기소개는 200자 이내로 입력하세요',
                    },
                  })}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/profile/${currentUser}`)}
                  disabled={isSaving}
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
