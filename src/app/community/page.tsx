import { permanentRedirect } from 'next/navigation';

/**
 * /community → / 영구 리다이렉트 (301)
 *
 * 블로그형 홈페이지 전환으로 인해
 * 기존 /community 페이지는 홈페이지(/)로 리다이렉트됩니다.
 *
 * 개별 카테고리 페이지는 그대로 유지됩니다:
 * - /community/tips
 * - /community/showcase
 * - /community/free-board
 * - /community/flowcoder-feed
 * - /community/[category]/[postId]
 */
export default function CommunityPage() {
  permanentRedirect('/');
}
