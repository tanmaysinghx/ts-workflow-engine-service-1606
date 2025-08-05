import { executeStep } from './step-runner';
import { WorkflowDefinition } from './workflow-types';

export class WorkflowExecutor {
    async run(definition: WorkflowDefinition, requestData: any): Promise<any> {
        let context = { ...requestData }; // you can track shared state here

        for (const step of definition.steps) {
            const result = await executeStep(step, context);

            if (result?.error) {
                return { success: false, error: result.error };
            }

            // Optionally update context if step returns data
            context = { ...context, ...result?.data };
        }

        return { success: true, data: context };
    }
}