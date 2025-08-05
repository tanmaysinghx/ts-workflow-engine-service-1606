-- CreateTable
CREATE TABLE `WorkflowDefinition` (
    `id` VARCHAR(191) NOT NULL,
    `workflowId` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `definition` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WorkflowDefinition_workflowId_key`(`workflowId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
