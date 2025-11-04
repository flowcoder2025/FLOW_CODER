/**
 * 바이브코딩 커뮤니티 플랫폼 - Auto Save Hook
 *
 * Phase 3 Week 8 Task 8.5: 임시 저장 기능
 * 게시글/댓글 작성 중 자동 저장 및 복원
 *
 * @see docs/TASKS.md Week 8 Task 8.5
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface UseAutoSaveOptions {
  /**
   * localStorage 키 (예: 'draft-post', 'draft-comment')
   */
  key: string;

  /**
   * 자동 저장 딜레이 (ms)
   * @default 1000
   */
  delay?: number;

  /**
   * 저장 성공 시 콜백
   */
  onSave?: () => void;

  /**
   * 저장 실패 시 콜백
   */
  onError?: (error: Error) => void;
}

interface UseAutoSaveReturn<T> {
  /**
   * 저장된 데이터 (초기 로드 시)
   */
  savedData: T | null;

  /**
   * 저장 중 상태
   */
  isSaving: boolean;

  /**
   * 마지막 저장 시간
   */
  lastSavedAt: Date | null;

  /**
   * 수동으로 데이터 저장
   */
  save: (data: T) => void;

  /**
   * 저장된 데이터 초기화 (삭제)
   */
  clear: () => void;

  /**
   * 저장된 데이터 불러오기
   */
  restore: () => T | null;
}

// ─────────────────────────────────────────────────────────────────
// Hook Implementation
// ─────────────────────────────────────────────────────────────────

/**
 * Auto Save Hook
 *
 * localStorage를 사용하여 입력 데이터를 자동으로 저장하고 복원합니다.
 *
 * @example
 * ```tsx
 * const { savedData, isSaving, save, clear } = useAutoSave<PostDraft>({
 *   key: 'draft-post',
 *   delay: 1000,
 *   onSave: () => toast.success('저장됨'),
 * });
 *
 * // 초기값 설정 (저장된 데이터 복원)
 * useEffect(() => {
 *   if (savedData) {
 *     setTitle(savedData.title);
 *     setContent(savedData.content);
 *   }
 * }, [savedData]);
 *
 * // 입력 변경 시 자동 저장
 * useEffect(() => {
 *   save({ title, content, tags });
 * }, [title, content, tags]);
 * ```
 */
export function useAutoSave<T = unknown>({
  key,
  delay = 1000,
  onSave,
  onError,
}: UseAutoSaveOptions): UseAutoSaveReturn<T> {
  const [savedData, setSavedData] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ===== 초기 로드: localStorage에서 데이터 복원 =====
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedData(parsed.data);
        setLastSavedAt(new Date(parsed.timestamp));
      }
    } catch (error) {
      console.error(`[useAutoSave] Failed to restore data for key "${key}":`, error);
      onError?.(error as Error);
    }
  }, [key, onError]);

  // ===== 저장 함수 (Debounced) =====
  const save = useCallback(
    (data: T) => {
      // 기존 타이머 취소
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // 새 타이머 설정
      timerRef.current = setTimeout(() => {
        try {
          setIsSaving(true);

          const payload = {
            data,
            timestamp: new Date().toISOString(),
          };

          localStorage.setItem(key, JSON.stringify(payload));

          setSavedData(data);
          setLastSavedAt(new Date());
          setIsSaving(false);

          onSave?.();
        } catch (error) {
          console.error(`[useAutoSave] Failed to save data for key "${key}":`, error);
          setIsSaving(false);
          onError?.(error as Error);
        }
      }, delay);
    },
    [key, delay, onSave, onError]
  );

  // ===== 초기화 함수 (삭제) =====
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setSavedData(null);
      setLastSavedAt(null);

      // 진행 중인 타이머도 취소
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      console.error(`[useAutoSave] Failed to clear data for key "${key}":`, error);
      onError?.(error as Error);
    }
  }, [key, onError]);

  // ===== 복원 함수 =====
  const restore = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error(`[useAutoSave] Failed to restore data for key "${key}":`, error);
      onError?.(error as Error);
      return null;
    }
  }, [key, onError]);

  // ===== Cleanup: 컴포넌트 언마운트 시 타이머 정리 =====
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    savedData,
    isSaving,
    lastSavedAt,
    save,
    clear,
    restore,
  };
}

// ─────────────────────────────────────────────────────────────────
// Helper Hook: 게시글 임시 저장 (Specialized)
// ─────────────────────────────────────────────────────────────────

export interface PostDraft {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
}

/**
 * 게시글 작성 전용 Auto Save Hook
 *
 * @example
 * ```tsx
 * const { savedDraft, save, clear } = usePostDraftAutoSave('new-post');
 *
 * useEffect(() => {
 *   if (savedDraft) {
 *     setTitle(savedDraft.title);
 *     setContent(savedDraft.content);
 *   }
 * }, [savedDraft]);
 *
 * useEffect(() => {
 *   save({ title, content, categoryId, tags });
 * }, [title, content, categoryId, tags]);
 * ```
 */
export function usePostDraftAutoSave(draftId: string) {
  const { savedData, isSaving, lastSavedAt, save, clear, restore } = useAutoSave<PostDraft>({
    key: `draft-post-${draftId}`,
    delay: 1000,
  });

  return {
    savedDraft: savedData,
    isSaving,
    lastSavedAt,
    saveDraft: save,
    clearDraft: clear,
    restoreDraft: restore,
  };
}

// ─────────────────────────────────────────────────────────────────
// Helper Hook: 댓글 임시 저장 (Specialized)
// ─────────────────────────────────────────────────────────────────

export interface CommentDraft {
  content: string;
  postId: string;
  parentId?: string;
}

/**
 * 댓글 작성 전용 Auto Save Hook
 *
 * @example
 * ```tsx
 * const { savedDraft, save, clear } = useCommentDraftAutoSave(postId);
 *
 * useEffect(() => {
 *   if (savedDraft) {
 *     setContent(savedDraft.content);
 *   }
 * }, [savedDraft]);
 *
 * useEffect(() => {
 *   save({ content, postId });
 * }, [content, postId]);
 * ```
 */
export function useCommentDraftAutoSave(postId: string, parentId?: string) {
  const key = parentId ? `draft-comment-${postId}-${parentId}` : `draft-comment-${postId}`;

  const { savedData, isSaving, lastSavedAt, save, clear, restore } = useAutoSave<CommentDraft>({
    key,
    delay: 500, // 댓글은 더 짧은 딜레이
  });

  return {
    savedDraft: savedData,
    isSaving,
    lastSavedAt,
    saveDraft: save,
    clearDraft: clear,
    restoreDraft: restore,
  };
}
