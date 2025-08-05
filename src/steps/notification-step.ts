import axios from 'axios';

export async function handleNotification(config: any, context: any): Promise<any> {
    try {
        const { notificationUrl, scenarioId } = config;
        const { email, userId } = context;

        const payload = {
            gearId: config.gearId || "1625",
            scenarioId: scenarioId || "00002",
            userEmail: email,
            emailOTP: true,
            mobileOTP: false
        };

        const response = await axios.post(notificationUrl, payload);

        return {
            data: {
                notificationStatus: response.data.status || "SENT",
                notificationId: response.data.id || null
            }
        };
    } catch (err: any) {
        return { error: `Notification failed: ${err.message}` };
    }
}