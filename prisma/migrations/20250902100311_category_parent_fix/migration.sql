-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_parentId_fkey`;

-- DropIndex
DROP INDEX `Category_parentId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` MODIFY `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
