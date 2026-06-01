import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import { ROUTES } from '@routes/index';

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">

      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,.6) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Orbe lumineux */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto">

        {/* Numéro 404 animé */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative inline-block mb-6"
        >
          {/* Texte 404 en arrière-plan décoratif */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] font-display font-black
                       text-transparent bg-clip-text select-none pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(135deg, hsl(160 84% 39% / 0.12), hsl(45 70% 50% / 0.08))',
              WebkitBackgroundClip: 'text',
            }}
            aria-hidden="true"
          >
            404
          </span>

          {/* Icône centrale */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto"
          >
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-950/30 border border-primary-200 dark:border-primary-800/40 flex items-center justify-center shadow-glow">
              <Compass className="w-14 h-14 sm:w-16 sm:h-16 text-primary-500" strokeWidth={1.5} />
            </div>
          </motion.div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Page introuvable
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
            Vérifiez l'URL ou retournez à l'accueil.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            id="not-found-back"
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
            id="not-found-home"
            onClick={() => navigate(ROUTES.APP.DASHBOARD)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                       text-white font-medium text-sm
                       transition-all duration-200 shadow-sm hover:shadow-glow w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Tableau de bord
          </button>
        </motion.div>

        {/* Code d'erreur discret */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-xs text-muted-foreground/50 font-mono"
        >
          ERROR_CODE: 404 · PAGE_NOT_FOUND
        </motion.p>
      </div>
    </div>
  );
}
