import { z } from 'zod';

/**
 * 댓글 작성 스키마
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, '댓글은 최소 2자 이상이어야 합니다')
    .max(5000, '댓글은 최대 5,000자까지 가능합니다')
    .trim(),

  parentId: z
    .string()
    .cuid('올바른 부모 댓글 ID 형식이 아닙니다')
    .optional()
    .nullable(),
});

/**
 * 댓글 수정 스키마
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(2, '댓글은 최소 2자 이상이어야 합니다')
    .max(5000, '댓글은 최대 5,000자까지 가능합니다')
    .trim(),
});

/**
 * 댓글 타입 (TypeScript 타입 추론)
 */
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
