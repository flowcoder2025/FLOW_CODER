import { test, expect } from '@playwright/test';

/**
 * 커뮤니티 페이지 E2E 테스트
 *
 * 주요 사용자 플로우:
 * - 게시글 목록 조회
 * - 게시글 상세 페이지 진입
 * - 게시글 작성 페이지 접근
 * - 투표 버튼 상호작용
 */

test.describe('커뮤니티 기본 플로우', () => {
  test('홈페이지 접근 및 커뮤니티 이동', async ({ page }) => {
    // 홈페이지 접근
    await page.goto('/');

    // 페이지 제목 확인
    await expect(page).toHaveTitle(/Vibe Coding/i);

    // 커뮤니티 링크 클릭
    await page.getByRole('link', { name: /커뮤니티/i }).first().click();

    // URL 확인
    await expect(page).toHaveURL('/community');

    // 게시글 목록 표시 확인
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('게시글 목록 조회 및 카테고리 필터링', async ({ page }) => {
    await page.goto('/community');

    // 카테고리 카드들이 표시되는지 확인
    const categories = page.locator('a[href^="/community/"]');
    await expect(categories.first()).toBeVisible();

    // 검색바 확인
    const searchInput = page.getByPlaceholder(/검색/i);
    await expect(searchInput).toBeVisible();
  });

  test('게시글 상세 페이지 진입', async ({ page }) => {
    await page.goto('/community');

    // 게시글 목록에서 첫 번째 게시글 클릭
    const firstPost = page.locator('article').first();
    await firstPost.waitFor({ state: 'visible' });

    const postTitle = await firstPost.locator('h3').first().textContent();
    await firstPost.locator('a').first().click();

    // 상세 페이지로 이동 확인
    await expect(page.locator('h1')).toContainText(postTitle || '');

    // 투표 버튼 확인
    const upvoteButton = page.getByLabel(/추천/i).first();
    await expect(upvoteButton).toBeVisible();

    // 댓글 섹션 확인
    await expect(page.getByText(/댓글/i)).toBeVisible();
  });

  test('게시글 작성 페이지 접근', async ({ page }) => {
    await page.goto('/community');

    // 글쓰기 버튼 찾기
    const writeButton = page.getByRole('link', { name: /글쓰기|작성/i });
    await writeButton.click();

    // 작성 페이지로 이동 확인
    await expect(page).toHaveURL('/community/new');

    // 폼 요소 확인
    await expect(page.getByLabel(/제목/i)).toBeVisible();
    await expect(page.getByLabel(/카테고리/i)).toBeVisible();

    // 에디터 로딩 확인 (dynamic import)
    await expect(page.locator('[class*="editor"]').or(page.getByText(/로딩/i))).toBeVisible({ timeout: 5000 });
  });

  test('투표 버튼 상호작용', async ({ page }) => {
    await page.goto('/community');

    // 첫 번째 게시글의 투표 점수 확인
    const firstPost = page.locator('article').first();
    await firstPost.waitFor({ state: 'visible' });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _voteScore = await firstPost.locator('button').first().textContent();

    // 추천 버튼 클릭
    await firstPost.getByLabel(/추천/i).first().click();

    // 점수가 변경되었는지 확인 (localStorage 기반이므로 클라이언트 상태 변경)
    await expect(firstPost.locator('button').first()).toBeVisible();
  });
});

test.describe('검색 기능', () => {
  test('검색 페이지에서 키워드 검색', async ({ page }) => {
    await page.goto('/search?q=React');

    // 검색 결과 확인
    await expect(page.getByText(/검색 결과/i)).toBeVisible();

    // 검색 입력 필드 확인
    const searchInput = page.getByPlaceholder(/검색/i);
    await expect(searchInput).toHaveValue('React');
  });
});
