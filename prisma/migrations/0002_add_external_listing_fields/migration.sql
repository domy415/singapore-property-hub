-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "area" INTEGER,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "listingUrl" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "psf" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tenure" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_externalId_key" ON "Property"("externalId");

-- CreateIndex
CREATE INDEX "Property_externalId_idx" ON "Property"("externalId");

-- CreateIndex
CREATE INDEX "Property_source_idx" ON "Property"("source");