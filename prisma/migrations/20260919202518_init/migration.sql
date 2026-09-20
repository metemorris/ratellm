-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "pipelineTag" TEXT,
    "libraryName" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Anonymous',
    "useCase" TEXT NOT NULL,
    "contexts" TEXT NOT NULL DEFAULT '[]',
    "dimensions" TEXT NOT NULL DEFAULT '{}',
    "deployment" TEXT,
    "hardware" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Model_downloads_idx" ON "Model"("downloads");

-- CreateIndex
CREATE INDEX "Review_modelId_createdAt_idx" ON "Review"("modelId", "createdAt");
