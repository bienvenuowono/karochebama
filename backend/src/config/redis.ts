import { createClient } from 'redis';
import { env } from './env';
import logger from './logger';

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // En dev, on stoppe les tentatives après 3 essais
      if (retries >= 3) {
        logger.warn('Redis indisponible après 3 tentatives — mode dégradé activé.');
        return false; // Arrête les reconnexions
      }
      return Math.min(retries * 200, 1000);
    },
  },
});

redisClient.on('error', (err) => {
  // On log seulement si ce n'est pas un simple ECONNREFUSED répété
  if ((err as NodeJS.ErrnoException).code !== 'ECONNREFUSED') {
    logger.error('Redis Client Error', { error: err });
  }
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

/**
 * Tente de se connecter à Redis avec un timeout de 3 secondes.
 * Si Redis n'est pas disponible, le serveur démarre quand même en mode dégradé.
 */
export const connectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) return;

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout (3s)')), 3000)
    );
    await Promise.race([redisClient.connect(), timeout]);
    logger.info('Connexion Redis établie avec succès.');
  } catch (err) {
    logger.warn('Redis non disponible — le serveur démarre en mode dégradé (rate limiting en mémoire).', {
      error: (err as Error).message,
    });
    // On ne propage pas l'erreur — Redis est optionnel en développement
  }
};

export default redisClient;
