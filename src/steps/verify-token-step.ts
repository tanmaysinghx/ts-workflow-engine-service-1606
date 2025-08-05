export async function handleTokenValidation(config: any, context: any): Promise<any> {
    const token = context.token;

    // Example token verification logic
    const isValid = token === 'valid-token'; // Dummy check
    if (!isValid) return { error: 'Invalid token' };

    return { data: { userId: 'abc123' } };
}