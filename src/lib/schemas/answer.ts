import { z } from 'zod';

/**
 * 답변 작성 스키마
 */
export const createAnswerSchema = z.object({
  content: z
    .string()
    .min(20, '답변은 최소 20자 이상이어야 합니다')
    .max(50000, '답변은 최대 50,000자까지 가능합니다')
    .trim(),

  questionId: z
    .string()
    .cuid('올바른 질문 ID 형식이 아닙니다'),
});

/**
 * 답변 수정 스키마
 */
export const updateAnswerSchema = z.object({
  content: z
    .string()
    .min(20, '답변은 최소 20자 이상이어야 합니다')
    .max(50000, '답변은 최대 50,000자까지 가능합니다')
    .trim(),
});

/**
 * 답변 채택 스키마
 */
export const acceptAnswerSchema = z.object({
  answerId: z
    .string()
    .cuid('올바른 답변 ID 형식이 아닙니다'),
});

/**
 * 답변 타입 (TypeScript 타입 추론)
 */
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type UpdateAnswerInput = z.infer<typeof updateAnswerSchema>;
export type AcceptAnswerInput = z.infer<typeof acceptAnswerSchema>;
