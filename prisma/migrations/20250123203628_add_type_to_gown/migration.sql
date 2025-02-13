/*
  Warnings:

  - Added the required column `type` to the `Gown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gown" ADD COLUMN     "type" TEXT NOT NULL;
