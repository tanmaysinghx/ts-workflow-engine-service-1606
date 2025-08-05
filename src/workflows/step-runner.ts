import { stepRegistry } from "../steps";
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

    return handler(step.config, context, workflowConfig);
};
