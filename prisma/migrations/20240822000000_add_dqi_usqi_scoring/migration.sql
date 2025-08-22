-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('DQI', 'USQI');

-- CreateEnum  
CREATE TYPE "DeveloperTier" AS ENUM ('TIER_1', 'ESTABLISHED', 'MID_TIER', 'NEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "GreenMarkLevel" AS ENUM ('PLATINUM', 'GOLDPLUS', 'GOLD', 'CERTIFIED', 'NONE');

-- CreateTable
CREATE TABLE "ScoringResult" (
    "id" TEXT NOT NULL,
    "developmentName" TEXT NOT NULL,
    "scoreType" "ScoreType" NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "locationScore" INTEGER NOT NULL,
    "propertyScore" INTEGER NOT NULL,
    "investmentScore" INTEGER NOT NULL,
    "qualityScore" INTEGER NOT NULL,
    "facilitiesScore" INTEGER NOT NULL,
    "sustainabilityScore" INTEGER NOT NULL,
    "marketScore" INTEGER NOT NULL,
    "floorLevel" INTEGER,
    "unitNumber" TEXT,
    "unitType" TEXT,
    "viewType" TEXT,
    "detailsJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "ScoringResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentDataCache" (
    "developmentId" TEXT NOT NULL,
    "developmentName" TEXT NOT NULL,
    "district" INTEGER NOT NULL,
    "avgPsf" DECIMAL(10,2),
    "rentalYield" DECIMAL(4,2),
    "transactionVolume" INTEGER,
    "conquasScore" INTEGER,
    "developerName" TEXT,
    "developerTier" "DeveloperTier",
    "greenMarkLevel" "GreenMarkLevel",
    "totalUnits" INTEGER,
    "completionYear" INTEGER,
    "tenure" TEXT,
    "facilitiesCount" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentDataCache_pkey" PRIMARY KEY ("developmentId")
);

-- CreateTable
CREATE TABLE "DistrictAverage" (
    "id" TEXT NOT NULL,
    "district" INTEGER NOT NULL,
    "avgPsf" DECIMAL(10,2) NOT NULL,
    "avgRentalYield" DECIMAL(4,2) NOT NULL,
    "avgDqiScore" DECIMAL(4,2),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistrictAverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScoringResult_developmentName_idx" ON "ScoringResult"("developmentName");
CREATE INDEX "ScoringResult_userId_idx" ON "ScoringResult"("userId");
CREATE INDEX "ScoringResult_createdAt_idx" ON "ScoringResult"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentDataCache_developmentName_key" ON "DevelopmentDataCache"("developmentName");
CREATE INDEX "DevelopmentDataCache_district_idx" ON "DevelopmentDataCache"("district");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictAverage_district_key" ON "DistrictAverage"("district");