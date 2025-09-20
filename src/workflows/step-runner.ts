import { stepRegistry } from "../steps";
import logger from "../utils/logger";
import { Step } from "../workflows/workflow-types";

export const executeStep = async (
    step: Step,
    context: any,
    workflowConfig: any = {}
): Promise<any> => {
    const handler = stepRegistry[step.type];

    if (!handler) {
        return { error: `No handler found for step type: ${step.type}` };
    }

    logger.info(`Executing step: ${step.type} with config:`, JSON.stringify(step.config));

    const result = await handler(step.config, context, workflowConfig);

    if (result.headers?.['set-cookie']) {
        logger.info(`Step ${step.type} returned Set-Cookie headers`, result.headers['set-cookie']);
    }

    return result;
};

