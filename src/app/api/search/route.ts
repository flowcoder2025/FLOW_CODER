import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/search
 * 게시글 전문 검색 (Full-Text Search)
 *
 * Query Parameters:
 * - q: 검색어 (필수, 최소 2자)
 * - category: 카테고리 slug (optional)
 * - postType: 게시글 타입 (optional)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 *
 * PostgreSQL Full-Text Search:
 * - to_tsvector('korean', title || ' ' || content): 한글 형태소 분석
 * - to_tsquery('korean', query): 검색 쿼리 변환
 * - ts_rank: 관련도 점수 계산
 *
 * Migration Required:
 * ```sql
 * -- 1. tsvector 컬럼 추가
 * ALTER TABLE "Post" ADD COLUMN search_vector tsvector;
 *
 * -- 2. 인덱스 생성 (GIN)
 * CREATE INDEX post_search_idx ON "Post" USING GIN(search_vector);
 *
 * -- 3. 트리거 함수 생성 (자동 업데이트)
 * CREATE FUNCTION post_search_vector_update() RETURNS trigger AS $$
 * BEGIN
 *   NEW.search_vector :=
 *     to_tsvector('simple', coalesce(NEW.title, '')) ||
 *     to_tsvector('simple', coalesce(NEW.content, ''));
 *   RETURN NEW;
 * END
 * $$ LANGUAGE plpgsql;
 *
 * -- 4. 트리거 연결
 * CREATE TRIGGER post_search_vector_trigger
 * BEFORE INSERT OR UPDATE ON "Post"
 * FOR EACH ROW EXECUTE FUNCTION post_search_vector_update();
 *
 * -- 5. 기존 데이터 업데이트
 * UPDATE "Post" SET search_vector =
 *   to_tsvector('simple', coalesce(title, '')) ||
 *   to_tsvector('simple', coalesce(content, ''));
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const postType = searchParams.get('postType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 검색어 검증
    if (!query || query.trim().length < 2) {
      return validationErrorResponse('검색어는 최소 2자 이상이어야 합니다');
    }

    const searchQuery = query.trim();

    // 필터 조건 구성
    const whereConditions: string[] = ['p."deletedAt" IS NULL'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereConditions.push(`c."slug" = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (postType) {
      whereConditions.push(`p."postType" = $${paramIndex}`);
      queryParams.push(postType);
      paramIndex++;
    }

    // Full-Text Search 쿼리 (PostgreSQL)
    // Note: 한글 검색을 위해 'simple' configuration 사용
    // 실제 프로덕션에서는 pg_trgm extension 또는 ElasticSearch 고려
    const searchSql = `
      SELECT
        p.id,
        p.title,
        p.content,
        p."postType",
        p.upvotes,
        p."viewCount",
        p.tags,
        p."createdAt",
        p."updatedAt",
        jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'displayName', u."displayName",
          'image', u.image,
          'reputation', u.reputation
        ) as author,
        jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'icon', c.icon,
          'color', c.color
        ) as category,
        ts_rank(
          to_tsvector('simple', p.title || ' ' || p.content),
          to_tsquery('simple', $${paramIndex})
        ) as rank
      FROM "Post" p
      INNER JOIN "User" u ON p."authorId" = u.id
      INNER JOIN "Category" c ON p."categoryId" = c.id
      WHERE ${whereConditions.join(' AND ')}
        AND to_tsvector('simple', p.title || ' ' || p.content) @@ to_tsquery('simple', $${paramIndex})
      ORDER BY rank DESC, p."createdAt" DESC
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `;

    // 쿼리 파라미터 준비
    // PostgreSQL tsquery는 공백을 & (AND)로 변환
    const tsquery = searchQuery.split(/\s+/).join(' & ');
    queryParams.push(tsquery, limit, skip);

    // Raw SQL 실행
    const posts = await prisma.$queryRawUnsafe(searchSql, ...queryParams);

    // 총 개수 쿼리
    const countSql = `
      SELECT COUNT(*) as count
      FROM "Post" p
      INNER JOIN "Category" c ON p."categoryId" = c.id
      WHERE ${whereConditions.join(' AND ')}
        AND to_tsvector('simple', p.title || ' ' || p.content) @@ to_tsquery('simple', $${paramIndex})
    `;
    const countResult: any = await prisma.$queryRawUnsafe(countSql, ...queryParams.slice(0, -2), tsquery);
    const total = parseInt(countResult[0]?.count || '0');

    return successResponse({
      posts,
      query: searchQuery,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/search error:', error);
    return serverErrorResponse('검색 중 오류가 발생했습니다', error);
  }
}
