import {
  FileText,
  Users,
  HelpCircle,
  Newspaper,
  Shield,
} from "lucide-react";
import { TermsItem, TermsContent } from "@/types/terms";

/**
 * 약관 목록 메타데이터
 */
export const termsItems: TermsItem[] = [
  {
    id: "platform",
    title: "플랫폼 이용약관",
    description: "Vibe Coding 플랫폼 전체 서비스 이용약관",
    lastUpdated: "2025-01-15",
    icon: FileText,
  },
  {
    id: "community",
    title: "커뮤니티 서비스 약관",
    description: "커뮤니티 게시판 및 상호작용 서비스 이용약관",
    lastUpdated: "2025-01-15",
    icon: Users,
  },
  {
    id: "help",
    title: "Help me 서비스 약관",
    description: "질문과 답변 서비스 이용약관",
    lastUpdated: "2025-01-15",
    icon: HelpCircle,
  },
  {
    id: "news",
    title: "뉴스 서비스 약관",
    description: "기술 뉴스 및 정보 서비스 이용약관",
    lastUpdated: "2025-01-15",
    icon: Newspaper,
  },
  {
    id: "privacy",
    title: "개인정보처리방침",
    description: "개인정보 수집 및 이용에 관한 방침",
    lastUpdated: "2025-01-15",
    icon: Shield,
  },
];

/**
 * 플랫폼 이용약관 상세 컨텐츠
 */
export const platformTerms: TermsContent = {
  metadata: termsItems[0],
  sections: [
    {
      id: "article-1",
      title: "제1조 (목적)",
      content: `본 약관은 Vibe Coding(이하 "회사")이 제공하는 플랫폼 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.`,
    },
    {
      id: "article-2",
      title: "제2조 (정의)",
      content: `본 약관에서 사용하는 용어의 정의는 다음과 같습니다.`,
      subsections: [
        {
          id: "article-2-1",
          title: "1. 플랫폼",
          content: `"플랫폼"이란 회사가 제공하는 웹사이트, 애플리케이션 등 모든 온라인 서비스를 의미합니다.`,
        },
        {
          id: "article-2-2",
          title: "2. 이용자",
          content: `"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.`,
        },
        {
          id: "article-2-3",
          title: "3. 회원",
          content: `"회원"이란 플랫폼에 가입하여 지속적으로 서비스를 이용할 수 있는 자를 말합니다.`,
        },
      ],
    },
    {
      id: "article-3",
      title: "제3조 (약관의 효력 및 변경)",
      content: `1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.\n2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.\n3. 회사가 약관을 변경할 경우 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.`,
    },
    {
      id: "article-4",
      title: "제4조 (서비스의 제공 및 변경)",
      content: `1. 회사는 다음과 같은 서비스를 제공합니다:\n   - 커뮤니티 서비스\n   - Help me 질문답변 서비스\n   - 뉴스 정보 서비스\n   - 기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 제공하는 서비스\n2. 회사는 상당한 이유가 있는 경우 서비스의 내용, 운영상 또는 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.`,
    },
    {
      id: "article-5",
      title: "제5조 (서비스의 중단)",
      content: `1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.\n2. 회사는 제1항의 사유로 서비스 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사에 고의 또는 과실이 없음을 입증하는 경우 그러하지 아니합니다.`,
    },
  ],
};

/**
 * 커뮤니티 서비스 약관
 */
export const communityTerms: TermsContent = {
  metadata: termsItems[1],
  sections: [
    {
      id: "article-1",
      title: "제1조 (목적)",
      content: `본 약관은 Vibe Coding 커뮤니티 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`,
    },
    {
      id: "article-2",
      title: "제2조 (커뮤니티 서비스의 내용)",
      content: `1. 커뮤니티 서비스는 회원 간의 정보 교류 및 소통을 위한 게시판 서비스입니다.\n2. 회원은 텍스트, 이미지, 링크 등 다양한 형태의 콘텐츠를 게시할 수 있습니다.`,
    },
    {
      id: "article-3",
      title: "제3조 (게시물의 관리)",
      content: `1. 회원이 작성한 게시물의 저작권은 회원에게 귀속됩니다.\n2. 회사는 다음 각 호에 해당하는 게시물을 사전 통보 없이 삭제할 수 있습니다:\n   - 타인의 권리를 침해하거나 명예를 훼손하는 내용\n   - 공공질서 및 미풍양속에 위반되는 내용\n   - 범죄적 행위에 결부된다고 인정되는 내용\n   - 회사의 저작권, 제3자의 저작권 등 권리를 침해하는 내용\n   - 기타 관계 법령에 위배되는 내용`,
    },
    {
      id: "article-4",
      title: "제4조 (게시물의 이용)",
      content: `회사는 회원이 작성한 게시물을 서비스 내에서 게재, 전송, 배포할 수 있으며, 검색결과 내지 서비스 및 관련 프로모션 등에 노출할 수 있습니다. 이 경우 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터를 통해 해당 게시물의 삭제, 검색결과 제외 등의 조치를 취할 수 있습니다.`,
    },
  ],
};

