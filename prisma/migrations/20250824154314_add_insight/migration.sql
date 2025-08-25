-- CreateTable
CREATE TABLE `Insight` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `statementIds` JSON NOT NULL,
    `periodFrom` DATETIME(3) NOT NULL,
    `periodTo` DATETIME(3) NOT NULL,
    `inflow` DECIMAL(20, 2) NOT NULL,
    `outflow` DECIMAL(20, 2) NOT NULL,
    `net` DECIMAL(20, 2) NOT NULL,
    `avgMonthlyIncome3m` DECIMAL(20, 2) NULL,
    `spendBuckets` JSON NOT NULL,
    `riskFlags` JSON NOT NULL,
    `parsingSuccessRate` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Insight_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
