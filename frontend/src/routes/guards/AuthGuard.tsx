import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { ROUTES } from '../index';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthGuardProps {
  children: ReactNode;
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * AuthGuard — Protège les routes nécessitant une authentification.
 *
 * Comportement :
 * - Si l'utilisateur N'EST PAS authentifié → redirect vers /login
 *   en préservant l'URL courante dans le state (utilisée après connexion).
 * - Si l'utilisateur EST authentifié → rend les enfants normalement.
 *
 * Usage :
 * ```tsx
 * <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 * ```
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Préserver l'URL cible pour rediriger après connexion
    return (
      <Navigate
        to={ROUTES.AUTH.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
