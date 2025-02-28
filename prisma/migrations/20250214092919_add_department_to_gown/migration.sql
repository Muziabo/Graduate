-- CreateEnum
CREATE TYPE "PhotoOrderType" AS ENUM ('SOFT_COPY', 'HARD_COPY');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_gownId_fkey";

-- AlterTable
ALTER TABLE "Frame" ADD COLUMN "color" TEXT,
ADD COLUMN "material" TEXT,
ADD COLUMN "mountColor" TEXT,
ADD COLUMN "thickness" TEXT;

-- AlterTable
-- Add the new column with a default value
ALTER TABLE "Gown" ADD COLUMN "department" TEXT NOT NULL DEFAULT 'Unknown';

-- Remove the default value after the column is added
ALTER TABLE "Gown" ALTER COLUMN "department" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "customMeasurements" JSONB,
ALTER COLUMN "gownId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PhotographyImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "photographyId" INTEGER NOT NULL,

    CONSTRAINT "PhotographyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoOrder" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "photographyId" INTEGER NOT NULL,
    "orderType" "PhotoOrderType" NOT NULL,
    "deliveryContact" TEXT,
    "photoSize" TEXT,
    "frameId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrameImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "frameId" INTEGER NOT NULL,

    CONSTRAINT "FrameImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gownId_fkey" FOREIGN KEY ("gownId") REFERENCES "Gown"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotographyImage" ADD CONSTRAINT "PhotographyImage_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoOrder" ADD CONSTRAINT "PhotoOrder_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoOrder" ADD CONSTRAINT "PhotoOrder_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoOrder" ADD CONSTRAINT "PhotoOrder_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameImage" ADD CONSTRAINT "FrameImage_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;