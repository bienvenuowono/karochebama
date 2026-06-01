import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { ROUTES } from '../index';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestGuardProps {
  children: ReactNode;
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * GuestGuard — Réserve les routes aux utilisateurs NON authentifiés.
 *
 * Comportement :
 * - Si l'utilisateur EST authentifié → redirect vers /dashboard
 *   (ou vers l'URL d'origine préservée dans le state de navigation).
 * - Si l'utilisateur N'EST PAS authentifié → rend les enfants normalement.
 *
 * Usage :
 * ```tsx
 * <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 * ```
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    // Rediriger vers l'URL d'origine si elle existe, sinon vers le dashboard
    const from =
      (location.state as { from?: Location } | null)?.from?.pathname ??
      ROUTES.APP.DASHBOARD;

    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
