import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const workflow = await prisma.workflowDefinition.upsert({
        where: {
            workflowId_region: {
                workflowId: '16250001',
                region: 'local'
            }
        },
        update: {},
        create: {
            workflowId: '16250001',
            region: 'local',
            name: 'Auth Login Workflow - Local',
            definition: {
                microserviceName: 'auth-service',
                microservicePrefix: 'http://localhost:1625', // ✅ ADD THIS LINE
                downstreamEndpoint: '/v2/api/auth/login',
                tokenCheck: false,
                otpFlow: false,
                notification: false,
                steps: [
                    {
                        type: 'callExternalService',
                        config: {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            forwardBody: true
                            // ✅ DO NOT add serviceUrl here
                        }
                    }
                ]
            }
        }

    });

    console.log('✅ Seeded workflow:', workflow.workflowId);
}

main()
    .catch(e => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
