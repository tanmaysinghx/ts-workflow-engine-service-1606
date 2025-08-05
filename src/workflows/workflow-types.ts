export interface WorkflowDefinition {
  id: string;
  region: string;
  config: any;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  type: string;
  config: any;
}

export interface StepContext {
  [key: string]: any;
}

export interface StepResult {
  data?: any;
  error?: string;
}

export type Step = {
  type: string;
  config: any;
};