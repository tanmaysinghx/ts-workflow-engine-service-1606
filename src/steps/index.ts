import { StepContext } from "../workflows/workflow-types";
import { contextPopulationStep } from "./context-population-step";
import { notificationStep } from "./notification-step";
import { handleOTP } from "./otp-step";
import { callExternalService } from "./service-call-step";
import { validateTokenStep } from "./validate-token-step";

type StepHandler = (config: any, context: StepContext, workflowConfig?: any) => Promise<any>;

export const stepRegistry: Record<string, StepHandler> = {
    contextPopulationStep,
    callExternalService,
    handleOTP,
    validateToken: validateTokenStep,
    notificationStep
    // Add other step handlers here as needed
};
