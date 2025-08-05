import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './middleware/logger';
import workflowRoutes from './routes/workflow-routes';

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

// app.use('/v1/api/health', healthRoutes);
app.use(`/${process.env.API_VERSION}/api/workflow-engine`, workflowRoutes);

export default app;

// http://localhost:1606/v1/api/worflow-engine/:workflowIdId?region=local&apiVersion=v1&method=GET