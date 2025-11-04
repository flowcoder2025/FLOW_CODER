-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalTerms" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relation_tuples" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relation_tuples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relation_definitions" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "inheritsFrom" TEXT,
    "description" TEXT,

    CONSTRAINT "relation_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalTerms_slug_key" ON "ExternalTerms"("slug");

-- CreateIndex
CREATE INDEX "relation_tuples_namespace_objectId_relation_idx" ON "relation_tuples"("namespace", "objectId", "relation");

-- CreateIndex
CREATE INDEX "relation_tuples_subjectType_subjectId_idx" ON "relation_tuples"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "relation_tuples_namespace_relation_subjectId_idx" ON "relation_tuples"("namespace", "relation", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "relation_tuples_namespace_objectId_relation_subjectType_sub_key" ON "relation_tuples"("namespace", "objectId", "relation", "subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "relation_definitions_namespace_relation_key" ON "relation_definitions"("namespace", "relation");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
