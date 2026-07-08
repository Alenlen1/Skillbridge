-- CreateEnum
CREATE TYPE "EndorsementStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "endorserName" TEXT NOT NULL,
    "endorserRole" TEXT NOT NULL,
    "endorserEmail" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "EndorsementStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
