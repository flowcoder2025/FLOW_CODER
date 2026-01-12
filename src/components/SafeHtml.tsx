'use client';

import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useEffect, useState } from 'react';

/**
 * SafeHtml 컴포넌트
 *
 * XSS 공격을 방지하면서 HTML 콘텐츠를 안전하게 렌더링합니다.
 * - marked를 사용하여 마크다운 테이블을 HTML로 변환
 * - DOMPurify를 사용하여 위험한 태그와 속성을 제거합니다.
 *
 * 허용되는 태그:
 * - 텍스트 포맷: p, br, strong, em, u, s, code, pre, blockquote
 * - 헤딩: h1, h2, h3, h4, h5, h6
 * - 리스트: ul, ol, li
 * - 링크: a (href만 허용, target="_blank" 자동 추가)
 * - 이미지: img (src, alt만 허용)
 * - 테이블: table, thead, tbody, tr, th, td
 * - 기타: div, span, hr
 */

interface SafeHtmlProps {
  /** HTML 문자열 */
  html: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 첫 번째 이미지/figure 제거 (커버 이미지와 중복 방지) */
  skipFirstImage?: boolean;
}

/**
 * DOMPurify 설정
 */
const ALLOWED_TAGS = [
  // 텍스트 포맷
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre', 'blockquote',
  // 헤딩
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // 리스트
  'ul', 'ol', 'li',
  // 링크 & 이미지
  'a', 'img', 'figure', 'figcaption',
  // 테이블
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  // 구조
  'div', 'span', 'hr',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel',  // 링크
  'src', 'alt', 'width', 'height', 'loading',  // 이미지
  'class', 'id',  // 스타일링
  'colspan', 'rowspan', 'scope', 'headers',  // 테이블
];

/**
 * 한 줄로 저장된 마크다운 테이블을 여러 줄 형식으로 변환
 * 예: "| col1 | col2 | |---|---| | data1 | data2 |" → 줄바꿈된 테이블
 *
 * 핵심 패턴: 행 경계는 "| |" (끝 파이프 + 공백 + 시작 파이프)로 구분됨
 */
function convertInlineMarkdownTable(text: string): string {
  // 테이블 구분선이 있는지 확인 (|---|---| 또는 |:---|:---|)
  if (!/\|[\s]*[-:]+[\s]*\|/.test(text)) {
    return text;
  }

  // 행 경계 패턴: "| |" (행 끝 파이프 + 공백 + 다음 행 시작 파이프)를 줄바꿈으로 변환
  // 예: "| 핵심 포인트 | |--------|" → "| 핵심 포인트 |\n|--------|"
  const result = text.replace(/\|\s+\|/g, '|\n|');

  return result;
}

/**
 * <p> 태그 안에 있는 마크다운 테이블을 HTML 테이블로 변환
 * marked는 HTML 태그 안의 마크다운을 처리하지 않으므로,
 * <p> 태그에서 테이블을 추출하여 변환 후 교체합니다.
 */
function convertMarkdownTablesInParagraphs(html: string): string {
  // <p> 태그 안에 마크다운 테이블이 있는지 확인
  const pTagWithTableRegex = /<p>([^<]*\|[^<]*\|[\s\-:]+\|[^<]*)<\/p>/g;

  return html.replace(pTagWithTableRegex, (match, content) => {
    // 인라인 테이블을 여러 줄 형식으로 변환
    const tableMarkdown = convertInlineMarkdownTable(content);

    // marked로 마크다운 테이블을 HTML로 변환
    const tableHtml = marked.parse(tableMarkdown, {
      gfm: true,
      breaks: false,
    }) as string;

    // 변환 결과가 <table>을 포함하면 교체, 아니면 원본 유지
    if (tableHtml.includes('<table>')) {
      return tableHtml;
    }

    return match;
  });
}

export function SafeHtml({ html, className = '', skipFirstImage = false }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // DOMPurify는 브라우저에서만 동작
    if (typeof window !== 'undefined') {
      let processedHtml = html;

      // 마크다운 테이블 패턴이 있는지 확인 (| header | 형식)
      const hasMarkdownTable = /\|[^|\n]+\|/.test(html) && /\|[\s\-:]+\|/.test(html);

      if (hasMarkdownTable) {
        // <p> 태그 안에 있는 마크다운 테이블을 HTML 테이블로 변환
        processedHtml = convertMarkdownTablesInParagraphs(processedHtml);
      }

      const clean = DOMPurify.sanitize(processedHtml, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        // 링크에 target="_blank"와 rel="noopener noreferrer" 자동 추가
        ADD_ATTR: ['target'],
        FORCE_BODY: true,
      });

      // 모든 링크에 보안 속성 추가
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = clean;
      tempDiv.querySelectorAll('a').forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

      // 첫 번째 이미지/figure 제거 (커버 이미지와 중복 방지)
      if (skipFirstImage) {
        // figure 태그 먼저 확인 (figure > img 구조)
        const firstFigure = tempDiv.querySelector('figure');
        if (firstFigure) {
          firstFigure.remove();
        } else {
          // figure가 없으면 첫 번째 img 태그 제거
          const firstImg = tempDiv.querySelector('img');
          if (firstImg) {
            firstImg.remove();
          }
        }
      }

      setSanitizedHtml(tempDiv.innerHTML);
    }
  }, [html, skipFirstImage]);

  // SSR/로딩 시 스켈레톤 UI 반환 (CLS 방지)
  if (!sanitizedHtml) {
    return (
      <div
        className={`${className} min-h-[100px] animate-pulse bg-muted/30 rounded-md`}
        aria-busy="true"
        aria-label="콘텐츠 로딩 중"
      />
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
