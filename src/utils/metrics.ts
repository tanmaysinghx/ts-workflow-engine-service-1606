import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Default metrics like CPU, memory usage, etc.
client.collectDefaultMetrics({ register });

// Example: Counter for workflows executed
export const workflowCounter = new client.Counter({
    name: 'workflow_executed_total',
    help: 'Total number of workflows executed',
    labelNames: ['workflow_code', 'status'], // status could be success/failure
});

// Example: Histogram for workflow execution time
export const workflowExecutionTime = new client.Histogram({
    name: 'workflow_execution_duration_seconds',
    help: 'Workflow execution time in seconds',
    labelNames: ['workflow_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10], // adjust to expected ranges
});

// Register metrics
register.registerMetric(workflowCounter);
register.registerMetric(workflowExecutionTime);

// Function to expose metrics
export const getMetrics = async () => {
    return await register.metrics();
};

export default register;

