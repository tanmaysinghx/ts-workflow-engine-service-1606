import jwt, { JwtPayload } from "jsonwebtoken";
import { StepContext } from "../workflows/workflow-types";
import logger from "../utils/logger";

export async function contextPopulationStep(config: any, context: StepContext) {
    let email: string | undefined;

    // 1. Check JWT first
    const authHeader = context.headers["authorization"] || context.headers["Authorization"];
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload;
            if (typeof decoded !== "string" && decoded?.email) {
                email = decoded.email;
            }
        } catch (err) {
            logger.debug("[ContextPopulationStep] JWT missing/invalid, moving to next source");
        }
    }

    // 2. If JWT not found, check body
    if (!email && context?.body?.email || context?.body?.userEmail || context?.body?.emailId) {
        email = context?.body.email;
    }

    // 3. If still not found, check params/query
    if (!email && (context.params?.email || context.query?.email || context.query?.userEmail || context.query?.emailId)) {
        email = context.params?.email || context.query?.email;
    }

    if (!email) {
        console.error("[ContextPopulationStep] No email found in JWT, body, or params/query");
        return { success: false, error: "Missing email in request" };
    }

    // Store in context for future steps
    context.user = { ...(context.user || {}), email };

    logger.info(`[ContextPopulationStep] Email stored: ${email}`);
    return { success: true, email };
}
