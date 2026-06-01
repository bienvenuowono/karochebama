import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../config/database';
import { RegisterInput, LoginInput } from './validation';
import { BadRequestError, UnauthorizedError } from '../../core/errors/appError';
import { env } from '../../config/env';

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateTokens = (userId: string, role: string, organizationId: string) => {
  const payload = { userId, role, organizationId };
  
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = crypto.randomBytes(40).toString('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

  return { accessToken, refreshToken, expiresAt };
};

// ─── Use Cases ───────────────────────────────────────────────────────────────

export const registerUser = async (data: RegisterInput) => {
  const { email, password, firstName, lastName, organizationName } = data;

  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new BadRequestError('Un utilisateur avec cet email existe déjà');
  }

  // 2. Générer le slug de l'organisation
  const slug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const existingOrg = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existingOrg) {
    throw new BadRequestError('Ce nom d\'organisation est déjà pris');
  }

  // 3. Récupérer le rôle ADMIN (le créateur d'une organisation est ADMIN)
  let adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' }
  });

  if (!adminRole) {
    // Fallback if roles aren't seeded yet (for dev)
    adminRole = await prisma.role.create({
      data: { name: 'ADMIN', description: 'Administrateur de l\'organisation' }
    });
  }

  // 4. Hasher le mot de passe avec argon2
  const passwordHash = await argon2.hash(password);

  // 5. Transaction: Créer l'organisation et l'utilisateur en même temps
  const result = await prisma.$transaction(async (tx) => {
    const newOrg = await tx.organization.create({
      data: {
        name: organizationName,
        slug,
      },
    });

    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        organizationId: newOrg.id,
        roleId: adminRole!.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: { select: { name: true } },
        organization: { select: { id: true, name: true, slug: true } }
      }
    });

    return { user: newUser, organization: newOrg };
  });

  // 6. Générer les tokens
  const { accessToken, refreshToken, expiresAt } = generateTokens(
    result.user.id, 
    result.user.role.name, 
    result.organization.id
  );

  // 7. Enregistrer le refresh token en DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: result.user.id,
      expiresAt,
    }
  });

  return {
    user: result.user,
    accessToken,
    refreshToken
  };
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  // 1. Trouver l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      organization: true
    }
  });

  if (!user) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  // 2. Vérifier le mot de passe
  const isMatch = await argon2.verify(user.passwordHash, password);
  if (!isMatch) {
    throw new UnauthorizedError('Email ou mot de passe incorrect');
  }

  // 3. Générer les tokens
  const { accessToken, refreshToken, expiresAt } = generateTokens(
    user.id, 
    user.role.name, 
    user.organizationId
  );

  // 4. Enregistrer le refresh token en DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    }
  });

  // 5. Nettoyer l'objet user retourné
  const { passwordHash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
};

export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) return;
  
  // Supprimer le token de la base
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken }
  });
};

export const getMeUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: { select: { name: true } },
      organization: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!user) {
    throw new UnauthorizedError('Utilisateur introuvable.');
  }

  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token manquant.');
  }

  // Vérifier que le token existe en DB et n'est pas révoqué ni expiré
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        include: { role: true, organization: true },
      },
    },
  });

  if (!tokenRecord) {
    throw new UnauthorizedError('Refresh token invalide ou expiré.');
  }

  const { user } = tokenRecord;

  // Générer de nouveaux tokens
  const { accessToken, refreshToken: newRefreshToken, expiresAt } = generateTokens(
    user.id,
    user.role.name,
    user.organizationId
  );

  // Rotation du refresh token : invalider l'ancien, créer le nouveau
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt },
    }),
  ]);

  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken: newRefreshToken };
};
