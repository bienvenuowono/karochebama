import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { globalRateLimiter } from './core/middlewares/rateLimit.middleware';
import { errorMiddleware } from './core/middlewares/error.middleware';
import apiRouter from './routes';
import { NotFoundError } from './core/errors/appError';
import swaggerDocument from './config/swagger.json';

const app: Express = express();

// Injection du correlationId
app.use((req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || Math.random().toString(36).substring(2, 9);
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

// Middlewares de Sécurité Globaux
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Frontend et Admin locaux
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Limitation de débit globale
app.use(globalRateLimiter);

// Route de diagnostic
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Documentation API Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enregistrement de l'API Router
app.use('/api/v1', apiRouter);

// Gestion des routes inexistantes (404)
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`L'URL demandée ${req.originalUrl} n'existe pas.`));
});

// Gestionnaire d'erreurs global
app.use(errorMiddleware);

export default app;
