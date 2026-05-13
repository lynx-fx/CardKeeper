-- CreateEnum
CREATE TYPE "WarrantyType" AS ENUM ('BRAND', 'STORE', 'EXTENDED', 'OHTER');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "tokenValidation" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Card" (
    "card_id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyExpiry" TIMESTAMP(3) NOT NULL,
    "purchsePrice" INTEGER NOT NULL,
    "store" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "warrantyType" "WarrantyType" NOT NULL,
    "description" TEXT,
    "imageUri" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "Image" (
    "image_id" SERIAL NOT NULL,
    "imageUri" TEXT NOT NULL,
    "card_id" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;
