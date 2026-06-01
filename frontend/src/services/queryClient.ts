import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Évite de recharger à chaque changement d'onglet
      retry: 1, // Limite le nombre de tentatives en cas d'échec
      staleTime: 5 * 60 * 1000, // Les données sont considérées fraîches pendant 5 minutes
    },
  },
});

export default queryClient;
