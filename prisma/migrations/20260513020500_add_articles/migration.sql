CREATE TABLE "Article" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  "tags" JSONB NOT NULL,
  "img" TEXT NOT NULL,
  "intro" TEXT NOT NULL,
  "sections" JSONB NOT NULL,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Article_creadoEn_idx" ON "Article"("creadoEn");
CREATE INDEX "Article_actualizadoEn_idx" ON "Article"("actualizadoEn");
