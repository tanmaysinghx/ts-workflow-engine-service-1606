import { StepContext } from "../workflows/workflow-types";
import { handleOTP } from "./otp-step";
import { callExternalService } from "./service-call-step";

type StepHandler = (config: any, context: StepContext, workflowConfig?: any) => Promise<any>;

export const stepRegistry: Record<string, StepHandler> = {
    callExternalService,
    handleOTP,
    // add others as needed
};
