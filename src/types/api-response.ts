export interface WorkflowSuccessResponse {
    success: true;
    transactionId: string;
    message: string;
    configSummary: {
        microservice: string;
        url: string;
        tokenCheck: boolean;
        otpFlow: boolean;
        notification: boolean;
        workflowVersion?: string;
        stepCount?: number;
    };
    workflowTrace?: {
        step: string;
        status: string;
        timestamp: string;
        details?: string;
    }[];
    timing?: {
        start: string;
        end: string;
        durationMs: number;
    };
    requestEcho?: {
        method: string;
        headers: Record<string, string | string[] | undefined>;
        body: any;
    };
    diagnosticCodes?: string[];
    data: {
        downstreamResponse: any;
    };
    errors: null;
    meta: {
        timestamp: string;
        apiVersion: string;
        engineVersion?: string;
    };
}

export interface WorkflowErrorResponse {
    success: false;
    transactionId: string;
    message: string;
    otpGenerated?: boolean;
    configSummary?: {
        microservice?: string;
        url?: string;
        tokenCheck?: boolean;
        otpFlow?: boolean;
        notification?: boolean;
        workflowVersion?: string;
        stepCount?: number;
    };
    workflowTrace?: {
        step: string;
        status: string;
        timestamp: string;
        details?: string;
    }[];
    timing?: {
        start: string;
        end: string;
        durationMs: number;
    };
    requestEcho?: {
        method: string;
        headers: Record<string, string | string[] | undefined>;
        body: any;
    };
    diagnosticCodes?: string[];
    data: null;
    errors: Record<string, any>;
    meta: {
        timestamp: string;
        apiVersion: string;
        engineVersion?: string;
    };
}
