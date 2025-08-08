import redisClient from "../config/redis";
import logger from "../utils/logger";
import { StepContext } from "../workflows/workflow-types";

export async function notificationStep(config: any, context: StepContext) {
    const {
        gearId,
        scenarioId,
        emailOTP = false,
        mobileOTP = false,
        appNotification = false,
        appTitle = "Notification",
        appMessage = "You have a new update",
        appData = {},
        expirySeconds = 14400 // default 4 hours
    } = config;

    // Dynamically resolve email from context
    const userEmail =
        context.user?.email ||
        context.body?.email ||
        context.params?.email ||
        null;

    if (!userEmail) {
        logger.error(`[NotificationStep] Missing user email`);
        return { success: false, error: "User email is required" };
    }

    const startTime = new Date();

    // Build the notification service request payload
    const notificationServiceData = {
        gearId,
        scenarioId,
        userEmail,
        emailOTP,
        mobileOTP
    };

    // Build the event payload for publishing
    const eventPayload = {
        key: userEmail,
        happenedAt: startTime.toISOString(),
        expiryAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
        workflow: {
            id: context.workflowId || null,
            name: context.workflowName || null
        },
        notifications: {
            emailAndSms: notificationServiceData,
            appNotification: {
                enabled: appNotification,
                title: appTitle,
                message: appMessage,
                data: appData
            }
        },
        audit: {
            triggeredBy: context.user?.email || "system",
            stepType: "notificationStep",
            traceId: context.traceId || null
        }
    };

    try {
        const channel = "workflow-notifications";

        // Publish notification event to Redis channel
        await redisClient.publish(channel, JSON.stringify(eventPayload));

        // Prepare the Redis payload
        const redisPayload = {
            notificationServiceData, // GearId, scenarioId, emailOTP, mobileOTP
            stepConfig: config,      // Full step config from workflow
            audit: {
                triggeredBy: context.user?.email || "system",
                stepType: "notificationStep",
                traceId: context.traceId || null
            },
            startTime: startTime.toISOString(),
            expiryAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
        };

        // Store in Redis with email as the primary key
        await redisClient.set(
            `notif:${userEmail}`,
            JSON.stringify(redisPayload),
            "EX",
            expirySeconds // e.g. 4 hours = 14400
        );


        logger.info(
            `[NotificationStep] Event published & data cached for user: ${userEmail} (TTL: ${expirySeconds}s)`
        );

        return { success: true, eventPayload };
    } catch (err: any) {
        logger.error(`[NotificationStep] Failed to publish/store in Redis`, err);
        return { success: false, error: err.message };
    }
}