/**
 * Help me 서비스 약관
 */
export const helpTerms: TermsContent = {
  metadata: termsItems[2],
  sections: [
    {
      id: "article-1",
      title: "제1조 (목적)",
      content: `본 약관은 Vibe Coding Help me 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`,
    },
    {
      id: "article-2",
      title: "제2조 (Help me 서비스의 내용)",
      content: `1. Help me 서비스는 회원이 기술적 질문을 올리고 다른 회원이 답변하는 Q&A 플랫폼입니다.\n2. 회원은 질문을 작성하고, 답변을 작성하며, 유용한 답변에 투표할 수 있습니다.`,
    },
    {
      id: "article-3",
      title: "제3조 (질문과 답변의 품질)",
      content: `1. 질문자는 명확하고 구체적인 질문을 작성해야 합니다.\n2. 답변자는 정확하고 도움이 되는 답변을 제공해야 합니다.\n3. 회사는 부적절하거나 스팸성 질문 및 답변을 삭제할 수 있습니다.`,
    },
    {
      id: "article-4",
      title: "제4조 (콘텐츠의 저작권)",
      content: `1. 질문과 답변의 저작권은 작성자에게 귀속됩니다.\n2. 회사는 서비스 운영 및 개선을 위해 질문과 답변을 활용할 수 있습니다.`,
    },
  ],
};

/**
 * 뉴스 서비스 약관
 */
export const newsTerms: TermsContent = {
  metadata: termsItems[3],
  sections: [
    {
      id: "article-1",
      title: "제1조 (목적)",
      content: `본 약관은 Vibe Coding 뉴스 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`,
    },
    {
      id: "article-2",
      title: "제2조 (뉴스 서비스의 내용)",
      content: `1. 뉴스 서비스는 기술 관련 뉴스, 트렌드, 업데이트 정보를 제공합니다.\n2. 회원은 뉴스를 읽고, 댓글을 작성하며, 공유할 수 있습니다.`,
    },
    {
      id: "article-3",
      title: "제3조 (뉴스 콘텐츠의 저작권)",
      content: `1. 뉴스 콘텐츠의 저작권은 원 저작자 또는 제공자에게 있습니다.\n2. 회사는 합법적으로 제공된 뉴스만을 게재합니다.\n3. 회원은 뉴스 콘텐츠를 무단으로 복제, 배포할 수 없습니다.`,
    },
    {
      id: "article-4",
      title: "제4조 (댓글 관리)",
      content: `1. 회원은 뉴스에 대한 댓글을 작성할 수 있습니다.\n2. 부적절한 댓글은 사전 통보 없이 삭제될 수 있습니다.`,
    },
  ],
};

/**
 * 개인정보처리방침
 */
export const privacyPolicy: TermsContent = {
  metadata: termsItems[4],
  sections: [
    {
      id: "article-1",
      title: "제1조 (개인정보의 수집 항목 및 방법)",
      content: `회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.`,
      subsections: [
        {
          id: "article-1-1",
          title: "1. 수집 항목",
          content: `- 필수항목: 이메일, 비밀번호, 이름\n- 선택항목: 프로필 사진, 자기소개, 관심 기술 스택`,
        },
        {
          id: "article-1-2",
          title: "2. 수집 방법",
          content: `- 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력\n- 로그 분석 프로그램을 통한 생성정보 수집`,
        },
      ],
    },
    {
      id: "article-2",
      title: "제2조 (개인정보의 수집 및 이용 목적)",
      content: `회사는 수집한 개인정보를 다음의 목적으로 활용합니다:\n1. 회원 관리: 회원제 서비스 이용, 본인확인, 불량회원 부정이용 방지\n2. 서비스 제공: 맞춤형 콘텐츠 제공, 서비스 이용 통계 분석\n3. 마케팅 및 광고 활용: 신규 서비스 개발 및 맞춤 서비스 제공`,
    },
    {
      id: "article-3",
      title: "제3조 (개인정보의 보유 및 이용 기간)",
      content: `1. 회사는 회원 탈퇴 시까지 개인정보를 보유하며, 탈퇴 시 지체없이 파기합니다.\n2. 다만, 관계 법령에 의한 정보보유 사유가 있는 경우 해당 기간 동안 보관합니다:\n   - 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)\n   - 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)\n   - 소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)`,
    },
    {
      id: "article-4",
      title: "제4조 (개인정보의 파기 절차 및 방법)",
      content: `회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.\n- 파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정기간 저장된 후 파기됩니다.\n- 파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.`,
    },
    {
      id: "article-5",
      title: "제5조 (이용자의 권리)",
      content: `1. 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다.\n2. 이용자는 언제든지 회원 탈퇴를 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.\n3. 이용자가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.`,
    },
  ],
};

/**
 * 모든 약관 컨텐츠 맵
 */
export const termsContentMap: Record<string, TermsContent> = {
  platform: platformTerms,
  community: communityTerms,
  help: helpTerms,
  news: newsTerms,
  privacy: privacyPolicy,
};
