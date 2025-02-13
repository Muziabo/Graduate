/*
  Warnings:

  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Gown` table. All the data in the column will be lost.
  - The `customSize` column on the `Gown` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `established_at` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Institution` table. All the data in the column will be lost.
  - Changed the type of `category` on the `Gown` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Gown` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `establishedAt` to the `Institution` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GownCategory" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'DOCTORAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "GownType" AS ENUM ('HIRE', 'BUY', 'PHD', 'MASTERS', 'BACHELORS', 'DIPLOMA');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiresAt" INTEGER,
ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "sessionState" TEXT,
ADD COLUMN     "tokenType" TEXT;

-- AlterTable
ALTER TABLE "Gown" DROP COLUMN "images",
DROP COLUMN "category",
ADD COLUMN     "category" "GownCategory" NOT NULL,
DROP COLUMN "customSize",
ADD COLUMN     "customSize" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "GownType" NOT NULL;

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "established_at",
DROP COLUMN "is_active",
ADD COLUMN     "establishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "gownId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_gownId_fkey" FOREIGN KEY ("gownId") REFERENCES "Gown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
