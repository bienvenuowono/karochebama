import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, logoutUser, getMeUser, refreshAccessToken } from './use-case';

const REFRESH_TOKEN_COOKIE_NAME = 'karochebama_refresh_token';

// Configuration du cookie de Refresh Token (Sécurisé)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerUser(req.body);

    // Envoyer le refresh token dans un cookie HttpOnly sécurisé
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        // On ne renvoie pas le refresh token dans le corps JSON par sécurité
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body);

    // Envoyer le refresh token dans un cookie HttpOnly sécurisé
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    
    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    // Effacer le cookie
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      data: { message: 'Déconnexion réussie' }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await getMeUser(userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const result = await refreshAccessToken(refreshToken);

    // Rotation du cookie
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
