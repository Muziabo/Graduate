/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Institution_email_key" ON "Institution"("email");
