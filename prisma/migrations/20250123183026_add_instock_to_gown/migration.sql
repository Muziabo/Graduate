/*
  Warnings:

  - The `inStock` column on the `Gown` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `InstitutionId` to the `Gown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Gown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gown" ADD COLUMN     "InstitutionId" INTEGER NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "customSize" TEXT,
DROP COLUMN "inStock",
ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Photography" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "InstitutionId" INTEGER NOT NULL,

    CONSTRAINT "Photography_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gown" ADD CONSTRAINT "Gown_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photography" ADD CONSTRAINT "Photography_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
