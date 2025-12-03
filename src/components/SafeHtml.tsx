'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

/**
 * SafeHtml 컴포넌트
 *
 * XSS 공격을 방지하면서 HTML 콘텐츠를 안전하게 렌더링합니다.
 * DOMPurify를 사용하여 위험한 태그와 속성을 제거합니다.
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
  'a', 'img',
  // 테이블
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  // 구조
  'div', 'span', 'hr',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel',  // 링크
  'src', 'alt', 'width', 'height', 'loading',  // 이미지
  'class', 'id',  // 스타일링
  'colspan', 'rowspan',  // 테이블
];

export function SafeHtml({ html, className = '' }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // DOMPurify는 브라우저에서만 동작
    if (typeof window !== 'undefined') {
      const clean = DOMPurify.sanitize(html, {
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

      setSanitizedHtml(tempDiv.innerHTML);
    }
  }, [html]);

  // SSR 시 빈 상태 반환
  if (!sanitizedHtml) {
    return <div className={className} />;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
