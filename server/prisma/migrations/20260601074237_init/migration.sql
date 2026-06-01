/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `card_id` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Card` table. All the data in the column will be lost.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `card_id` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `image_id` on the `Image` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_card_id_fkey";

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "card_id",
DROP COLUMN "user_id",
ADD COLUMN     "cardId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId");

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "card_id",
DROP COLUMN "image_id",
ADD COLUMN     "cardId" INTEGER NOT NULL,
ADD COLUMN     "imageId" SERIAL NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE RESTRICT ON UPDATE CASCADE;
