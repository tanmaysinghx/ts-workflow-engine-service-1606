import { WorkflowSuccessResponse, WorkflowErrorResponse } from "../types/api-response";

export const buildSuccessResponse = (
  transactionId: string,
  version: string,
  config: any,
  downstreamResp: any,
  context: any = {},
  workflowTrace: any[] = [],
  startTime?: Date,
  diagnosticCodes: string[] = []
): WorkflowSuccessResponse => {
  const endTime = new Date();
  const durationMs = startTime ? endTime.getTime() - startTime.getTime() : undefined;

  return {
    success: true,
    transactionId,
    message: 'Workflow executed successfully',
    configSummary: {
      microservice: config.microserviceName,
      url: config.microserviceBaseUrl + config.downstreamEndpoint,
      tokenCheck: config.tokenCheck,
      otpFlow: config.otpFlow,
      notification: config.notification,
      workflowVersion: config.workflowVersion || version,
      stepCount: config.steps?.length || workflowTrace.length,
    },
    workflowTrace,
    timing: {
      start: startTime?.toISOString() || "",
      end: endTime.toISOString(),
      durationMs: durationMs ?? 0,
    },
    diagnosticCodes,
    data: {
      downstreamResponse: downstreamResp,
    },
    errors: null,
    meta: {
      timestamp: endTime.toISOString(),
      apiVersion: version,
      engineVersion: 'v1.0.0', // Customize as needed
    },
  };
};

export const buildErrorResponse = (
  transactionId: string,
  version: string,
  err: any
): WorkflowErrorResponse => ({
  success: false,
  transactionId,
  message: 'Workflow processing failed',
  otpGenerated: false,
  data: null,
  errors: err?.errors ?? {
    general: err.message ?? 'Unexpected error',
  },
  meta: {
    timestamp: new Date().toISOString(),
    apiVersion: version,
  },
});
