/**
 * 바이브코딩 커뮤니티 플랫폼 - Debounce Hook
 *
 * Phase 3 Week 9 Task 9.4: 검색 성능 최적화
 * 검색 입력 debounce로 성능 향상
 *
 * @see docs/TASKS.md Week 9 Task 9.4
 */

import { useEffect, useState } from 'react';

/**
 * Debounce Hook
 *
 * 값이 변경되어도 지정된 딜레이 동안 대기 후 업데이트
 * 검색 입력 등에서 API 호출 횟수 감소
 *
 * @param value - debounce할 값
 * @param delay - 딜레이 시간 (ms)
 * @returns debounced 값
 *
 * @example
 * ```tsx
 * const [keyword, setKeyword] = useState('');
 * const debouncedKeyword = useDebounce(keyword, 500);
 *
 * useEffect(() => {
 *   // debouncedKeyword가 변경될 때만 검색 실행
 *   search(debouncedKeyword);
 * }, [debouncedKeyword]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 debouncedValue 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 이전 타이머 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
