import jwt, { JwtPayload } from 'jsonwebtoken';

export async function validateTokenStep(config: any, context: any, workflowConfig?: any): Promise<any> {
    try {
        // Read Authorization header
        const authHeader =
            context.headers?.['authorization'] ||
            context.headers?.['Authorization'];

        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authorization header malformed or missing');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        if (typeof decoded === 'string' || !decoded.email) {
            throw new Error('Invalid token payload');
        }
        context.user = {
            email: decoded.email,
            ...decoded,
        };

        return { data: { message: `Token verified for ${decoded.email}` } };
    } catch (err: any) {
        return { error: `Token verification failed: ${err.message}` };
    }
}
