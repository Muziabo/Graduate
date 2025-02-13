/*
  Warnings:

  - You are about to drop the column `universityId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `University` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `InstitutionId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_universityId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "universityId",
ADD COLUMN     "InstitutionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "University";

-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "established_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
