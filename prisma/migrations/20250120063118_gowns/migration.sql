-- CreateTable
CREATE TABLE "Gown" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inStock" INTEGER NOT NULL,

    CONSTRAINT "Gown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "gownId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gownId_fkey" FOREIGN KEY ("gownId") REFERENCES "Gown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
