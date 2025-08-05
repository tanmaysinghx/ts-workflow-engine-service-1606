import { Request, Response } from "express";
import { processWorkflow } from "../services/workflow-service";
import logger from "../utils/logger";

export const handleWorkflowRequest = async (req: Request, res: Response) => {
    const workflowId = req.params.workflowId;
    const region = req.query.region as string;
    const apiVersion = req.query.apiVersion as string;
    const methodOverride = req.query.method as string;

    const rawInput = req.method === 'GET' || req.method === 'DELETE' ? req.query : req.body;

    const context = {
        method: methodOverride || req.method,
        apiVersion,
        headers: req.headers,
        body: rawInput,
    };

    logger.info(`Handling workflow request for ID: ${workflowId}, Region: ${region}, API Version: ${apiVersion}`, { context });
    const result = await processWorkflow(workflowId, region, context, apiVersion);
    return res.status(result.success ? 200 : 400).json(result);
};