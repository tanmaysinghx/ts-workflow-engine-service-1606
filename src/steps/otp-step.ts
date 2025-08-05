export async function handleOTP(config: any, context: any): Promise<any> {
    const email = context.email;

    // Example: send OTP to Redis or Notification Service
    console.log(`Sending OTP to ${email}`);

    return { data: { otpSent: true } };
}