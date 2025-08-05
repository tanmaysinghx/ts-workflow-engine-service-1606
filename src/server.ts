import app from './app';
import dotenv from 'dotenv';;
import logger from './utils/logger';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT ?? 1606;

app.listen(PORT, async () => {
    logger.info(`Server is running on port: ${PORT}`);
    try {
        await connectToDatabase();
        logger.info('Database connection successful');
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Database connection failed: ${error.message}`);
        } else {
            logger.error(`Database connection failed: ${JSON.stringify(error)}`);
        }
    }
});