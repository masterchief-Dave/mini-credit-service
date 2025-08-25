-- CreateTable
CREATE TABLE `BureauReport` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `requestedById` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `riskBand` VARCHAR(191) NOT NULL,
    `enquiries6m` INTEGER NOT NULL,
    `defaults` INTEGER NOT NULL,
    `openLoans` INTEGER NOT NULL,
    `tradeLines` JSON NOT NULL,
    `raw` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BureauReport_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
