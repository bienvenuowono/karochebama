import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { ROUTES } from '@routes/index';
import { useAuthStore } from '@store/useAuthStore';
import { apiClient } from '@services/apiClient';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? ROUTES.APP.DASHBOARD;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      // TODO: Afficher un toast d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Logo mobile */}
      <div className="flex items-center gap-2 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">KAROCHEBAMA</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* En-tête */}
        <motion.div variants={itemVariants} className="space-y-1">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Bon retour 👋
          </h2>
          <p className="text-muted-foreground text-sm">
            Connectez-vous à votre espace de travail.
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-semibold text-foreground">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-semibold text-foreground">
                Mot de passe
              </label>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                       text-white font-bold text-sm
                       transition-all duration-200 shadow-glow
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
                       mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Connexion en cours…
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        {/* Séparateur */}
        <motion.div variants={itemVariants} className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground uppercase tracking-widest font-semibold">
              Ou
            </span>
          </div>
        </motion.div>

        {/* Lien inscription */}
        <motion.div variants={itemVariants}>
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                       bg-card hover:bg-muted border border-border
                       text-foreground font-bold text-sm
                       transition-all duration-200"
          >
            Créer un compte gratuit
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
