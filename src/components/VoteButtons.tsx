'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 투표 버튼 컴포넌트
 *
 * 기능:
 * - Upvote/Downvote 버튼
 * - 클라이언트 상태 관리 (투표 상태)
 * - 점수 계산 및 색상 표시
 * - 수직/수평 레이아웃 지원
 * - localStorage 투표 상태 저장
 */

export interface VoteButtonsProps {
  /** 추천 수 */
  upvotes: number;
  /** 비추천 수 */
  downvotes: number;
  /** 레이아웃 방향 */
  orientation?: 'vertical' | 'horizontal';
  /** 크기 */
  size?: 'sm' | 'lg';
  /** 투표 ID (localStorage 키) */
  voteId?: string;
  /** 추가 클래스명 */
  className?: string;
}

type VoteState = 'up' | 'down' | null;

export function VoteButtons({
  upvotes,
  downvotes,
  orientation = 'horizontal',
  size = 'sm',
  voteId,
  className = '',
}: VoteButtonsProps) {
  const [userVote, setUserVote] = useState<VoteState>(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);

  // localStorage에서 투표 상태 불러오기
  useEffect(() => {
    if (voteId && typeof window !== 'undefined') {
      const savedVote = localStorage.getItem(`vote_${voteId}`);
      if (savedVote === 'up' || savedVote === 'down') {
        setUserVote(savedVote);
        // 저장된 투표를 반영한 점수 계산
        if (savedVote === 'up') {
          setLocalUpvotes(upvotes + 1);
        } else {
          setLocalDownvotes(downvotes + 1);
        }
      }
    }
  }, [voteId, upvotes, downvotes]);

  // 투표 핸들러
  const handleVote = (voteType: 'up' | 'down') => {
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newVoteState: VoteState = voteType;

    // 기존 투표 상태에 따라 점수 조정
    if (userVote === voteType) {
      // 같은 버튼 클릭 → 취소
      newVoteState = null;
      if (voteType === 'up') {
        newUpvotes -= 1;
      } else {
        newDownvotes -= 1;
      }
    } else if (userVote === null) {
      // 투표하지 않은 상태 → 새로 투표
      if (voteType === 'up') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
    } else {
      // 다른 투표로 변경 (up ↔ down)
      if (voteType === 'up') {
        newUpvotes += 1;
        newDownvotes -= 1;
      } else {
        newDownvotes += 1;
        newUpvotes -= 1;
      }
    }

    // 상태 업데이트
    setUserVote(newVoteState);
    setLocalUpvotes(newUpvotes);
    setLocalDownvotes(newDownvotes);

    // localStorage에 저장
    if (voteId && typeof window !== 'undefined') {
      if (newVoteState === null) {
        localStorage.removeItem(`vote_${voteId}`);
      } else {
        localStorage.setItem(`vote_${voteId}`, newVoteState);
      }
    }
  };

  const score = localUpvotes - localDownvotes;

  // 수직 레이아웃 (게시글용)
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 min-w-[50px] ${className}`}>
        <button
          className="p-2 rounded hover:bg-accent transition-colors"
          aria-label="추천"
          type="button"
          onClick={() => handleVote('up')}
        >
          <ArrowUp
            className={`${size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${
              userVote === 'up'
                ? 'text-primary fill-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          />
        </button>
        <span
          className={`${size === 'lg' ? 'text-2xl' : 'text-xl'} font-bold ${
            score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : ''
          }`}
        >
          {score}
        </span>
        <button
          className="p-2 rounded hover:bg-accent transition-colors"
          aria-label="비추천"
          type="button"
          onClick={() => handleVote('down')}
        >
          <ArrowDown
            className={`${size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${
              userVote === 'down'
                ? 'text-destructive fill-destructive'
                : 'text-muted-foreground hover:text-destructive'
            }`}
          />
        </button>
      </div>
    );
  }

  // 수평 레이아웃 (댓글용)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => handleVote('up')}
      >
        <ArrowUp
          className={`h-3 w-3 ${
            userVote === 'up' ? 'text-primary fill-primary' : ''
          }`}
        />
      </Button>
      <span
        className={`text-sm font-medium ${
          score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : ''
        }`}
      >
        {score}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => handleVote('down')}
      >
        <ArrowDown
          className={`h-3 w-3 ${
            userVote === 'down' ? 'text-destructive fill-destructive' : ''
          }`}
        />
      </Button>
    </div>
  );
}
