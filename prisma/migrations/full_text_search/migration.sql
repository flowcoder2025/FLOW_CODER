-- Full-Text Search Migration for PostgreSQL
-- 이 migration은 Post 테이블에 전문 검색 기능을 추가합니다.
--
-- 실행 방법:
-- 1. 데이터베이스 연결 후 이 파일의 SQL을 순서대로 실행
-- 2. 또는 psql 명령: psql -h [host] -U [user] -d [database] -f migration.sql
--
-- 주의:
-- - 이 migration은 수동으로 실행해야 합니다 (Prisma CLI 사용 불가)
-- - 대용량 데이터베이스의 경우 Step 5 실행 시간이 오래 걸릴 수 있습니다

-- Step 1: tsvector 컬럼 추가
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Step 2: GIN 인덱스 생성 (Full-Text Search 성능 최적화)
-- GIN (Generalized Inverted Index)는 전문 검색에 최적화된 인덱스
CREATE INDEX IF NOT EXISTS post_search_idx ON "Post" USING GIN(search_vector);

-- Step 3: 트리거 함수 생성 (search_vector 자동 업데이트)
-- INSERT 또는 UPDATE 시 자동으로 search_vector 갱신
CREATE OR REPLACE FUNCTION post_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('simple', coalesce(NEW.title, '')) ||
    to_tsvector('simple', coalesce(NEW.content, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Step 4: 트리거 연결
DROP TRIGGER IF EXISTS post_search_vector_trigger ON "Post";
CREATE TRIGGER post_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Post"
  FOR EACH ROW EXECUTE FUNCTION post_search_vector_update();

-- Step 5: 기존 데이터 업데이트 (한 번만 실행)
-- 대용량 데이터의 경우 배치 처리 고려
UPDATE "Post" SET search_vector =
  to_tsvector('simple', coalesce(title, '')) ||
  to_tsvector('simple', coalesce(content, ''))
WHERE search_vector IS NULL;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Full-Text Search migration completed successfully!';
  RAISE NOTICE 'Index: post_search_idx (GIN)';
  RAISE NOTICE 'Trigger: post_search_vector_trigger';
  RAISE NOTICE 'Function: post_search_vector_update()';
END $$;

-- 검증 쿼리 (옵션)
-- 아래 쿼리로 migration이 정상적으로 적용되었는지 확인
/*
-- 1. search_vector 컬럼 존재 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Post' AND column_name = 'search_vector';

-- 2. 인덱스 존재 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Post' AND indexname = 'post_search_idx';

-- 3. 트리거 존재 확인
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'Post' AND trigger_name = 'post_search_vector_trigger';

-- 4. 검색 테스트 (예시)
SELECT id, title, ts_rank(search_vector, to_tsquery('simple', 'react & typescript')) as rank
FROM "Post"
WHERE search_vector @@ to_tsquery('simple', 'react & typescript')
ORDER BY rank DESC
LIMIT 10;
*/
