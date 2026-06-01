import { type ReactNode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './ThemeProvider';
import { queryClient } from '@services/queryClient';
import { useAuthStore } from '@store/useAuthStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppProvidersProps {
  children: ReactNode;
}

// ─── Composition des Providers ────────────────────────────────────────────────
/**
 * Arbre de providers global de l'application.
 */
export function AppProviders({ children }: AppProvidersProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Lance la vérification d'auth au montage
    const authPromise = useAuthStore.getState().checkAuth();

    // Timeout de sécurité : si checkAuth ne répond pas en 8s, on force l'initialisation
    const timeout = setTimeout(() => {
      if (!useAuthStore.getState().isInitialized) {
        useAuthStore.setState({ isInitialized: true });
      }
    }, 8000);

    // Nettoie le timeout une fois que checkAuth a répondu
    authPromise.finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '4px solid #d1fae5',
            borderTopColor: '#059669',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
            Chargement…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="system">
            {children}
          </ThemeProvider>
        </BrowserRouter>

        {/* DevTools React Query — visible uniquement en développement */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
