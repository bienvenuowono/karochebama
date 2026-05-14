import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import prisma from './config/prisma';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import catalogRoutes from './modules/catalog/routes/catalog.routes';
import productionRoutes from './modules/production/routes/production.routes';
import activityRoutes from './modules/activities/activity.routes';
import projectRoutes from './modules/projects/project.routes';
import mediaRoutes from './modules/media/media.routes';
import newsRoutes from './modules/news/news.routes';
import uploadRoutes from './modules/upload/upload.routes';
import userRoutes from './modules/users/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes - Clean Architecture Implementation
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/production', productionRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/users', userRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Karochebama Pro Backend is running' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const bootstrap = async () => {
  try {
    // Check if admin exists
    const adminEmail = 'admin@karochebama.com';
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    
    if (!admin) {
      console.log('--- Creating Default Admin User ---');
      const hashedPassword = await bcrypt.hash('Admin2024!', 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Karochebama',
          role: 'ADMIN',
        },
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Fatal error during bootstrap:', error);
    process.exit(1);
  }
};

bootstrap();

export default app;
