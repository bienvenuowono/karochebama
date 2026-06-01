export interface CurrentUser {
  id: string;
  email: string;
  role: string; // Le nom du rôle (ex: 'SUPER_ADMIN', 'ADMIN', 'USER')
  organizationId: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string; // Le nom du rôle (ex: 'SUPER_ADMIN', 'ADMIN', 'USER')
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser;
      organizationId?: string;
    }
  }
}
