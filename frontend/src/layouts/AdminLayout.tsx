import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Users, 
  Building2, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  Search, 
  Bell, 
  X,
  Zap,
  Activity
} from 'lucide-react';
import { ROUTES } from '@routes/index';

const ADMIN_SIDEBAR_ITEMS = [
  { icon: Activity, label: 'Vue d\'ensemble', path: ROUTES.ADMIN?.DASHBOARD || '/admin' },
  { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
  { icon: Building2, label: 'Organisations', path: '/admin/tenants' },
  { icon: CreditCard, label: 'Abonnements', path: '/admin/subscriptions' },
  { icon: Settings, label: 'Paramètres Plateforme', path: '/admin/settings' },
];

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans text-neutral-100">
      
      {/* ── SIDEBAR ADMIN (Desktop) ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 fixed h-full z-20 shadow-xl">
        
        {/* Logo & Admin Badge */}
        <div className="h-[72px] flex flex-col justify-center px-6 border-b border-neutral-800 bg-neutral-950/50">
          <Link to={ROUTES.ROOT} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">SUPER ADMIN</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Gestion Plateforme</p>
          
          {ADMIN_SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-red-500' : 'text-neutral-500'} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/50">
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Quitter l'Admin
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-950">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-white">SUPER ADMIN</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {ADMIN_SIDEBAR_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
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
        <header className="h-[72px] bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-neutral-400 hover:bg-neutral-800 lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Admin Warning Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
              <Zap size={14} className="animate-pulse" />
              Accès restreint
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Global Search */}
            <div className="hidden md:flex items-center relative mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Recherche globale (ID, Email)..." 
                className="w-64 pl-9 pr-4 py-1.5 rounded-full border border-neutral-700 bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm text-white placeholder:text-neutral-500 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-neutral-950" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-neutral-800">
              <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Admin" alt="Avatar Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden relative">
          {/* Subtle grid background for tech feel */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
          <div className="w-full max-w-[1600px] mx-auto relative z-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
