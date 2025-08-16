import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 🚨 Delete all existing workflow definitions first
    await prisma.workflowDefinition.deleteMany({});
    console.log('🗑️ Deleted all existing workflow definitions');

    /**
     * Utility function to create a workflow
     */
    const createWorkflow = async (
        workflowId: string,
        name: string,
        region: string,
        microserviceName: string,
        microservicePrefix: string,
        downstreamEndpoint: string,
        method: "POST" | "GET",
        tokenCheck: boolean,
        otpFlow: boolean,
        notification: boolean,
        extraSteps: any[] = []
    ) => {
        const baseSteps = [
            {
                type: 'contextPopulationStep',
                config: {
                    required: true,
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    forwardBody: method === "POST"
                }
            }
        ];

        if (tokenCheck) {
            baseSteps.push({
                type: 'validateToken',
                config: {
                    required: true,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    forwardBody: true
                }
            });
        }

        baseSteps.push({
            type: 'callExternalService',
            config: {
                required: true,
                method,
                headers: { 'Content-Type': 'application/json' },
                forwardBody: method === "POST"
            }
        });

        const steps = [...baseSteps, ...extraSteps];

        return prisma.workflowDefinition.upsert({
            where: { workflowId_region: { workflowId, region } },
            update: {},
            create: {
                workflowId,
                region,
                name,
                definition: {
                    microserviceName,
                    microservicePrefix,
                    downstreamEndpoint,
                    tokenCheck,
                    otpFlow,
                    notification,
                    steps
                }
            }
        });
    };

    // 16250001 - Register
    await createWorkflow(
        '16250001',
        'Auth Register Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/auth/register',
        'POST',
        false,
        false,
        true,
        [
            {
                type: "notificationStep",
                config: {
                    gearId: "1625",
                    scenarioId: "00001",
                    emailOTP: true,
                    mobileOTP: false,
                    appNotification: true,
                    appTitle: "Registration Successful",
                    appMessage: "You have successfully registered",
                    expirySeconds: 6000
                }
            }
        ]
    );

    // 16250002 - Login - Local
    await createWorkflow(
        '16250002',
        'Auth Login Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/auth/login',
        'POST',
        false,
        false,
        true,
        [
            {
                type: "notificationStep",
                config: {
                    gearId: "1625",
                    scenarioId: "00002",
                    emailOTP: true,
                    mobileOTP: false,
                    appNotification: true,
                    appTitle: "Login Successful",
                    appMessage: "You have successfully logged in",
                    expirySeconds: 6000
                }
            },
            {
                type: "metricsStep",
                config: {
                    metricName: "auth_login",
                    tags: { region: "local", microservice: "auth-service" }
                }
            },
            {
                type: "metricsFinalizeStep",
                config: {
                    metricName: "auth_login_finalize",
                    tags: { region: "local", microservice: "auth-service" }
                }
            }
        ]
    );

    // 16251002 - Login - Docker
    await createWorkflow(
        '16251002',
        'Auth Login Workflow - Docker',
        'docker',
        'auth-service',
        'http://ts-auth-service-1625:1625',
        '/v2/api/auth/login',
        'POST',
        false,
        false,
        true,
        [
            {
                type: "notificationStep",
                config: {
                    gearId: "1625",
                    scenarioId: "00002",
                    emailOTP: true,
                    mobileOTP: false,
                    appNotification: true,
                    appTitle: "Login Successful",
                    appMessage: "You have successfully logged in",
                    expirySeconds: 6000
                }
            },
            {
                type: "metricsStep",
                config: {
                    metricName: "auth_login",
                    tags: { region: "docker", microservice: "auth-service" }
                }
            },
            {
                type: "metricsFinalizeStep",
                config: {
                    metricName: "auth_login_finalize",
                    tags: { region: "docker", microservice: "auth-service" }
                }
            }
        ]
    );

    // 16250003 - Change Password
    await createWorkflow(
        '16250003',
        'Auth Change Password Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/auth/change-password',
        'POST',
        true,
        false,
        true,
        [
            {
                type: "notificationStep",
                config: {
                    gearId: "1625",
                    scenarioId: "00002",
                    emailOTP: true,
                    mobileOTP: false,
                    appNotification: true,
                    appTitle: "Password Changed",
                    appMessage: "Your password has been successfully updated",
                    expirySeconds: 36000
                }
            }
        ]
    );

    // 16250004 - Refresh Token
    await createWorkflow(
        '16250004',
        'Auth Refresh Token Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/auth/refresh-token',
        'POST',
        false,
        false,
        false
    );

    // 16250005 - Verify Token
    await createWorkflow(
        '16250005',
        'Auth Verify Token Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/auth/verify/verify-token',
        'POST',
        false,
        false,
        false
    );

    // 16250006 - Health Check (GET)
    await createWorkflow(
        '16250006',
        'Health Check Workflow - Local',
        'local',
        'auth-service',
        'http://localhost:1625',
        '/v2/api/health/health-check',
        'GET',
        false,
        false,
        false
    );

    console.log('✅ Seeded workflows: 16250001 to 16250006');
}

main()
    .catch(e => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
