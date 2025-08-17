import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

type StepConfig = {
    type: string;
    config: Record<string, any>;
};

type WorkflowDefinition = {
    workflowId: string;
    name: string;
    region: string;
    microserviceName: string;
    microservicePrefix: string;
    downstreamEndpoint: string;
    method: "POST" | "GET";
    tokenCheck: boolean;
    otpFlow: boolean;
    notification: boolean;
    extraSteps: StepConfig[];
};

async function readWorkflowsFromFile(filename: string): Promise<WorkflowDefinition[]> {
    const fullPath = path.join(__dirname, filename);
    const content = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(content);
}

const buildBaseSteps = (wf: WorkflowDefinition): StepConfig[] => {
    const steps: StepConfig[] = [
        {
            type: "contextPopulationStep",
            config: {
                required: true,
                method: wf.method,
                headers: { "Content-Type": "application/json" },
                forwardBody: wf.method === "POST",
            },
        },
    ];

    if (wf.tokenCheck) {
        steps.push({
            type: "validateToken",
            config: {
                required: true,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                forwardBody: true,
            },
        });
    }

    steps.push({
        type: "callExternalService",
        config: {
            required: true,
            method: wf.method,
            headers: { "Content-Type": "application/json" },
            forwardBody: wf.method === "POST",
        },
    });

    return steps;
};

async function seedWorkflows(workflows: WorkflowDefinition[]) {
    for (const wf of workflows) {
        const steps = [...buildBaseSteps(wf), ...(wf.extraSteps || [])];

        await prisma.workflowDefinition.upsert({
            where: { workflowId_region: { workflowId: wf.workflowId, region: wf.region } },
            update: {},
            create: {
                workflowId: wf.workflowId,
                region: wf.region,
                name: wf.name,
                definition: {
                    microserviceName: wf.microserviceName,
                    microservicePrefix: wf.microservicePrefix,
                    downstreamEndpoint: wf.downstreamEndpoint,
                    tokenCheck: wf.tokenCheck,
                    otpFlow: wf.otpFlow,
                    notification: wf.notification,
                    steps,
                },
            },
        });

        console.log(`✅ Seeded workflow: ${wf.workflowId} (${wf.region})`);
    }
}

async function main() {
    await prisma.workflowDefinition.deleteMany({});
    console.log("🗑️ Deleted all existing workflow definitions");

    const localWorkflows = await readWorkflowsFromFile("jsons/local-workflows.json");
    const dockerWorkflows = await readWorkflowsFromFile("jsons/docker-workflows.json");

    await seedWorkflows(localWorkflows);
    await seedWorkflows(dockerWorkflows);
}

main()
    .catch((e) => {
        console.error("❌ Error during seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });