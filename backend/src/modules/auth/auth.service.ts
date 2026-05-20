import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { RegisterInput, LoginInput } from './auth.validation';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRATION || '7d';

class AuthService {
  async register(data: RegisterInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        role: true,
      },
    });
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(String(user.id), user.role);
    const refreshToken = this.generateRefreshToken(String(user.id));

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  generateAccessToken(userId: string, role: string) {
    if (!ACCESS_SECRET) {
      throw new Error('FATAL: JWT_ACCESS_SECRET is not configured');
    }
    return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXP as any });
  }

  generateRefreshToken(userId: string) {
    if (!REFRESH_SECRET) {
      throw new Error('FATAL: JWT_REFRESH_SECRET is not configured');
    }
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXP as any });
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { refreshToken: null },
    });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    if (!REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.userId) },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(String(user.id), user.role);
      const newRefreshToken = this.generateRefreshToken(String(user.id));

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Invalid or expired refresh token');
    }
  }
}

export default new AuthService();
