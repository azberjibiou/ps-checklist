/*
  Warnings:

  - You are about to drop the column `categoryId` on the `problem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `problem` DROP FOREIGN KEY `Problem_categoryId_fkey`;

-- DropIndex
DROP INDEX `Problem_categoryId_fkey` ON `problem`;

-- AlterTable
ALTER TABLE `problem` DROP COLUMN `categoryId`;
