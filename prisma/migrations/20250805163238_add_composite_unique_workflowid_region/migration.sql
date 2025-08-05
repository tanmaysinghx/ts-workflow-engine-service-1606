/*
  Warnings:

  - A unique constraint covering the columns `[workflowId,region]` on the table `WorkflowDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `WorkflowDefinition_workflowId_key` ON `WorkflowDefinition`;

-- CreateIndex
CREATE UNIQUE INDEX `WorkflowDefinition_workflowId_region_key` ON `WorkflowDefinition`(`workflowId`, `region`);
