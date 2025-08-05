export interface WorkflowDefinitionConfig {
    microserviceName: string;
    downstreamEndpoint: string;
    tokenCheck: boolean;
    otpFlow: boolean;
    notification: boolean;
    steps: Array<{
        type: string;
        config: Record<string, any>;
    }>;
}