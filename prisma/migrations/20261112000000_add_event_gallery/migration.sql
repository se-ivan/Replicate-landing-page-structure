-- CreateTable
CREATE TABLE "EventPhoto" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "eventName" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventPhoto_creadoEn_idx" ON "EventPhoto"("creadoEn");

-- CreateIndex
CREATE INDEX "EventPhoto_published_idx" ON "EventPhoto"("published");

-- CreateIndex
CREATE INDEX "EventPhoto_takenAt_idx" ON "EventPhoto"("takenAt");

-- CreateIndex
CREATE INDEX "EventPhoto_featured_idx" ON "EventPhoto"("featured");
