/**
 * 카테고리 Seed 스크립트
 *
 * 실행: npx tsx prisma/seed-categories.ts
 */

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      name: '자유게시판',
      slug: 'free-board',
      description: '자유롭게 소통하고 이야기를 나누는 공간입니다',
      icon: '💬',
      color: '#3b82f6',
    },
    {
      name: '팁 & 노하우',
      slug: 'tips',
      description: '개발 팁과 노하우를 공유하는 공간입니다',
      icon: '💡',
      color: '#10b981',
    },
    {
      name: '작품공유',
      slug: 'showcase',
      description: '자신의 프로젝트와 작품을 공유하는 공간입니다',
      icon: '🎨',
      color: '#f59e0b',
    },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (existing) {
      console.log(`✓ Category "${category.name}" already exists (${category.slug})`);
      continue;
    }

    await prisma.category.create({
      data: category,
    });

    console.log(`✓ Created category: ${category.name} (${category.slug})`);
  }

  console.log('✅ Categories seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
