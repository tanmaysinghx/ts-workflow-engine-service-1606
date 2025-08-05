import { Router } from "express";
import { handleWorkflowRequest } from "../controllers/workflow-controller";

const router = Router();

// Matches: /v1/api/workflow-engine/:workflowId?region=local&apiVersion=v1&method=GET
router.all('/:workflowId', handleWorkflowRequest);

export default router;