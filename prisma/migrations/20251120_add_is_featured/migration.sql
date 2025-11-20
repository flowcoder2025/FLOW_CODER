-- AlterTable
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_isFeatured_idx" ON "Post"("isFeatured");
