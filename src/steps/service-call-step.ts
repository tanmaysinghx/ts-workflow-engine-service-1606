import axios from 'axios';

export async function callExternalService(config: any, context: any, workflowConfig?: any): Promise<any> {
    try {
        // Destructure values from the step config
        const { url, method = 'POST', headers = {}, forwardBody = true } = config;

        // Fallback to build serviceUrl using workflowConfig if not directly provided
        const finalUrl =
            url ||
            (workflowConfig?.microservicePrefix && workflowConfig?.downstreamEndpoint
                ? `${workflowConfig.microservicePrefix}${workflowConfig.downstreamEndpoint}`
                : undefined);

        if (!finalUrl) {
            throw new Error('Service URL is missing. Provide "serviceUrl" in step config or "microservicePrefix" and "downstreamEndpoint" in workflow config.');
        }

        const response = await axios({
            method,
            url: finalUrl,
            data: forwardBody ? context.body : undefined,
            headers,
        });

        return { data: response.data };
    } catch (err: any) {
        return { error: `Service call failed: ${err.message}` };
    }
}
