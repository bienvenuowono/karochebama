import { AppRoutes } from '@routes/index';

/**
 * Composant racine de l'application.
 *
 * App est volontairement minimal : il délègue toute la logique
 * de rendu aux routes définies dans @routes/index.
 * Les providers (QueryClient, Router, Theme...) sont gérés
 * dans AppProviders (src/providers/AppProviders.tsx).
 */
function App() {
  return <AppRoutes />;
}

export default App;
