/*
  Warnings:

  - The values [HIRE,BUY] on the enum `GownType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BUY', 'HIRE');

-- AlterEnum
BEGIN;
CREATE TYPE "GownType_new" AS ENUM ('PHD', 'MASTERS', 'BACHELORS', 'DIPLOMA');
ALTER TABLE "Gown" ALTER COLUMN "type" TYPE "GownType_new" USING ("type"::text::"GownType_new");
ALTER TYPE "GownType" RENAME TO "GownType_old";
ALTER TYPE "GownType_new" RENAME TO "GownType";
DROP TYPE "GownType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "type",
ADD COLUMN     "type" "OrderType" NOT NULL;
