'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * 검색 바 컴포넌트
 *
 * 기능:
 * - 검색어 입력
 * - 검색 버튼 (Enter 키 지원)
 * - 검색어 초기화 버튼
 * - 실시간 검색 (옵션)
 */

interface SearchBarProps {
  /** 검색어 변경 콜백 */
  onSearch: (keyword: string) => void;
  /** 초기 검색어 */
  initialValue?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 실시간 검색 활성화 */
  liveSearch?: boolean;
}

export function SearchBar({
  onSearch,
  initialValue = '',
  placeholder = '검색어를 입력하세요...',
  liveSearch = false,
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSearch = () => {
    onSearch(keyword.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (liveSearch) {
      // 실시간 검색: 입력 중에도 검색 실행
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* 검색 아이콘 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {/* 초기화 버튼 */}
        {keyword && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 검색 버튼 (실시간 검색이 아닐 때만 표시) */}
      {!liveSearch && (
        <Button onClick={handleSearch} size="default">
          검색
        </Button>
      )}
    </div>
  );
}
