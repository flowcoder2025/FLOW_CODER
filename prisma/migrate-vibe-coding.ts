/**
 * vibe-coding → flowcoder-feed 마이그레이션 스크립트
 *
 * 실행: npx tsx prisma/migrate-vibe-coding.ts
 *
 * 이 스크립트는:
 * 1. 기존 vibe-coding 카테고리를 flowcoder-feed로 업데이트
 * 2. 해당 카테고리의 모든 게시글도 자동으로 마이그레이션됨 (FK 관계)
 */

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 vibe-coding → flowcoder-feed 마이그레이션 시작...');

  // 기존 vibe-coding 카테고리 찾기
  const vibeCoding = await prisma.category.findUnique({
    where: { slug: 'vibe-coding' },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!vibeCoding) {
    console.log('⚠️ vibe-coding 카테고리가 없습니다. seed 스크립트를 먼저 실행하세요.');

    // flowcoder-feed가 이미 있는지 확인
    const flowcoderFeed = await prisma.category.findUnique({
      where: { slug: 'flowcoder-feed' },
    });

    if (flowcoderFeed) {
      console.log('✅ flowcoder-feed 카테고리가 이미 존재합니다.');
    } else {
      // 새로 생성
      await prisma.category.create({
        data: {
          name: 'FlowCoder Feed',
          slug: 'flowcoder-feed',
          description: 'FlowCoder 공식 블로그, 컬럼, 소식을 전하는 공간입니다',
          icon: '🚀',
          color: '#6366f1',
          route: '/community',
          hasAnswers: false,
        },
      });
      console.log('✅ flowcoder-feed 카테고리 생성 완료');
    }
    return;
  }

  console.log(`📊 vibe-coding 카테고리 정보:`);
  console.log(`   - ID: ${vibeCoding.id}`);
  console.log(`   - 게시글 수: ${vibeCoding._count.posts}개`);

  // 카테고리 업데이트
  await prisma.category.update({
    where: { slug: 'vibe-coding' },
    data: {
      name: 'FlowCoder Feed',
      slug: 'flowcoder-feed',
      description: 'FlowCoder 공식 블로그, 컬럼, 소식을 전하는 공간입니다',
      icon: '🚀',
      color: '#6366f1',
    },
  });

  console.log('✅ 카테고리 업데이트 완료:');
  console.log('   - 이름: 바이브코딩 → FlowCoder Feed');
  console.log('   - slug: vibe-coding → flowcoder-feed');
  console.log(`   - ${vibeCoding._count.posts}개 게시글 자동 마이그레이션됨`);

  console.log('\n🎉 마이그레이션 완료!');
  console.log('   새 URL: /community/flowcoder-feed');
}

main()
  .catch((e) => {
    console.error('❌ 마이그레이션 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
