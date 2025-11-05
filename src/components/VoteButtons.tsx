'use client';

import { useEffect, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 투표 버튼 컴포넌트
 *
 * 기능:
 * - Upvote/Downvote 버튼
 * - 클라이언트 또는 서버 상태 관리 (투표 상태)
 * - 점수 계산 및 색상 표시
 * - 수직/수평 레이아웃 지원
 * - localStorage 또는 API 기반 투표 유지
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
  /** 서버 기반 투표를 위한 대상 타입 */
  targetType?: 'post' | 'comment' | 'answer';
  /** 서버 기반 투표를 위한 대상 ID */
  targetId?: string;
  /** 초기 투표 상태 (서버 렌더링 시 전달) */
  initialVote?: VoteState;
}

type VoteState = 'up' | 'down' | null;

type ServerVoteResponse = {
  upvotes: number;
  downvotes: number;
  userVote: 'UP' | 'DOWN' | null;
};

type VoteApiResponse =
  | { success: true; data: ServerVoteResponse }
  | { success: false; error: string };

export function VoteButtons({
  upvotes,
  downvotes,
  orientation = 'horizontal',
  size = 'sm',
  voteId,
  className = '',
  targetType,
  targetId,
  initialVote = null,
}: VoteButtonsProps) {
  const usesServerVoting = targetType === 'post' && Boolean(targetId);

  const [userVote, setUserVote] = useState<VoteState>(initialVote ?? null);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 최신 props를 상태에 반영
  useEffect(() => {
    setLocalUpvotes(upvotes);
    setLocalDownvotes(downvotes);
  }, [upvotes, downvotes]);

  // 서버에서 전달 받은 초기 투표 상태 동기화
  useEffect(() => {
    if (usesServerVoting) {
      setUserVote(initialVote ?? null);
    }
  }, [usesServerVoting, initialVote]);

  // localStorage 기반 투표 복원
  useEffect(() => {
    if (usesServerVoting || !voteId || typeof window === 'undefined') {
      return;
    }

    const savedVote = localStorage.getItem(`vote_${voteId}`);
    if (savedVote === 'up' || savedVote === 'down') {
      setUserVote(savedVote);
      if (savedVote === 'up') {
        setLocalUpvotes(upvotes + 1);
      } else {
        setLocalDownvotes(downvotes + 1);
      }
    } else {
      setUserVote(null);
    }
  }, [usesServerVoting, voteId, upvotes, downvotes]);

  const score = localUpvotes - localDownvotes;
  const disabled = usesServerVoting && isPending;

  const handleServerVote = (voteType: Exclude<VoteState, null>) => {
    if (!targetId) {
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch(`/api/posts/${targetId}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voteType: voteType === 'up' ? 'UP' : 'DOWN' }),
        });

        const payload = (await response
          .json()
          .catch(() => null)) as VoteApiResponse | null;

        if (!response.ok || !payload || payload.success !== true) {
          const message =
            payload && payload.success === false
              ? payload.error
              : '투표 처리에 실패했습니다.';
          setError(message);
          return;
        }

        const data = payload.data;

        setLocalUpvotes(data.upvotes);
        setLocalDownvotes(data.downvotes);
        setUserVote(
          data.userVote === 'UP' ? 'up' : data.userVote === 'DOWN' ? 'down' : null
        );
      } catch (networkError) {
        console.error('Vote request failed', networkError);
        setError('투표 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    });
  };

  const handleLocalVote = (voteType: Exclude<VoteState, null>) => {
    let newVoteState: VoteState = voteType;
    let newUpvotes = localUpvotes;
    let newDownvotes = localDownvotes;

    if (userVote === voteType) {
      newVoteState = null;
      if (voteType === 'up') {
        newUpvotes = Math.max(0, newUpvotes - 1);
      } else {
        newDownvotes = Math.max(0, newDownvotes - 1);
      }
    } else if (userVote === null) {
      if (voteType === 'up') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
    } else {
      if (voteType === 'up') {
        newUpvotes += 1;
        newDownvotes = Math.max(0, newDownvotes - 1);
      } else {
        newDownvotes += 1;
        newUpvotes = Math.max(0, newUpvotes - 1);
      }
    }

    setUserVote(newVoteState);
    setLocalUpvotes(newUpvotes);
    setLocalDownvotes(newDownvotes);

    if (voteId && typeof window !== 'undefined') {
      if (newVoteState === null) {
        localStorage.removeItem(`vote_${voteId}`);
      } else {
        localStorage.setItem(`vote_${voteId}`, newVoteState);
      }
    }
  };

  const handleVote = (voteType: Exclude<VoteState, null>) => {
    if (usesServerVoting) {
      handleServerVote(voteType);
    } else {
      handleLocalVote(voteType);
    }
  };

  const renderErrorMessage = () =>
    error ? (
      <span className="sr-only" aria-live="assertive">
        {error}
      </span>
    ) : null;

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 min-w-[50px] ${className}`}>
        <button
          className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
          aria-label="추천"
          type="button"
          onClick={() => handleVote('up')}
          disabled={disabled}
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
          className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
          aria-label="비추천"
          type="button"
          onClick={() => handleVote('down')}
          disabled={disabled}
        >
          <ArrowDown
            className={`${size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${
              userVote === 'down'
                ? 'text-destructive fill-destructive'
                : 'text-muted-foreground hover:text-destructive'
            }`}
          />
        </button>
        {renderErrorMessage()}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => handleVote('up')}
        disabled={disabled}
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
        disabled={disabled}
      >
        <ArrowDown
          className={`h-3 w-3 ${
            userVote === 'down' ? 'text-destructive fill-destructive' : ''
          }`}
        />
      </Button>
      {renderErrorMessage()}
    </div>
  );
}
