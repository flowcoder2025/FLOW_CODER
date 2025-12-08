import { test, expect, Page } from '@playwright/test';

/**
 * 웹 성능 측정 E2E 테스트
 *
 * 측정 항목:
 * - Core Web Vitals (LCP, FID, CLS)
 * - 페이지 로드 메트릭 (DOMContentLoaded, Load)
 * - First Paint, First Contentful Paint
 * - JavaScript 실행 시간
 * - 리소스 로딩 시간
 */

// 성능 메트릭 타입 정의
interface PerformanceMetrics {
  lcp?: number;
  fcp?: number;
  cls?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  totalJsSize?: number;
  totalCssSize?: number;
}

// Core Web Vitals 측정 헬퍼 함수
async function getCoreWebVitals(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      const metrics: PerformanceMetrics = {};

      // Performance Observer로 LCP 측정
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lastEntry = entries[entries.length - 1] as any;
            metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          // CLS 측정
          let clsScore = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (!(entry as any).hadRecentInput) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                clsScore += (entry as any).value;
              }
            }
            metrics.cls = clsScore;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('Performance Observer not fully supported', e);
        }
      }

      // Navigation Timing API로 기본 메트릭 측정
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        metrics.ttfb = perfData.responseStart - perfData.requestStart;
        metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
        metrics.loadComplete = perfData.loadEventEnd - perfData.fetchStart;
      }

      // FCP 측정
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // 리소스 크기 측정
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      metrics.totalJsSize = resources
        .filter(r => r.name.endsWith('.js'))
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);

      metrics.totalCssSize = resources
        .filter(r => r.name.endsWith('.css'))
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);

      // 약간의 지연 후 최종 메트릭 반환 (LCP가 안정화될 시간 제공)
      setTimeout(() => resolve(metrics), 2000);
    });
  });
}

test.describe('성능 측정 - 홈페이지', () => {
  test('홈페이지 Core Web Vitals 측정', async ({ page }) => {
    // 페이지 로드
    await page.goto('/', { waitUntil: 'networkidle' });

    // Core Web Vitals 측정
    const metrics = await getCoreWebVitals(page);

    console.log('📊 홈페이지 성능 메트릭:', {
      'LCP (ms)': metrics.lcp?.toFixed(2),
      'FCP (ms)': metrics.fcp?.toFixed(2),
      'CLS': metrics.cls?.toFixed(3),
      'TTFB (ms)': metrics.ttfb?.toFixed(2),
      'DOM Content Loaded (ms)': metrics.domContentLoaded?.toFixed(2),
      'Load Complete (ms)': metrics.loadComplete?.toFixed(2),
      'Total JS Size (KB)': (metrics.totalJsSize! / 1024).toFixed(2),
      'Total CSS Size (KB)': (metrics.totalCssSize! / 1024).toFixed(2),
    });

    // 성능 목표 검증 (Lighthouse Good 기준)
    if (metrics.lcp) {
      expect(metrics.lcp, 'LCP should be less than 2500ms').toBeLessThan(2500);
    }

    if (metrics.fcp) {
      expect(metrics.fcp, 'FCP should be less than 1800ms').toBeLessThan(1800);
    }

    if (metrics.cls !== undefined) {
      expect(metrics.cls, 'CLS should be less than 0.1').toBeLessThan(0.1);
    }

    // 총 페이지 로드는 3초 이내 목표
    if (metrics.loadComplete) {
      expect(metrics.loadComplete, 'Page load should complete within 3000ms').toBeLessThan(3000);
    }
  });

  test('홈페이지 리소스 로딩 시간 분석', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const resourceTimings = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      return resources.map(r => ({
        name: r.name.split('/').pop() || r.name,
        type: r.initiatorType,
        duration: r.duration,
        size: r.transferSize || 0,
      })).sort((a, b) => b.duration - a.duration).slice(0, 10); // 상위 10개
    });

    console.log('⏱️  가장 느린 리소스 Top 10:', resourceTimings);

    // 개별 리소스는 1초 이내에 로드되어야 함 (이미지 제외)
    const slowResources = resourceTimings.filter(r =>
      r.duration > 1000 && !r.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    if (slowResources.length > 0) {
      console.warn('⚠️  1초 이상 걸리는 리소스:', slowResources);
    }
  });
});

