import { z } from 'zod';

/**
 * 게시글 작성 스키마
 */
export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, '제목은 최소 5자 이상이어야 합니다')
    .max(200, '제목은 최대 200자까지 가능합니다')
    .trim(),

  content: z
    .string()
    .min(20, '내용은 최소 20자 이상이어야 합니다')
    .max(50000, '내용은 최대 50,000자까지 가능합니다'),

  categoryId: z
    .string()
    .cuid('올바른 카테고리 ID 형식이 아닙니다'),

  postType: z
    .enum(['DISCUSSION', 'QUESTION', 'SHOWCASE', 'TUTORIAL', 'NEWS'], {
      message: '올바른 게시글 타입을 선택해주세요',
    })
    .optional()
    .default('DISCUSSION'),

  tags: z
    .array(z.string().trim())
    .max(5, '태그는 최대 5개까지 가능합니다')
    .optional(),

  isFeatured: z.boolean().optional().default(false),

  images: z
    .array(
      z.object({
        url: z.string().url('올바른 이미지 URL이 아닙니다'),
        alt: z.string().optional(),
        isFeatured: z.boolean().optional().default(false),
        order: z.number().int().min(0).optional().default(0),
      })
    )
    .max(10, '이미지는 최대 10개까지 첨부 가능합니다')
    .optional(),
});

/**
 * 게시글 수정 스키마
 */
export const updatePostSchema = z.object({
  title: z
    .string()
    .min(5, '제목은 최소 5자 이상이어야 합니다')
    .max(200, '제목은 최대 200자까지 가능합니다')
    .trim()
    .optional(),

  content: z
    .string()
    .min(20, '내용은 최소 20자 이상이어야 합니다')
    .max(50000, '내용은 최대 50,000자까지 가능합니다')
    .optional(),

  categoryId: z
    .string()
    .cuid('올바른 카테고리 ID 형식이 아닙니다')
    .optional(),

  postType: z
    .enum(['DISCUSSION', 'QUESTION', 'SHOWCASE', 'TUTORIAL', 'NEWS'], {
      message: '올바른 게시글 타입을 선택해주세요',
    })
    .optional(),

  tags: z
    .array(z.string().trim())
    .max(5, '태그는 최대 5개까지 가능합니다')
    .optional(),

  isFeatured: z.boolean().optional(),

  images: z
    .array(
      z.object({
        url: z.string().url('올바른 이미지 URL이 아닙니다'),
        alt: z.string().optional(),
        isFeatured: z.boolean().optional().default(false),
        order: z.number().int().min(0).optional().default(0),
      })
    )
    .max(10, '이미지는 최대 10개까지 첨부 가능합니다')
    .optional(),
});

/**
 * 게시글 타입 (TypeScript 타입 추론)
 */
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
