import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, ArrowLeft, Home, Mail } from 'lucide-react';
import { ROUTES } from '@routes/index';
import { useAuthStore } from '@store/useAuthStore';

// ─── Component ────────────────────────────────────────────────────────────────

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">

      {/* Fond décoratif */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(239,68,68,.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(239,68,68,.6) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(at 30% 40%, hsla(0,70%,50%,0.06) 0px, transparent 50%),
            radial-gradient(at 70% 60%, hsla(30,70%,50%,0.04) 0px, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 text-center max-w-md mx-auto">

        {/* Icône animée */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0)',
                '0 0 0 16px rgba(239, 68, 68, 0.08)',
                '0 0 0 0 rgba(239, 68, 68, 0)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-3xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center justify-center"
          >
            <ShieldOff className="w-12 h-12 text-red-500" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Badge erreur */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 mb-4"
        >
          <span className="text-xs font-mono font-medium text-red-600 dark:text-red-400">
            403 · FORBIDDEN
          </span>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Accès refusé
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            {user
              ? `Votre rôle (${user.role}) ne vous autorise pas à accéder à cette ressource.`
              : "Vous n'avez pas les permissions nécessaires pour accéder à cette page."}
          </p>
        </motion.div>

        {/* Encart info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4 mb-6 text-left"
        >
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur ou le support technique.
          </p>
          {user && (
            <p className="text-xs text-muted-foreground/70 mt-2 font-mono">
              Compte : {user.email} · Rôle : {user.role}
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            id="unauthorized-back"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                       bg-card hover:bg-muted border border-border
                       text-foreground font-medium text-sm
                       transition-all duration-200 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <button
            id="unauthorized-home"
            onClick={() => navigate(ROUTES.APP.DASHBOARD)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                       bg-card hover:bg-muted border border-border
                       text-foreground font-medium text-sm
                       transition-all duration-200 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Accueil
          </button>

          <a
            id="unauthorized-support"
            href="mailto:support@karochebama.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                       text-white font-medium text-sm
                       transition-all duration-200 shadow-sm hover:shadow-glow w-full sm:w-auto"
          >
            <Mail className="w-4 h-4" />
            Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
