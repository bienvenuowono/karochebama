import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../../config/redis';
import logger from '../../config/logger';

/**
 * Crée un store Redis pour le rate limiter uniquement si Redis est connecté.
 * Retourne undefined pour utiliser le store mémoire par défaut en cas de Redis indisponible.
 */
const createRedisStore = (): RedisStore | undefined => {
  try {
    if (redisClient.isOpen) {
      return new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      });
    }
    logger.warn('Redis non connecté — rate limiter en mode mémoire (développement uniquement).');
    return undefined;
  } catch (err) {
    logger.warn('Impossible de créer le RedisStore — mode mémoire activé.', { error: err });
    return undefined;
  }
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true, // Renvoie les en-têtes de limitation dans la réponse
  legacyHeaders: false, // Désactive les anciens en-têtes X-RateLimit-*
  store: createRedisStore(),
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard.',
    },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limite stricte de 15 requêtes pour l'authentification
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore(),
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Trop de tentatives d\'authentification. Veuillez réessayer dans 15 minutes.',
    },
  },
});
