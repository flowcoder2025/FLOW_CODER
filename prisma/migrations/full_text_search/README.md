# Full-Text Search Migration

PostgreSQL 전문 검색(Full-Text Search)을 위한 수동 migration 가이드입니다.

## 개요

이 migration은 `Post` 테이블에 전문 검색 기능을 추가합니다:

- **tsvector 컬럼**: `search_vector` (title + content 통합 검색)
- **GIN 인덱스**: `post_search_idx` (검색 성능 최적화)
- **트리거**: `post_search_vector_trigger` (자동 업데이트)

## 실행 방법

### 방법 1: psql 커맨드라인

```bash
# 데이터베이스 연결 정보 확인
cat .env | grep DATABASE_URL

# migration 실행
psql [DATABASE_URL] -f prisma/migrations/full_text_search/migration.sql
```

### 방법 2: Supabase SQL Editor

1. Supabase 대시보드 접속
2. SQL Editor 탭 이동
3. `migration.sql` 내용 복사하여 실행

### 방법 3: Prisma Studio

```bash
# Prisma Studio 실행
npx prisma studio

# 또는 직접 SQL 실행
npx prisma db execute --file prisma/migrations/full_text_search/migration.sql
```

## Migration 내용

### 1. tsvector 컬럼 추가

```sql
ALTER TABLE "Post" ADD COLUMN search_vector tsvector;
```

- `tsvector`: PostgreSQL의 전문 검색용 데이터 타입
- title과 content를 결합한 검색 벡터 저장

### 2. GIN 인덱스 생성

```sql
CREATE INDEX post_search_idx ON "Post" USING GIN(search_vector);
```

- **GIN (Generalized Inverted Index)**: 전문 검색에 최적화된 인덱스
- 검색 성능 대폭 향상 (O(n) → O(log n))

### 3. 자동 업데이트 트리거

```sql
CREATE FUNCTION post_search_vector_update() ...
CREATE TRIGGER post_search_vector_trigger ...
```

- INSERT/UPDATE 시 `search_vector` 자동 갱신
- 수동 업데이트 불필요

### 4. 기존 데이터 업데이트

```sql
UPDATE "Post" SET search_vector = ...
```

- 기존 게시글의 `search_vector` 초기화
- 대용량 DB의 경우 시간 소요 가능

## 검증

Migration 후 다음 쿼리로 정상 동작 확인:

```sql
-- 1. 컬럼 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Post' AND column_name = 'search_vector';

-- 2. 인덱스 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Post' AND indexname = 'post_search_idx';

-- 3. 검색 테스트
SELECT id, title, ts_rank(search_vector, to_tsquery('simple', 'react')) as rank
FROM "Post"
WHERE search_vector @@ to_tsquery('simple', 'react')
ORDER BY rank DESC
LIMIT 10;
```

## API 사용법

### 검색 API 엔드포인트

```
GET /api/search?q={검색어}&category={카테고리}&page={페이지}
```

**Query Parameters:**

- `q` (required): 검색어 (최소 2자)
- `category` (optional): 카테고리 slug
- `postType` (optional): 게시글 타입 (DISCUSSION, QUESTION, SHOWCASE, NEWS)
- `page` (optional): 페이지 번호 (default: 1)
- `limit` (optional): 페이지당 항목 수 (default: 20)

**예시:**

```bash
# 기본 검색
curl "http://localhost:3000/api/search?q=react"

# 카테고리 필터링
curl "http://localhost:3000/api/search?q=typescript&category=development"

# 질문만 검색
curl "http://localhost:3000/api/search?q=next.js&postType=QUESTION"

# 페이지네이션
curl "http://localhost:3000/api/search?q=react&page=2&limit=10"
```

**응답 예시:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "clu...",
        "title": "React 18의 새로운 기능",
        "content": "...",
        "author": { "username": "user1", ... },
        "category": { "name": "Development", ... },
        "rank": 0.456
      }
    ],
    "query": "react",
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

## 성능 최적화

### 1. 한글 검색 개선

현재는 `simple` configuration을 사용합니다. 한글 형태소 분석이 필요한 경우:

```sql
-- pg_trgm extension 설치 (유사도 검색)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 트라이그램 인덱스 추가
CREATE INDEX post_title_trgm_idx ON "Post" USING GIN (title gin_trgm_ops);
CREATE INDEX post_content_trgm_idx ON "Post" USING GIN (content gin_trgm_ops);
```

### 2. 검색 속도 개선

- **VACUUM ANALYZE**: 주기적으로 실행하여 통계 업데이트
- **Materialized View**: 자주 검색되는 쿼리는 MV로 캐싱

### 3. 대용량 데이터 처리

기존 데이터 업데이트 시 배치 처리:

```sql
-- 배치 단위로 업데이트 (100개씩)
DO $$
DECLARE
  batch_size INT := 100;
  total_rows INT;
BEGIN
  SELECT COUNT(*) INTO total_rows FROM "Post" WHERE search_vector IS NULL;
  RAISE NOTICE 'Total rows to update: %', total_rows;

  LOOP
    UPDATE "Post"
    SET search_vector = to_tsvector('simple', coalesce(title, '')) || to_tsvector('simple', coalesce(content, ''))
    WHERE id IN (
      SELECT id FROM "Post" WHERE search_vector IS NULL LIMIT batch_size
    );

    EXIT WHEN NOT FOUND;
    RAISE NOTICE 'Updated % rows', batch_size;
  END LOOP;
END $$;
```

## 롤백

Migration을 되돌리려면:

```sql
-- 1. 트리거 삭제
DROP TRIGGER IF EXISTS post_search_vector_trigger ON "Post";

-- 2. 함수 삭제
DROP FUNCTION IF EXISTS post_search_vector_update();

-- 3. 인덱스 삭제
DROP INDEX IF EXISTS post_search_idx;

-- 4. 컬럼 삭제
ALTER TABLE "Post" DROP COLUMN IF EXISTS search_vector;
```

## 참고 자료

- [PostgreSQL Full-Text Search Documentation](https://www.postgresql.org/docs/current/textsearch.html)
- [GIN Index](https://www.postgresql.org/docs/current/gin.html)
- [pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
