import { Router } from 'express';
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import productRoutes from './modules/products/routes';
import orderRoutes from './modules/orders/routes';
import projectRoutes from './modules/projects/routes';
import dashboardRoutes from './modules/dashboard/routes';
import blogRoutes from './modules/blog/routes';
import mediaRoutes from './modules/media/routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/blog', blogRoutes);
apiRouter.use('/media', mediaRoutes);

export default apiRouter;
