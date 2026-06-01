import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import redisClient from '../../config/redis';
import { TokenPayload } from '../types';
import logger from '../../config/logger';

// Durees de vie par defaut
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 jours en secondes

export class JwtService {
  /**
   * Genere un Access Token à durée de vie courte (15 min)
   */
  public static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Genere un Refresh Token à durée de vie longue (7 jours)
   */
  public static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRY_SECONDS}s`,
    });
  }

  /**
   * Valide un Access Token
   */
  public static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  }

  /**
   * Valide un Refresh Token et s'assure qu'il n'est pas blacklisté dans Redis
   */
  public static async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const isBlacklisted = await this.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Refresh Token révoqué ou invalide.');
    }

    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }

  /**
   * Ajoute un Refresh Token à la blacklist Redis (reconnexion, deconnexion, etc.)
   */
  public static async blacklistRefreshToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as TokenPayload & { exp?: number };
      const now = Math.floor(Date.now() / 1000);
      const remainingSeconds = decoded.exp ? decoded.exp - now : REFRESH_TOKEN_EXPIRY_SECONDS;

      if (remainingSeconds > 0) {
        // Enregistrer dans Redis avec une date d'expiration correspondante au temps de vie restant du token
        await redisClient.set(`blacklist:${token}`, 'true', {
          EX: remainingSeconds,
        });
        logger.info('Refresh Token révoqué et blacklisté avec succès.');
      }
    } catch (error) {
      logger.error('Échec de la mise en blacklist du token dans Redis', { error });
    }
  }

  /**
   * Vérifie si un Refresh Token existe dans la blacklist Redis
   */
  private static async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        return false; // Degradation gracieuse si Redis est injoignable
      }
      const result = await redisClient.get(`blacklist:${token}`);
      return result === 'true';
    } catch (error) {
      logger.error('Erreur de lecture de la blacklist Redis', { error });
      return false;
    }
  }
}
export default JwtService;
