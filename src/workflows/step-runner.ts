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

    return handler(step.config, context, workflowConfig);
};
