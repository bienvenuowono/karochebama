import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@routes/index';

const FEATURES = [
  'Essai gratuit 14 jours, sans carte bancaire',
  'Accès complet à toutes les fonctionnalités',
  'Support prioritaire inclus',
  'Données hébergées en Europe',
];

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      
      {/* ── Panneau gauche — Branding (Masqué sur mobile) ──────────────── */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-primary-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] z-0" />
        <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] z-0" />

        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Header / Logo */}
        <div className="relative z-10 flex justify-between items-center">
          <Link to={ROUTES.ROOT} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-display font-bold text-xl tracking-tight">
              KAROCHEBAMA
            </span>
          </Link>
          <Link to={ROUTES.ROOT} className="text-sm text-primary-200 hover:text-white transition-colors">
            Retour au site
          </Link>
        </div>

        {/* Contenu central */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white text-xs font-medium uppercase tracking-wider">Plateforme Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              L'outil qui propulse <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                votre croissance.
              </span>
            </h1>
            <p className="text-primary-100 text-lg mt-4 leading-relaxed max-w-md">
              Rejoignez plus de 10 000 entreprises qui pilotent leurs produits, commandes et équipes au même endroit.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="space-y-4"
          >
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/90 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Footer branding */}
        <div className="relative z-10">
          <p className="text-primary-200/60 text-sm">
            © 2026 KAROCHEBAMA. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* ── Panneau droit — Outlet (Formulaires) ───────────────────────── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-y-auto w-full relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          <Outlet />
        </div>
        
        {/* Abstract background blobs for right side on desktop */}
        <div className="hidden lg:block absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
