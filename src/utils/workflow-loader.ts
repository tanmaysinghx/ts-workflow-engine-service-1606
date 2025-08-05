import prisma from "../config/db";
import { WorkflowDefinition } from "../workflows/workflow-types";
import { WorkflowDefinitionConfig } from "../types/workflow-definition";

export async function getWorkflowDefinition(workflowId: string, region: string): Promise<WorkflowDefinition> {
    const workflowRecord = await prisma.workflowDefinition.findUnique({
        where: {
            workflowId_region: {
                workflowId,
                region,
            }
        }
    });

    if (!workflowRecord) {
        throw new Error(`Workflow not found for workflowId=${workflowId} and region=${region}`);
    }

    const rawDefinition = workflowRecord.definition;

    if (!rawDefinition || typeof rawDefinition !== 'object' || Array.isArray(rawDefinition)) {
        throw new Error(`Invalid workflow definition format for workflowId=${workflowId}`);
    }

    const definition = rawDefinition as unknown as WorkflowDefinitionConfig;

    if (!Array.isArray(definition.steps)) {
        throw new Error(`Invalid or missing steps in workflow definition for workflowId=${workflowId}`);
    }

    return {
        id: workflowRecord.id,
        region: workflowRecord.region,
        config: definition,
        steps: definition.steps,
    };
}
