import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './middleware/logger';
import workflowRoutes from './routes/workflow-routes';
import register, { getMetrics } from './utils/metrics';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(logger);

/* Swagger docs */
setupSwagger(app);

/* API routes */
// app.use('/v1/api/health', healthRoutes);
app.use(`/${process.env.API_VERSION}/api/workflow-engine`, workflowRoutes);

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await getMetrics());
});

export default app;