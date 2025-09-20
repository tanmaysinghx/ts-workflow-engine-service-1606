import { getWorkflowDefinition } from "../utils/workflow-loader";
import { executeStep } from "../workflows/step-runner";
import { buildErrorResponse, buildSuccessResponse } from "../utils/response-builder";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger";

function accumulateSetCookies(
    existingCookies: string[] | undefined,
    newSetCookie: string | string[]
): string[] {
    let cookies = existingCookies ? [...existingCookies] : [];

    if (Array.isArray(newSetCookie)) {
        cookies.push(...newSetCookie);
    } else if (typeof newSetCookie === 'string') {
        cookies.push(newSetCookie);
    }

    return cookies;
}

export const processWorkflow = async (workflowId: string, region: string, context: any, version: string) => {
    const transactionId = uuidv4();
    const startTime = new Date(); // Start time for timing
    const workflowTrace: any[] = [];
    const diagnosticCodes: string[] = [];

    let setCookie: string[] | undefined;

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

            if (result.headers && result.headers['set-cookie']) {
                setCookie = accumulateSetCookies(setCookie, result.headers['set-cookie']);
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

        return {
            ...buildSuccessResponse(
                transactionId,
                version,
                definition.config,
                downstreamResp,
                context,
                workflowTrace,
                startTime,
                diagnosticCodes
            ),
            setCookie
        };
    } catch (err: any) {
        return buildErrorResponse(transactionId, version, err);
    }
};
