import { workflowCounter, workflowExecutionTime } from "../utils/metrics";
import { StepContext } from "../workflows/workflow-types";

export async function metricsStep(config: any, context: StepContext) {
    const workflowCode = context.workflowCode || 'unknown';
    const startTime = Date.now();

    try {
        context.metrics = { startTime };
        return { status: 'metrics_initialized' };
    } catch (error) {
        workflowCounter.labels(workflowCode, 'failure').inc();
        throw error;
    }
}

export async function metricsFinalizeStep(config: any, context: StepContext) {
    const workflowCode = context.workflowCode || 'unknown';
    const startTime = context.metrics?.startTime || Date.now();
    const duration = (Date.now() - startTime) / 1000;
    workflowExecutionTime.labels(workflowCode).observe(duration);
    workflowCounter.labels(workflowCode, 'success').inc();
    return { status: 'metrics_recorded', duration };
}
