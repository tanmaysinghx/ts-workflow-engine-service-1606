import { getWorkflowDefinition } from "../utils/workflow-loader";
import { executeStep } from "../workflows/step-runner";
import { buildErrorResponse, buildSuccessResponse } from "../utils/response-builder";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger";

export const processWorkflow = async (workflowId: string, region: string, context: any, version: string) => {
    const transactionId = uuidv4();
    const startTime = new Date(); // Start time for timing
    const workflowTrace: any[] = []; // To collect trace
    const diagnosticCodes: string[] = []; // To collect any diagnostic codes

    try {
        const definition = await getWorkflowDefinition(workflowId, region);
        logger.info(`Processing workflow: ${workflowId} in region: ${region} with version: ${version}`);

        for (const step of definition.steps) {
            const stepStart = Date.now();
            const result = await executeStep(step, context, definition.config);
            const stepEnd = Date.now();

            if (result.error) {
                diagnosticCodes.push(`ERR_${step.type}`);
                throw { errors: { [step.type]: result.error } };
            }

            workflowTrace.push({
                step: step.type,
                status: 'success',
                timeTakenMs: stepEnd - stepStart,
                output: result.data || result,
            });

            diagnosticCodes.push(`OK_${step.type}`);
        }

        const downstreamResp = workflowTrace.find(r => r.step === 'callExternalService')?.output || {};

        return buildSuccessResponse(
            transactionId,
            version,
            definition.config,
            downstreamResp,
            context,
            workflowTrace,
            startTime,
            diagnosticCodes
        );
    } catch (err: any) {
        return buildErrorResponse(transactionId, version, err);
    }
};
