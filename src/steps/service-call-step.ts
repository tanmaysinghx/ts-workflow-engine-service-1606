import axios from 'axios';
import logger from '../utils/logger';

export async function callExternalService(config: any, context: any, workflowConfig?: any): Promise<any> {
    try {
        const { url, method = 'POST', headers = {}, forwardBody = true } = config;

        const finalUrl =
            url ||
            (workflowConfig?.microservicePrefix && workflowConfig?.downstreamEndpoint
                ? `${workflowConfig.microservicePrefix}${workflowConfig.downstreamEndpoint}`
                : undefined);

        if (!finalUrl) {
            throw new Error('Service URL is missing. Provide "serviceUrl" in step config or "microservicePrefix" and "downstreamEndpoint" in workflow config.');
        }

        logger.info(`Calling external service: ${finalUrl} with method: ${method}`);

        const response = await axios({
            method,
            url: finalUrl,
            data: forwardBody ? context.body : undefined,
            headers,
        });

        return { data: response.data, headers: response.headers };
    } catch (err: any) {
        return { error: `Service call failed: ${err.message}` };
    }
}
