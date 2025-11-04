/**
 * 바이브코딩 커뮤니티 플랫폼 - Zustand 전역 상태 관리
 *
 * Phase 3 Week 8: 클라이언트 상태 관리
 * localStorage persist로 새로고침 시에도 상태 유지
 *
 * @see docs/TASKS.md Week 8 Task 8.1
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  mockUsers,
  mockCategories,
  mockPosts,
  mockComments,
  mockAnswers,
  mockNotifications,
} from './mock-data';
import type {
  User,
  PostWithAuthor,
  CommentWithAuthor,
  AnswerWithAuthor,
  Vote,
  Category,
  Notification,
} from './types';

// ─────────────────────────────────────────────────────────────────
// Store 인터페이스 정의
// ─────────────────────────────────────────────────────────────────

interface AppStore {
  // ===== State =====
  /** 현재 로그인한 사용자 */
  currentUser: User | null;

  /** 사용자 목록 (Mock 데이터 + 신규 가입자) */
  users: User[];

  /** 카테고리 목록 */
  categories: Category[];

  /** 게시글 목록 (Mock 데이터 + localStorage 생성 게시글) */
  posts: PostWithAuthor[];

  /** 댓글 목록 (Mock 데이터 + localStorage 생성 댓글) */
  comments: CommentWithAuthor[];

  /** 답변 목록 (Q&A 전용) */
  answers: AnswerWithAuthor[];

  /** 투표 기록 (사용자별 투표 이력) */
  votes: Vote[];

  /** 알림 목록 */
  notifications: Notification[];

  // ===== Actions - User =====
  /**
   * 현재 사용자 설정 (로그인/로그아웃)
   */
  setCurrentUser: (user: User | null) => void;

  // ===== Actions - Posts =====
  /**
   * 게시글 생성
   * @param post - 생성할 게시글 (PostWithAuthor 형식)
   */
  addPost: (post: PostWithAuthor) => void;

  /**
   * 게시글 수정
   * @param id - 게시글 ID
   * @param data - 수정할 데이터 (부분 업데이트)
   */
  updatePost: (id: string, data: Partial<PostWithAuthor>) => void;

  /**
   * 게시글 삭제
   * @param id - 게시글 ID
   */
  deletePost: (id: string) => void;

  /**
   * 게시글 조회수 증가
   * @param id - 게시글 ID
   */
  incrementPostViews: (id: string) => void;

  // ===== Actions - Comments =====
  /**
   * 댓글 작성
   * @param comment - 생성할 댓글 (CommentWithAuthor 형식)
   */
  addComment: (comment: CommentWithAuthor) => void;

  /**
   * 댓글 수정
   * @param id - 댓글 ID
   * @param content - 수정할 내용
   */
  updateComment: (id: string, content: string) => void;

  /**
   * 댓글 삭제
   * @param id - 댓글 ID
   */
  deleteComment: (id: string) => void;

  // ===== Actions - Answers =====
  /**
   * 답변 작성
   * @param answer - 생성할 답변 (AnswerWithAuthor 형식)
   */
  addAnswer: (answer: AnswerWithAuthor) => void;

  /**
   * 답변 수정
   * @param id - 답변 ID
   * @param content - 수정할 내용
   */
  updateAnswer: (id: string, content: string) => void;

  /**
   * 답변 채택
   * @param questionId - 질문 ID
   * @param answerId - 채택할 답변 ID
   */
  acceptAnswer: (questionId: string, answerId: string) => void;

  // ===== Actions - Votes =====
  /**
   * 투표 (게시글/댓글/답변)
   * @param vote - 투표 정보
   */
  addVote: (vote: Vote) => void;

  /**
   * 투표 취소
   * @param userId - 사용자 ID
   * @param targetId - 투표 대상 ID (postId, commentId, answerId)
   * @param targetType - 투표 대상 타입
   */
  removeVote: (userId: string, targetId: string, targetType: 'post' | 'comment' | 'answer') => void;

  /**
   * 사용자의 특정 대상에 대한 투표 조회
   */
  getUserVote: (userId: string, targetId: string) => Vote | undefined;

  // ===== Actions - Notifications =====
  /**
   * 알림을 읽음으로 표시
   * @param id - 알림 ID
   */
  markNotificationRead: (id: string) => void;

  /**
   * 모든 알림을 읽음으로 표시
   */
  markAllNotificationsRead: () => void;

  /**
   * 새 알림 추가
   * @param notification - 알림 정보
   */
  addNotification: (notification: Notification) => void;
}

