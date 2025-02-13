-- AlterTable
ALTER TABLE "Gown" ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "Frame" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "photographyId" INTEGER NOT NULL,

    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
