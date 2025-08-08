import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 🚨 Delete all existing workflow definitions first
    await prisma.workflowDefinition.deleteMany({});
    console.log('🗑️ Deleted all existing workflow definitions');

    // login workflow
    await prisma.workflowDefinition.upsert({
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
                microservicePrefix: 'http://localhost:1625',
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
                        }
                    }
                ]
            }
        }
    });

    // change-password workflow
    await prisma.workflowDefinition.upsert({
        where: {
            workflowId_region: {
                workflowId: '16250002',
                region: 'local'
            }
        },
        update: {},
        create: {
            workflowId: '16250002',
            region: 'local',
            name: 'Auth Change Password Workflow - Local',
            definition: {
                microserviceName: 'auth-service',
                microservicePrefix: 'http://localhost:1625',
                downstreamEndpoint: '/v2/api/auth/change-password',
                tokenCheck: true,
                otpFlow: false,
                notification: false,
                steps: [
                    {
                        type: 'validateToken',
                        config: {
                            required: true,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            forwardBody: true
                        }
                    },
                    {
                        type: 'callExternalService',
                        config: {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            forwardBody: true
                        }
                    }
                ]
            }
        }
    });

    console.log('✅ Seeded workflows: 16250001 (login) & 16250002 (change-password)');
}

main()
    .catch(e => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