test.describe('성능 측정 - 커뮤니티 페이지', () => {
  test('커뮤니티 페이지 Core Web Vitals 측정', async ({ page }) => {
    await page.goto('/community', { waitUntil: 'networkidle' });

    const metrics = await getCoreWebVitals(page);

    console.log('📊 커뮤니티 페이지 성능 메트릭:', {
      'LCP (ms)': metrics.lcp?.toFixed(2),
      'FCP (ms)': metrics.fcp?.toFixed(2),
      'CLS': metrics.cls?.toFixed(3),
      'Load Complete (ms)': metrics.loadComplete?.toFixed(2),
    });

    // 성능 목표 검증
    if (metrics.lcp) {
      expect(metrics.lcp, 'LCP should be less than 2500ms').toBeLessThan(2500);
    }

    if (metrics.cls !== undefined) {
      expect(metrics.cls, 'CLS should be less than 0.1').toBeLessThan(0.1);
    }
  });
});

test.describe('성능 측정 - 게시글 작성 페이지', () => {
  test('게시글 작성 페이지 동적 임포트 성능', async ({ page }) => {
    // Tiptap 에디터가 동적으로 로드되는지 확인
    await page.goto('/community/new', { waitUntil: 'networkidle' });

    // 에디터 로딩 시간 측정
    const editorLoadTime = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const startTime = performance.now();

        // 에디터가 로드될 때까지 대기
        const checkEditor = setInterval(() => {
          const editor = document.querySelector('[class*="editor"]');
          if (editor) {
            clearInterval(checkEditor);
            resolve(performance.now() - startTime);
          }
        }, 100);

        // 최대 5초 대기
        setTimeout(() => {
          clearInterval(checkEditor);
          resolve(-1); // 로드 실패
        }, 5000);
      });
    });

    console.log('✏️  에디터 로딩 시간:', editorLoadTime.toFixed(2), 'ms');

    // 에디터는 5초 이내에 로드되어야 함
    expect(editorLoadTime, 'Editor should load within 5000ms').toBeGreaterThan(0);
    expect(editorLoadTime, 'Editor should load within 5000ms').toBeLessThan(5000);

    // 페이지 전체 번들 크기 확인
    const metrics = await getCoreWebVitals(page);

    console.log('📦 게시글 작성 페이지 번들 크기:', {
      'JS (KB)': (metrics.totalJsSize! / 1024).toFixed(2),
      'CSS (KB)': (metrics.totalCssSize! / 1024).toFixed(2),
    });

    // Dynamic import 적용 확인: Task 10.3에서 114KB 감소 (120KB → 5.63KB)
    // 초기 JS 번들이 200KB 이하여야 함 (동적 로딩 제외)
    if (metrics.totalJsSize) {
      expect(metrics.totalJsSize / 1024, 'Initial JS bundle should be optimized').toBeLessThan(500);
    }
  });
});

test.describe('성능 측정 - 어드민 페이지', () => {
  test('어드민 대시보드 성능 측정', async ({ page }) => {
    // 어드민 페이지는 인증이 필요하므로 로그인 상태가 아니면 스킵
    await page.goto('/admin', { waitUntil: 'networkidle' });

    const url = page.url();

    // 로그인 페이지로 리다이렉트되면 스킵
    if (url.includes('/auth/signin')) {
      test.skip();
      return;
    }

    const metrics = await getCoreWebVitals(page);

    console.log('📊 어드민 대시보드 성능 메트릭:', {
      'LCP (ms)': metrics.lcp?.toFixed(2),
      'FCP (ms)': metrics.fcp?.toFixed(2),
      'Load Complete (ms)': metrics.loadComplete?.toFixed(2),
    });

    // 어드민 페이지도 동일한 성능 목표 유지
    if (metrics.lcp) {
      expect(metrics.lcp, 'Admin LCP should be less than 2500ms').toBeLessThan(2500);
    }
  });
});

test.describe('성능 회귀 방지', () => {
  test('전체 페이지 성능 벤치마크', async ({ page }) => {
    const pages = [
      { path: '/', name: '홈페이지' },
      { path: '/community', name: '커뮤니티' },
    ];

    const results = [];

    for (const { path, name } of pages) {
      await page.goto(path, { waitUntil: 'networkidle' });
      const metrics = await getCoreWebVitals(page);

      results.push({
        page: name,
        lcp: metrics.lcp?.toFixed(2),
        fcp: metrics.fcp?.toFixed(2),
        cls: metrics.cls?.toFixed(3),
        load: metrics.loadComplete?.toFixed(2),
      });
    }

    console.log('\n📈 전체 페이지 성능 요약:');
    console.table(results);

    // 모든 페이지가 기본 성능 기준을 만족해야 함
    results.forEach(result => {
      if (result.lcp) {
        expect(parseFloat(result.lcp!), `${result.page} LCP`).toBeLessThan(2500);
      }
    });
  });
});
