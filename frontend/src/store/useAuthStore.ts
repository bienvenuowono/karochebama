import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  role: string;
  organizationId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  checkAuth: async () => {
    try {
      // Tente de récupérer l'utilisateur courant via le cookie de rafraîchissement
      // Note: /auth/me ne retourne que l'utilisateur, pas d'accessToken
      const response = await apiClient.get('/auth/me');
      const { user } = response.data.data;
      set({ user, isAuthenticated: true, isInitialized: true });
    } catch (_error) {
      // Utilisateur non connecté ou session expirée — état normal
      set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
    }
  }
}));
