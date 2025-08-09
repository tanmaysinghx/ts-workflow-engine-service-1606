import { Router } from "express";
import { handleWorkflowRequest } from "../controllers/workflow-controller";

const router = Router();

/**
 * @openapi
 * /{workflowId}:
 *   get:
 *     summary: Execute a workflow (GET request)
 *     parameters:
 *       - name: workflowId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: region
 *         in: query
 *         schema:
 *           type: string
 *         example: local
 *       - name: apiVersion
 *         in: query
 *         schema:
 *           type: string
 *         example: v1
 *       - name: method
 *         in: query
 *         schema:
 *           type: string
 *         example: GET
 *     responses:
 *       200:
 *         description: Workflow executed successfully
 *   post:
 *     summary: Execute a workflow (POST request)
 *     parameters:
 *       - name: workflowId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: region
 *         in: query
 *         schema:
 *           type: string
 *         example: local
 *       - name: apiVersion
 *         in: query
 *         schema:
 *           type: string
 *         example: v1
 *       - name: method
 *         in: query
 *         schema:
 *           type: string
 *         example: POST
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               key: value
 *     responses:
 *       200:
 *         description: Workflow executed successfully
 */
router.all('/:workflowId', handleWorkflowRequest);
// Matches: /v1/api/workflow-engine/:workflowId?region=local&apiVersion=v1&method=GET

export default router;