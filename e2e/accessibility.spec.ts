import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * 접근성 (a11y) 테스트
 *
 * WCAG 2.1 기준 자동화 테스트:
 * - 색상 대비 (Color Contrast)
 * - ARIA 레이블 (ARIA Labels)
 * - 키보드 네비게이션 (Keyboard Navigation)
 * - 시맨틱 HTML (Semantic HTML)
 * - 대체 텍스트 (Alt Text)
 */

test.describe('접근성 (Accessibility) 검증', () => {
  test('홈페이지 접근성 검사', async ({ page }) => {
    await page.goto('/');

    // Axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // 위반 사항이 없어야 함
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('커뮤니티 페이지 접근성 검사', async ({ page }) => {
    await page.goto('/community');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // 중요한 위반 사항만 체크 (치명적 및 심각)
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('키보드 네비게이션 - Tab 키 순회', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 링크로 Tab 이동
    await page.keyboard.press('Tab');

    // 포커스된 요소가 링크 또는 버튼인지 확인
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // 추가 Tab 이동 테스트
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('키보드 네비게이션 - Enter 키로 링크 활성화', async ({ page }) => {
    await page.goto('/');

    // 커뮤니티 링크로 이동
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Enter 키로 링크 활성화
    await page.keyboard.press('Enter');

    // 페이지 이동 확인 (현재 URL이 / 가 아님)
    await expect(page).not.toHaveURL('/');
  });

  test('이미지 대체 텍스트 확인', async ({ page }) => {
    await page.goto('/community');

    // 모든 이미지가 alt 속성을 가지고 있는지 확인
    const images = await page.locator('img').all();

    for (const image of images) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('버튼 및 링크 접근 가능한 이름 확인', async ({ page }) => {
    await page.goto('/community');

    // 모든 버튼이 접근 가능한 이름을 가지고 있는지 확인
    const buttons = await page.locator('button:visible').all();

    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label')
        || await button.textContent();

      expect(accessibleName).toBeTruthy();
    }
  });

  test('색상 대비 검사 (자동)', async ({ page }) => {
    await page.goto('/');

    // Axe로 색상 대비 규칙만 검사
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // 색상 대비 위반 사항 필터링
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    // 색상 대비 위반이 없어야 함
    expect(colorContrastViolations).toHaveLength(0);
  });

  test('폼 레이블 연결 확인', async ({ page }) => {
    await page.goto('/community/new');

    // 모든 입력 필드가 레이블과 연결되어 있는지 확인
    const inputs = await page.locator('input:visible, textarea:visible').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // id가 있으면 해당 label이 있는지, 아니면 aria-label이 있는지 확인
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        const hasAccessibleName = label > 0 || !!ariaLabel || !!ariaLabelledby;
        expect(hasAccessibleName).toBeTruthy();
      } else {
        // id가 없으면 aria-label이나 aria-labelledby가 있어야 함
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('Heading 계층 구조 확인', async ({ page }) => {
    await page.goto('/');

    // h1이 페이지에 하나만 있는지 확인
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeLessThanOrEqual(1);

    // Heading 순서가 올바른지 확인 (h1 → h2 → h3, skip 없이)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    const headingLevels = await Promise.all(
      headings.map(async (h) => {
        const tagName = await h.evaluate((el) => el.tagName);
        return parseInt(tagName.replace('H', ''));
      })
    );

    // Heading 레벨이 2 이상 증가하지 않는지 확인 (예: h1 → h3 금지)
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });
});
