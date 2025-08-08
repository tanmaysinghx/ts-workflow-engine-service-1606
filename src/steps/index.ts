import { StepContext } from "../workflows/workflow-types";
import { handleOTP } from "./otp-step";
import { callExternalService } from "./service-call-step";
import { validateTokenStep } from "./validate-token-step";

type StepHandler = (config: any, context: StepContext, workflowConfig?: any) => Promise<any>;

export const stepRegistry: Record<string, StepHandler> = {
    callExternalService,
    handleOTP,
    validateToken: validateTokenStep
    // Add other step handlers here as needed
};