// ─────────────────────────────────────────────────────────────────
// Zustand Store 생성 (persist middleware 적용)
// ─────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ===== 초기 상태 (Mock 데이터) =====
      currentUser: null,
      users: mockUsers,
      categories: mockCategories,
      posts: mockPosts,
      comments: mockComments,
      answers: mockAnswers,
      votes: [],
      notifications: mockNotifications,

      // ===== User Actions =====
      setCurrentUser: (user) =>
        set({
          currentUser: user,
        }),

      // ===== Post Actions =====
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      updatePost: (id, data) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...data, updatedAt: new Date().toISOString() } : post
          ),
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
          comments: state.comments.filter((comment) => comment.postId !== id),
        })),

      incrementPostViews: (id) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, viewCount: post.viewCount + 1 } : post
          ),
        })),

      // ===== Comment Actions =====
      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
          posts: state.posts.map((post) =>
            post.id === comment.postId
              ? { ...post, commentCount: post.commentCount + 1 }
              : post
          ),
        })),

      updateComment: (id, content) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === id
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment
          ),
        })),

      deleteComment: (id) =>
        set((state) => {
          const comment = state.comments.find((c) => c.id === id);
          return {
            comments: state.comments.filter((c) => c.id !== id),
            posts: comment
              ? state.posts.map((post) =>
                  post.id === comment.postId
                    ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
                    : post
                )
              : state.posts,
          };
        }),

      // ===== Answer Actions =====
      addAnswer: (answer) =>
        set((state) => ({
          answers: [...state.answers, answer],
        })),

      updateAnswer: (id, content) =>
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer.id === id
              ? { ...answer, content, updatedAt: new Date().toISOString() }
              : answer
          ),
        })),

      acceptAnswer: (questionId, answerId) =>
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer.questionId === questionId
              ? { ...answer, isAccepted: answer.id === answerId }
              : answer
          ),
        })),

      // ===== Vote Actions =====
      addVote: (vote) =>
        set((state) => {
          const { postId, commentId, answerId, voteType } = vote;

          return {
            votes: [...state.votes, vote],
            posts: postId
              ? state.posts.map((post) =>
                  post.id === postId
                    ? {
                        ...post,
                        upvotes: voteType === 'UP' ? post.upvotes + 1 : post.upvotes,
                        downvotes: voteType === 'DOWN' ? post.downvotes + 1 : post.downvotes,
                      }
                    : post
                )
              : state.posts,
            comments: commentId
              ? state.comments.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        upvotes: voteType === 'UP' ? comment.upvotes + 1 : comment.upvotes,
                        downvotes: voteType === 'DOWN' ? comment.downvotes + 1 : comment.downvotes,
                      }
                    : comment
                )
              : state.comments,
            answers: answerId
              ? state.answers.map((answer) =>
                  answer.id === answerId
                    ? {
                        ...answer,
                        upvotes: voteType === 'UP' ? answer.upvotes + 1 : answer.upvotes,
                      }
                    : answer
                )
              : state.answers,
          };
        }),

      removeVote: (userId, targetId, targetType) =>
        set((state) => {
          const voteToRemove = state.votes.find(
            (v) =>
              v.userId === userId &&
              ((targetType === 'post' && v.postId === targetId) ||
                (targetType === 'comment' && v.commentId === targetId) ||
                (targetType === 'answer' && v.answerId === targetId))
          );

          if (!voteToRemove) return state;

          return {
            votes: state.votes.filter((v) => v.id !== voteToRemove.id),
            posts:
              targetType === 'post'
                ? state.posts.map((post) =>
                    post.id === targetId
                      ? {
                          ...post,
                          upvotes:
                            voteToRemove.voteType === 'UP'
                              ? Math.max(0, post.upvotes - 1)
                              : post.upvotes,
                          downvotes:
                            voteToRemove.voteType === 'DOWN'
                              ? Math.max(0, post.downvotes - 1)
                              : post.downvotes,
                        }
                      : post
                  )
                : state.posts,
            comments:
              targetType === 'comment'
                ? state.comments.map((comment) =>
                    comment.id === targetId
                      ? {
                          ...comment,
                          upvotes:
                            voteToRemove.voteType === 'UP'
                              ? Math.max(0, comment.upvotes - 1)
                              : comment.upvotes,
                          downvotes:
                            voteToRemove.voteType === 'DOWN'
                              ? Math.max(0, comment.downvotes - 1)
                              : comment.downvotes,
                        }
                      : comment
                  )
                : state.comments,
            answers:
              targetType === 'answer'
                ? state.answers.map((answer) =>
                    answer.id === targetId
                      ? {
                          ...answer,
                          upvotes:
                            voteToRemove.voteType === 'UP'
                              ? Math.max(0, answer.upvotes - 1)
                              : answer.upvotes,
                        }
                      : answer
                  )
                : state.answers,
          };
        }),

      getUserVote: (userId, targetId) => {
        const state = get();
        return state.votes.find(
          (v) =>
            v.userId === userId &&
            (v.postId === targetId || v.commentId === targetId || v.answerId === targetId)
        );
      },

      // ===== Notification Actions =====
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
    }),
    {
      name: 'vibe-coding-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 특정 필드만 localStorage에 저장
        currentUser: state.currentUser,
        posts: state.posts,
        comments: state.comments,
        answers: state.answers,
        votes: state.votes,
        notifications: state.notifications,
        // users, categories는 Mock 데이터로 유지 (저장 안 함)
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────
// Selector Hooks (성능 최적화용)
// ─────────────────────────────────────────────────────────────────

/**
 * 현재 사용자 조회
 */
export const useCurrentUser = () => useAppStore((state) => state.currentUser);

/**
 * 게시글 목록 조회
 */
export const usePosts = () => useAppStore((state) => state.posts);

/**
 * 댓글 목록 조회
 */
export const useComments = () => useAppStore((state) => state.comments);

/**
 * 카테고리 목록 조회
 */
export const useCategories = () => useAppStore((state) => state.categories);

/**
 * 알림 목록 조회
 */
export const useNotifications = () => useAppStore((state) => state.notifications);

/**
 * 읽지 않은 알림 수 조회
 */
export const useUnreadNotificationCount = () =>
  useAppStore((state) => state.notifications.filter((n) => !n.read).length);
