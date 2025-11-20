import { PrismaClient, CategoryType } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('뉴스 카테고리 시드 데이터 생성 중...');

  // 뉴스 전용 카테고리 생성
  const newsCategories = [
    {
      name: '공지',
      slug: 'notice',
      description: '플로우코더 공지사항',
      icon: '📢',
      color: '#ef4444',
      categoryType: CategoryType.NEWS,
    },
    {
      name: 'IT 소식',
      slug: 'it-news',
      description: 'IT 업계 최신 소식 및 트렌드',
      icon: '💻',
      color: '#3b82f6',
      categoryType: CategoryType.NEWS,
    },
    {
      name: '바이브코딩',
      slug: 'vibe-coding',
      description: '바이브코딩 관련 소식',
      icon: '🎯',
      color: '#8b5cf6',
      categoryType: CategoryType.NEWS,
    },
    {
      name: '컬럼',
      slug: 'column',
      description: '전문가 컬럼 및 인사이트',
      icon: '✍️',
      color: '#10b981',
      categoryType: CategoryType.NEWS,
    },
    {
      name: '가이드',
      slug: 'guide',
      description: '개발 가이드 및 튜토리얼',
      icon: '📚',
      color: '#f59e0b',
      categoryType: CategoryType.NEWS,
    },
  ];

  for (const category of newsCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ ${created.name} 카테고리 생성 완료`);
  }

  console.log('✨ 뉴스 카테고리 시드 완료!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
