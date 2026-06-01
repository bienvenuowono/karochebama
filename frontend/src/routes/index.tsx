import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';

// ─── Route Constants ───────────────────────────────────────────────────────────
/**
 * Objet centralisé de toutes les routes de l'application.
 * Évite les chaînes de caractères magiques dispersées dans le code.
 *
 * Usage : <Link to={ROUTES.AUTH.LOGIN} />
 *         navigate(ROUTES.APP.DASHBOARD)
 */
export const ROUTES = {
  // Routes publiques
  ROOT: '/',
  MARKETPLACE: '/marketplace',
  PRODUCT_DETAIL: '/product/:id',
  BLOG: '/blog',
  MEDIATHEQUE: '/mediatheque',
  COMMERCIAL: '/commercial',
  PARTNERSHIP: '/partnership',
  CONTACT: '/contact',

  // Routes auth (invités uniquement)
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
  },

  // Routes applicatives (authentification requise)
  APP: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Modules métier (placeholders — à étendre par feature)
    PRODUCTS: '/products',
    PRODUCTS_NEW: '/products/new',
    PRODUCTS_DETAIL: '/products/:id',
    PRODUCTS_EDIT: '/products/:id/edit',

    ORDERS: '/orders',
    ORDERS_DETAIL: '/orders/:id',

    BILLING: '/billing',
    ANALYTICS: '/analytics',
    TEAM: '/team',
  },

  // Routes admin (super-admin uniquement)
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    TENANTS: '/admin/tenants',
    SUBSCRIPTIONS: '/admin/subscriptions',
    SETTINGS: '/admin/settings',
  },

  // Routes d'erreur
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
} as const;

// ─── Lazy Imports (Code Splitting) ────────────────────────────────────────────
/**
 * Chaque page est chargée dynamiquement (lazy) via Vite.
 * Réduit le bundle initial et améliore le LCP (Largest Contentful Paint).
 */

// Auth pages
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));

// Public pages
const HomePage = lazy(() => import('@pages/public/HomePage'));
const MarketplacePage = lazy(() => import('@pages/public/MarketplacePage'));
const ProductDetailPage = lazy(() => import('@pages/public/ProductDetailPage'));
const BlogPage = lazy(() => import('@pages/public/BlogPage'));
const MediathequePage = lazy(() => import('@pages/public/MediathequePage'));
const CommercialPage = lazy(() => import('@pages/public/CommercialPage'));
const PartnershipPage = lazy(() => import('@pages/public/PartnershipPage'));
const ContactPage = lazy(() => import('@pages/public/ContactPage'));

// App pages
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const ProductsPage = lazy(() => import('@pages/dashboard/ProductsPage'));
const OrdersPage = lazy(() => import('@pages/dashboard/OrdersPage'));
const BillingPage = lazy(() => import('@pages/dashboard/BillingPage'));
const SettingsPage = lazy(() => import('@pages/dashboard/SettingsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@pages/admin/AdminUsersPage'));
const AdminTenantsPage = lazy(() => import('@pages/admin/AdminTenantsPage'));
const AdminSubscriptionsPage = lazy(() => import('@pages/admin/AdminSubscriptionsPage'));

// Error pages
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@pages/UnauthorizedPage'));

// Layouts (importés directement — pas de lazy, toujours en mémoire)
// Note : Les layouts seront créés au Module 3. Importés ici pour la structure.
// En attendant, on utilise des fragments temporaires.
import { PublicLayout } from '@layouts/PublicLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { AppLayout } from '@layouts/AppLayout';
import { AdminLayout } from '@layouts/AdminLayout';

// ─── Page Loading Fallback ────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner premium — remplacé par le composant Spinner au Module 4 */}
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

/**
 * AppRoutes — Routeur principal de l'application KAROCHEBAMA.
 *
 * Architecture :
 * - Routes invités (GuestGuard) → AuthLayout → Login, Register
 * - Routes protégées (AuthGuard) → AppLayout → Dashboard, etc.
 * - Routes d'erreur → Standalone (sans layout)
 * - Wildcard (*) → redirect 404
 *
 * Pattern :
 *   <Route element={<Guard><Layout /></Guard>}>
 *     <Route path="..." element={<Page />} />
 *   </Route>
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Routes PUBLIQUES ───────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.ROOT} element={<HomePage />} />
          <Route path={ROUTES.MARKETPLACE} element={<MarketplacePage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.MEDIATHEQUE} element={<MediathequePage />} />
          <Route path={ROUTES.COMMERCIAL} element={<CommercialPage />} />
          <Route path={ROUTES.PARTNERSHIP} element={<PartnershipPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        </Route>

        {/* ── Routes AUTH (invités uniquement) ───────────────────────── */}
        <Route
          element={
            <GuestGuard>
              <AuthLayout />
            </GuestGuard>
          }
        >
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* ── Routes APP (authentification requise) ──────────────────── */}
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          {/* Dashboard */}
          <Route path={ROUTES.APP.DASHBOARD} element={<DashboardPage />} />

          {/* Profil & Paramètres (stubs — développés par feature) */}
          <Route
            path={ROUTES.APP.PROFILE}
            element={<PlaceholderPage title="Profil" />}
          />
          <Route
            path={ROUTES.APP.SETTINGS}
            element={<SettingsPage />}
          />

          {/* Modules métier — stubs */}
          <Route
            path={ROUTES.APP.PRODUCTS}
            element={<ProductsPage />}
          />
          <Route
            path={ROUTES.APP.ORDERS}
            element={<OrdersPage />}
          />
          <Route
            path={ROUTES.APP.BILLING}
            element={<BillingPage />}
          />
          <Route
            path={ROUTES.APP.ANALYTICS}
            element={<PlaceholderPage title="Analytiques" />}
          />
          <Route
            path={ROUTES.APP.TEAM}
            element={<PlaceholderPage title="Équipe" />}
          />
        </Route>

        {/* ── Routes ADMIN (super-admin) ─────────────────────────────── */}
        <Route
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN.USERS} element={<AdminUsersPage />} />
          <Route path={ROUTES.ADMIN.TENANTS} element={<AdminTenantsPage />} />
          <Route path={ROUTES.ADMIN.SUBSCRIPTIONS} element={<AdminSubscriptionsPage />} />
          <Route path={ROUTES.ADMIN.SETTINGS} element={<PlaceholderPage title="Paramètres" />} />
        </Route>

        {/* ── Routes d'erreur (standalone) ───────────────────────────── */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* ── Wildcard — toute route inconnue → 404 ──────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />

      </Routes>
    </Suspense>
  );
}

// ─── Placeholder interne ──────────────────────────────────────────────────────
/**
 * Page placeholder générique utilisée pour les routes modules métier.
 * Sera remplacée page par page lors du développement des features.
 */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-display font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ce module est en cours de développement.
        </p>
      </div>
    </div>
  );
}
