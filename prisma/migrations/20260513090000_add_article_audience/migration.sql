ALTER TABLE "Article"
ADD COLUMN "audience" "ServiceType" NOT NULL DEFAULT 'ambos';

CREATE INDEX "Article_audience_idx" ON "Article"("audience");
