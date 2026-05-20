ALTER TABLE "Article"
ADD COLUMN "readingTimeMinutes" INTEGER,
ADD COLUMN "headerMeta" TEXT NOT NULL DEFAULT 'Guia practica para Morelia, Michoacan',
ADD COLUMN "tocTitle" TEXT NOT NULL DEFAULT 'En este articulo';
