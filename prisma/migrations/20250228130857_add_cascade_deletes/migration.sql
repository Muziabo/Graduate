-- DropForeignKey
ALTER TABLE "Frame" DROP CONSTRAINT "Frame_photographyId_fkey";

-- DropForeignKey
ALTER TABLE "FrameImage" DROP CONSTRAINT "FrameImage_frameId_fkey";

-- DropForeignKey
ALTER TABLE "Gown" DROP CONSTRAINT "Gown_InstitutionId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_gownId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_studentId_fkey";

-- DropForeignKey
ALTER TABLE "PhotoOrder" DROP CONSTRAINT "PhotoOrder_photographyId_fkey";

-- DropForeignKey
ALTER TABLE "PhotoOrder" DROP CONSTRAINT "PhotoOrder_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Photography" DROP CONSTRAINT "Photography_InstitutionId_fkey";

-- DropForeignKey
ALTER TABLE "PhotographyImage" DROP CONSTRAINT "PhotographyImage_photographyId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_InstitutionId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gown" ADD CONSTRAINT "Gown_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_gownId_fkey" FOREIGN KEY ("gownId") REFERENCES "Gown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photography" ADD CONSTRAINT "Photography_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotographyImage" ADD CONSTRAINT "PhotographyImage_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoOrder" ADD CONSTRAINT "PhotoOrder_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoOrder" ADD CONSTRAINT "PhotoOrder_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameImage" ADD CONSTRAINT "FrameImage_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_InstitutionId_fkey" FOREIGN KEY ("InstitutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
