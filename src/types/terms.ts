import { LucideIcon } from "lucide-react";

/**
 * 서비스 타입 정의
 */
export type ServiceType =
  | "platform"    // 플랫폼 전체 약관
  | "community"   // 커뮤니티 서비스 약관
  | "help"        // Help me 서비스 약관
  | "news"        // 뉴스 서비스 약관
  | "privacy"     // 개인정보처리방침
  | "cookies";    // 쿠키 정책

/**
 * 약관 항목 메타데이터
 */
export interface TermsItem {
  id: ServiceType;
  title: string;
  description: string;
  lastUpdated: string;
  icon?: LucideIcon;
}

/**
 * 약관 섹션 구조 (목차 생성용)
 */
export interface TermsSection {
  id: string;
  title: string;
  content: string;
  subsections?: TermsSection[];
}

/**
 * 전체 약관 컨텐츠
 */
export interface TermsContent {
  metadata: TermsItem;
  sections: TermsSection[];
}
