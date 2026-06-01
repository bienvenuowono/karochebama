import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import prisma from './config/database';
import { connectRedis } from './config/redis';

const startServer = async (): Promise<void> => {
  try {
    // 1. Vérification de la connexion à la base de données MySQL via Prisma
    logger.info('Vérification de la connexion base de données MySQL...');
    await prisma.$connect();
    logger.info('Connexion MySQL établie avec succès.');

    // 2. Connexion à Redis
    logger.info('Connexion à Redis...');
    await connectRedis();

    // 3. Lancement de l'écoute HTTP
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Serveur démarré en mode [${env.NODE_ENV}] sur le port ${env.PORT}`);
    });

    // 4. Gestion de l'arrêt gracieux (Graceful Shutdown)
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Signal ${signal} reçu. Fermeture du serveur HTTP...`);
      
      server.close(async () => {
        logger.info('Serveur HTTP fermé.');
        
        try {
          logger.info('Fermeture du client Prisma...');
          await prisma.$disconnect();
          
          logger.info('Arrêt complet de l\'application.');
          process.exit(0);
        } catch (err) {
          logger.error('Erreur lors de la fermeture des connexions:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Échec du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
