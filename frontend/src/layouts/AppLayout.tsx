import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  Search, 
  Bell, 
  X,
  Zap,
  ChevronDown
} from 'lucide-react';
import { ROUTES } from '@routes/index';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: ROUTES.APP.DASHBOARD },
  { icon: Package, label: 'Produits', path: ROUTES.APP.PRODUCTS },
  { icon: ShoppingCart, label: 'Commandes', path: ROUTES.APP.ORDERS },
  { icon: CreditCard, label: 'Facturation', path: ROUTES.APP.BILLING },
  { icon: BarChart3, label: 'Analytiques', path: ROUTES.APP.ANALYTICS },
];

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ── SIDEBAR (Desktop) ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed h-full z-20">
        
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-border">
          <Link to={ROUTES.ROOT} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">KAROCHEBAMA</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Menu principal</p>
          
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground'} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-1.5">
          <Link 
            to={ROUTES.APP.SETTINGS} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings size={18} />
            Paramètres
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MOBILE MENU (Overlay) ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-border">
                <Link to={ROUTES.ROOT} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-foreground">KAROCHEBAMA</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        
        {/* Header (Topbar) */}
        <header className="h-[72px] bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Notifications */}
            <button className="relative p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-amber-500 p-0.5">
                <div className="w-full h-full rounded-full border-2 border-card overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f8fafc" alt="Avatar" className="w-full h-full object-cover bg-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">Jean Dupont</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
