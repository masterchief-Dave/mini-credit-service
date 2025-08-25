/*
  Warnings:

  - You are about to drop the column `userId` on the `BureauReport` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BureauReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Insight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Statement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `BureauReport_userId_createdAt_idx` ON `BureauReport`;

-- AlterTable
ALTER TABLE `BureauReport` DROP COLUMN `userId`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Insight` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Statement` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `BureauReport_requestedById_createdAt_idx` ON `BureauReport`(`requestedById`, `createdAt`);

-- AddForeignKey
ALTER TABLE `BureauReport` ADD CONSTRAINT `BureauReport_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
