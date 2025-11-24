import { z } from 'zod';

/**
 * 회원가입 스키마
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 최대 100자까지 가능합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 영문 대소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다'
    ),

  username: z
    .string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      '사용자명은 영문, 숫자, 언더스코어, 하이픈만 사용 가능합니다'
    )
    .trim(),

  displayName: z
    .string()
    .min(2, '표시 이름은 최소 2자 이상이어야 합니다')
    .max(50, '표시 이름은 최대 50자까지 가능합니다')
    .trim()
    .optional(),
});

/**
 * 프로필 수정 스키마
 */
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      '사용자명은 영문, 숫자, 언더스코어, 하이픈만 사용 가능합니다'
    )
    .trim()
    .optional(),

  displayName: z
    .string()
    .min(2, '표시 이름은 최소 2자 이상이어야 합니다')
    .max(50, '표시 이름은 최대 50자까지 가능합니다')
    .trim()
    .optional(),

  bio: z
    .string()
    .max(500, '자기소개는 최대 500자까지 가능합니다')
    .trim()
    .optional()
    .nullable(),

  image: z
    .string()
    .url('올바른 이미지 URL이 아닙니다')
    .optional()
    .nullable(),
});

/**
 * 비밀번호 변경 스키마
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),

    newPassword: z
      .string()
      .min(8, '새 비밀번호는 최소 8자 이상이어야 합니다')
      .max(100, '새 비밀번호는 최대 100자까지 가능합니다')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '새 비밀번호는 영문 대소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다'
      ),

    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
    path: ['newPassword'],
  });

/**
 * 사용자 타입 (TypeScript 타입 추론)
 */
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
